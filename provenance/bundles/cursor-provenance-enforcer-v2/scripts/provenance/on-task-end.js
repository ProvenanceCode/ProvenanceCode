"use strict";

var fs = require("fs");
var path = require("path");
var childProcess = require("child_process");
var Ajv2020 = require("ajv/dist/2020");
var addFormats = require("ajv-formats");

var ROOT = process.cwd();
var CURSOR_DIR = path.join(ROOT, ".cursor");
var PROV_DIR = path.join(CURSOR_DIR, "provenance");
var SCHEMA_FILE = path.join(
  PROV_DIR,
  "schema",
  "provenance.task.v2.schema.json"
);

function sanitizeTaskId(raw) {
  return String(raw || "")
    .trim()
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function defaultTaskId() {
  var ts = new Date().toISOString().replace(/[:.]/g, "-");
  return "task-" + ts;
}

var TASK_ID = sanitizeTaskId(process.env.CURSOR_TASK_ID || defaultTaskId());

var reviewFile = path.join(PROV_DIR, "reviews", TASK_ID + ".md");
var decisionsFile = path.join(PROV_DIR, "decisions", TASK_ID + ".md");
var risksFile = path.join(PROV_DIR, "risks", TASK_ID + ".json");
var outputFile = path.join(PROV_DIR, "tasks", TASK_ID + ".json");
var flagFile = path.join(PROV_DIR, "flags", TASK_ID + ".json");

function rel(filePath) {
  return path.relative(ROOT, filePath).replace(/\\/g, "/");
}

function readText(filePath) {
  return fs.promises.readFile(filePath, "utf8");
}

function readJson(filePath) {
  return readText(filePath).then(function (text) {
    return JSON.parse(text);
  });
}

function exists(filePath) {
  return fs.promises
    .access(filePath, fs.constants.F_OK)
    .then(function () {
      return true;
    })
    .catch(function () {
      return false;
    });
}

function git(command) {
  try {
    return childProcess.execSync(command, { encoding: "utf8" }).trim();
  } catch (_err) {
    return "";
  }
}

function parseStatusChangedFiles() {
  var lines = git("git status --porcelain").split("\n").filter(Boolean);
  return lines
    .map(function (line) {
      var raw = line.slice(3).trim();
      if (raw.indexOf(" -> ") !== -1) {
        return raw.split(" -> ")[1].trim();
      }
      return raw;
    })
    .filter(Boolean);
}

function normalizeRiskLog(json) {
  if (Array.isArray(json)) {
    return json;
  }
  if (json && typeof json === "object" && Array.isArray(json.risks)) {
    return json.risks;
  }
  return [];
}

function extractDecisionIds(decisionsText) {
  var matches =
    decisionsText.match(/\bDEC-(?:\d{6}|[A-Z]{2,10}-[A-Z0-9]{2,10}-\d{6})\b/g) ||
    [];
  var dedupe = {};
  matches.forEach(function (id) {
    dedupe[id] = true;
  });
  return Object.keys(dedupe).sort();
}

function extractReviewedArtifactsFromReview(reviewText) {
  var matches =
    reviewText.match(
      /\.cursor\/provenance\/(?:tasks|risks)\/[a-zA-Z0-9._/-]+\.(?:json|md)/g
    ) || [];
  var dedupe = {};
  matches.forEach(function (item) {
    dedupe[item] = true;
  });
  var reviewed = Object.keys(dedupe);
  var reviewedTasks = reviewed.filter(function (item) {
    return item.indexOf(".cursor/provenance/tasks/") === 0;
  });
  var reviewedRisks = reviewed.filter(function (item) {
    return item.indexOf(".cursor/provenance/risks/") === 0;
  });
  return {
    reviewedTaskArtifacts: reviewedTasks.sort(),
    reviewedRiskArtifacts: reviewedRisks.sort()
  };
}

function extractStartedAt(reviewText) {
  var m = reviewText.match(/^- startedAt:\s*(.+)$/m);
  if (!m || !m[1]) {
    return null;
  }
  var value = m[1].trim();
  return value || null;
}

Promise.all([
  exists(reviewFile),
  exists(decisionsFile),
  exists(risksFile),
  exists(SCHEMA_FILE)
])
  .then(function (present) {
    if (!present[0]) {
      throw new Error("Missing review artifact: " + rel(reviewFile));
    }
    if (!present[1]) {
      throw new Error("Missing decisions artifact: " + rel(decisionsFile));
    }
    if (!present[2]) {
      throw new Error("Missing risks artifact: " + rel(risksFile));
    }
    if (!present[3]) {
      throw new Error("Missing schema file: " + rel(SCHEMA_FILE));
    }
    return Promise.all([
      readText(reviewFile),
      readText(decisionsFile),
      readJson(risksFile),
      readJson(SCHEMA_FILE)
    ]);
  })
  .then(function (values) {
    var reviewText = values[0];
    var decisionsText = values[1];
    var risksJson = values[2];
    var schema = values[3];

    var riskEntries = normalizeRiskLog(risksJson);
    var openRisks = riskEntries.filter(function (risk) {
      var status = String((risk && risk.status) || "open").toLowerCase();
      return status !== "closed";
    });
    var highOrCriticalOpen = openRisks.filter(function (risk) {
      var severity = String((risk && risk.severity) || "").toLowerCase();
      return severity === "high" || severity === "critical";
    });
    var reviewIndex = extractReviewedArtifactsFromReview(reviewText);
    var decisionIds = extractDecisionIds(decisionsText);
    var riskIds = riskEntries
      .map(function (risk) {
        return String((risk && risk.id) || "");
      })
      .filter(Boolean);

    var endedAt = new Date().toISOString();
    var startedAt =
      process.env.CURSOR_TASK_STARTED_AT || extractStartedAt(reviewText);
    var branch = git("git rev-parse --abbrev-ref HEAD") || "unknown";
    var sha = git("git rev-parse HEAD") || "0000000";

    var provenanceObject = {
      schema: "provenancecode.task-provenance@2.0",
      provenanceCodeVersion: "2.0",
      taskId: TASK_ID,
      status: highOrCriticalOpen.length > 0 ? "blocked" : "completed",
      timestamps: {
        startedAt: startedAt,
        endedAt: endedAt
      },
      runtime: {
        agent: process.env.CURSOR_AGENT_NAME || "cursor",
        model: process.env.CURSOR_MODEL || "unknown-model"
      },
      git: {
        branch: branch,
        commitSha: sha,
        changedFiles: parseStatusChangedFiles()
      },
      review: {
        ruleFile: ".cursor/rules/00-provenance.mdc",
        startReviewArtifact: rel(reviewFile),
        reviewedTaskArtifacts: reviewIndex.reviewedTaskArtifacts,
        reviewedRiskArtifacts: reviewIndex.reviewedRiskArtifacts
      },
      artifacts: {
        review: rel(reviewFile),
        decisions: rel(decisionsFile),
        risks: rel(risksFile)
      },
      decisionIds: decisionIds,
      riskIds: riskIds,
      riskSummary: {
        total: riskEntries.length,
        open: openRisks.length,
        highOrCriticalOpen: highOrCriticalOpen.length,
        needsHumanReview: highOrCriticalOpen.length > 0
      },
      enforcement: {
        validated: false,
        validator: "ajv",
        errors: []
      }
    };

    var ajv = new Ajv2020({ allErrors: true, strict: false });
    addFormats(ajv);
    var validate = ajv.compile(schema);
    var ok = validate(provenanceObject);

    if (!ok) {
      provenanceObject.enforcement.errors = (validate.errors || []).map(
        function (err) {
          return (err.instancePath || "/") + " " + err.message;
        }
      );
      throw new Error(
        "Provenance schema validation failed: " +
          provenanceObject.enforcement.errors.join("; ")
      );
    }

    provenanceObject.enforcement.validated = true;

    return fs.promises
      .writeFile(outputFile, JSON.stringify(provenanceObject, null, 2) + "\n")
      .then(function () {
        if (highOrCriticalOpen.length === 0) {
          return null;
        }
        var flag = {
          schema: "provenancecode.task-flag@2.0",
          taskId: TASK_ID,
          createdAt: endedAt,
          reason: "Open high/critical risks require human review",
          needsHumanReview: true,
          riskIds: highOrCriticalOpen
            .map(function (risk) {
              return String(risk.id || "UNSPECIFIED");
            })
            .filter(Boolean),
          artifacts: {
            task: rel(outputFile),
            risks: rel(risksFile)
          }
        };
        return fs.promises.writeFile(
          flagFile,
          JSON.stringify(flag, null, 2) + "\n"
        );
      })
      .then(function () {
        if (
          highOrCriticalOpen.length > 0 &&
          String(process.env.PROVENANCE_ENFORCE_HARD_FAIL || "") === "1"
        ) {
          throw new Error(
            "Hard fail enabled and open high/critical risks remain."
          );
        }
      });
  })
  .then(function () {
    console.log(
      "[provenance] task-end complete taskId=" +
        TASK_ID +
        " taskArtifact=" +
        rel(outputFile)
    );
  })
  .catch(function (err) {
    console.error("[provenance] task-end failed:", err.message);
    process.exit(1);
  });
