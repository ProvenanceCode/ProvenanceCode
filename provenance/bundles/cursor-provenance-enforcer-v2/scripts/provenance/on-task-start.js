"use strict";

var fs = require("fs");
var path = require("path");

var ROOT = process.cwd();
var CURSOR_DIR = path.join(ROOT, ".cursor");
var PROV_DIR = path.join(CURSOR_DIR, "provenance");
var RULE_FILE = path.join(CURSOR_DIR, "rules", "00-provenance.mdc");

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
var STARTED_AT = process.env.CURSOR_TASK_STARTED_AT || new Date().toISOString();

function ensureDir(dir) {
  return fs.promises.mkdir(dir, { recursive: true });
}

function fileExists(filePath) {
  return fs.promises
    .access(filePath, fs.constants.F_OK)
    .then(function () {
      return true;
    })
    .catch(function () {
      return false;
    });
}

function readJson(filePath) {
  return fs.promises
    .readFile(filePath, "utf8")
    .then(function (text) {
      return JSON.parse(text);
    })
    .catch(function () {
      return null;
    });
}

function listJsonFiles(dir) {
  return fs.promises
    .readdir(dir, { withFileTypes: true })
    .then(function (entries) {
      return entries
        .filter(function (entry) {
          return entry.isFile() && /\.json$/i.test(entry.name);
        })
        .map(function (entry) {
          return path.join(dir, entry.name);
        });
    })
    .catch(function () {
      return [];
    });
}

function sortByMtimeDesc(files) {
  return Promise.all(
    files.map(function (file) {
      return fs.promises
        .stat(file)
        .then(function (stats) {
          return { file: file, mtimeMs: stats.mtimeMs };
        })
        .catch(function () {
          return { file: file, mtimeMs: 0 };
        });
    })
  ).then(function (items) {
    return items
      .sort(function (a, b) {
        return b.mtimeMs - a.mtimeMs;
      })
      .map(function (item) {
        return item.file;
      });
  });
}

function normalizeRiskLog(json) {
  if (!json) {
    return [];
  }
  if (Array.isArray(json)) {
    return json;
  }
  if (Array.isArray(json.risks)) {
    return json.risks;
  }
  return [];
}

function writeIfMissing(filePath, content) {
  return fs.promises
    .writeFile(filePath, content, { encoding: "utf8", flag: "wx" })
    .catch(function (err) {
      if (err && err.code === "EEXIST") {
        return null;
      }
      throw err;
    });
}

function rel(filePath) {
  return path.relative(ROOT, filePath).replace(/\\/g, "/");
}

var reviewDir = path.join(PROV_DIR, "reviews");
var decisionsDir = path.join(PROV_DIR, "decisions");
var risksDir = path.join(PROV_DIR, "risks");
var tasksDir = path.join(PROV_DIR, "tasks");
var flagsDir = path.join(PROV_DIR, "flags");
var schemaDir = path.join(PROV_DIR, "schema");

var reviewFile = path.join(reviewDir, TASK_ID + ".md");
var decisionsFile = path.join(decisionsDir, TASK_ID + ".md");
var risksFile = path.join(risksDir, TASK_ID + ".json");

var reviewedTaskArtifacts = [];
var reviewedRiskArtifacts = [];
var openRiskRefs = [];

Promise.all([
  ensureDir(reviewDir),
  ensureDir(decisionsDir),
  ensureDir(risksDir),
  ensureDir(tasksDir),
  ensureDir(flagsDir),
  ensureDir(schemaDir)
])
  .then(function () {
    return fileExists(RULE_FILE);
  })
  .then(function (ruleExists) {
    if (!ruleExists) {
      throw new Error(
        "Missing provenance rule file: " + rel(RULE_FILE) + "."
      );
    }
    return Promise.all([listJsonFiles(tasksDir), listJsonFiles(risksDir)]);
  })
  .then(function (fileLists) {
    var taskFiles = fileLists[0];
    var riskFiles = fileLists[1];
    return Promise.all([sortByMtimeDesc(taskFiles), sortByMtimeDesc(riskFiles)]);
  })
  .then(function (sortedLists) {
    var recentTaskFiles = sortedLists[0]
      .filter(function (file) {
        return !/\.start\.json$/i.test(file);
      })
      .slice(0, 10);
    reviewedTaskArtifacts = recentTaskFiles.map(rel);

    var recentRiskFiles = sortedLists[1].slice(0, 10);
    reviewedRiskArtifacts = recentRiskFiles.map(rel);

    return Promise.all(
      recentRiskFiles.map(function (riskFilePath) {
        return readJson(riskFilePath).then(function (json) {
          return {
            file: riskFilePath,
            risks: normalizeRiskLog(json)
          };
        });
      })
    );
  })
  .then(function (riskLogs) {
    openRiskRefs = [];
    riskLogs.forEach(function (entry) {
      entry.risks.forEach(function (risk) {
        if (
          risk &&
          typeof risk === "object" &&
          String(risk.status || "open").toLowerCase() !== "closed"
        ) {
          openRiskRefs.push({
            file: rel(entry.file),
            id: String(risk.id || "UNSPECIFIED"),
            severity: String(risk.severity || "unknown"),
            status: String(risk.status || "open"),
            needsHumanReview: Boolean(risk.needsHumanReview)
          });
        }
      });
    });

    var reviewContent = [
      "# Provenance Start Review",
      "",
      "- taskId: " + TASK_ID,
      "- startedAt: " + STARTED_AT,
      "- ruleFile: " + rel(RULE_FILE),
      "- reviewedTaskArtifacts: " + reviewedTaskArtifacts.length,
      "- reviewedRiskArtifacts: " + reviewedRiskArtifacts.length,
      "",
      "## Reviewed prior task artifacts",
      reviewedTaskArtifacts.length
        ? reviewedTaskArtifacts.map(function (item) {
            return "- " + item;
          }).join("\n")
        : "- none",
      "",
      "## Reviewed risk artifacts",
      reviewedRiskArtifacts.length
        ? reviewedRiskArtifacts.map(function (item) {
            return "- " + item;
          }).join("\n")
        : "- none",
      "",
      "## Open risk references",
      openRiskRefs.length
        ? openRiskRefs
            .map(function (risk) {
              return (
                "- " +
                risk.id +
                " (" +
                risk.severity +
                ", " +
                risk.status +
                ", needsHumanReview=" +
                risk.needsHumanReview +
                ") from " +
                risk.file
              );
            })
            .join("\n")
        : "- none",
      "",
      "## Pre-implementation checks",
      "- [ ] Reviewed provenance rules",
      "- [ ] Reviewed prior decisions",
      "- [ ] Reviewed prior risks",
      "- [ ] Logged initial safeguards"
    ].join("\n");

    var decisionsContent = [
      "# Decisions Log",
      "",
      "- taskId: " + TASK_ID,
      "- startedAt: " + STARTED_AT,
      "",
      "## Decisions",
      "- Add decision records here using ProvenanceCode IDs when possible.",
      "- Example: DEC-PQS-FE-000123: Explain the decision and rationale.",
      "",
      "## Guardrails from start review",
      "- List controls chosen to avoid repeated mistakes."
    ].join("\n");

    var risksContent = JSON.stringify(
      {
        schema: "provenancecode.risklog@2.0",
        taskId: TASK_ID,
        createdAt: STARTED_AT,
        risks: []
      },
      null,
      2
    );

    return Promise.all([
      writeIfMissing(reviewFile, reviewContent + "\n"),
      writeIfMissing(decisionsFile, decisionsContent + "\n"),
      writeIfMissing(risksFile, risksContent + "\n")
    ]);
  })
  .then(function () {
    console.log(
      "[provenance] task-start complete taskId=" +
        TASK_ID +
        " review=" +
        rel(reviewFile)
    );
  })
  .catch(function (err) {
    console.error("[provenance] task-start failed:", err.message);
    process.exit(1);
  });
