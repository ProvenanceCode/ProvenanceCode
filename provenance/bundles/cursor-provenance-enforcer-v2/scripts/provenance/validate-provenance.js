"use strict";

var fs = require("fs");
var path = require("path");
var Ajv2020 = require("ajv/dist/2020");
var addFormats = require("ajv-formats");

var ROOT = process.cwd();
var PROV_DIR = path.join(ROOT, ".cursor", "provenance");
var SCHEMA_FILE = path.join(
  PROV_DIR,
  "schema",
  "provenance.task.v2.schema.json"
);
var TASKS_DIR = path.join(PROV_DIR, "tasks");
var FLAGS_DIR = path.join(PROV_DIR, "flags");

function rel(filePath) {
  return path.relative(ROOT, filePath).replace(/\\/g, "/");
}

function readJson(filePath) {
  return fs.promises.readFile(filePath, "utf8").then(function (text) {
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

function listTaskArtifacts() {
  return fs.promises
    .readdir(TASKS_DIR, { withFileTypes: true })
    .then(function (entries) {
      return entries
        .filter(function (entry) {
          return entry.isFile() && /\.json$/i.test(entry.name);
        })
        .map(function (entry) {
          return path.join(TASKS_DIR, entry.name);
        });
    })
    .catch(function () {
      return [];
    });
}

readJson(SCHEMA_FILE)
  .then(function (schema) {
    var ajv = new Ajv2020({ allErrors: true, strict: false });
    addFormats(ajv);
    var validate = ajv.compile(schema);

    return listTaskArtifacts().then(function (taskFiles) {
      if (taskFiles.length === 0) {
        console.log("[provenance] no task artifacts found to validate");
        return [];
      }

      return Promise.all(
        taskFiles.map(function (taskFile) {
          return readJson(taskFile)
            .then(function (artifact) {
              var errors = [];
              var ok = validate(artifact);

              if (!ok) {
                errors = errors.concat(
                  (validate.errors || []).map(function (err) {
                    return (
                      rel(taskFile) + " => " + (err.instancePath || "/") + " " + err.message
                    );
                  })
                );
              }

              if (
                artifact &&
                artifact.artifacts &&
                artifact.artifacts.review &&
                artifact.artifacts.decisions &&
                artifact.artifacts.risks
              ) {
                return Promise.all([
                  exists(path.join(ROOT, artifact.artifacts.review)),
                  exists(path.join(ROOT, artifact.artifacts.decisions)),
                  exists(path.join(ROOT, artifact.artifacts.risks))
                ]).then(function (checks) {
                  if (!checks[0]) {
                    errors.push(
                      rel(taskFile) +
                        " => missing review artifact " +
                        artifact.artifacts.review
                    );
                  }
                  if (!checks[1]) {
                    errors.push(
                      rel(taskFile) +
                        " => missing decisions artifact " +
                        artifact.artifacts.decisions
                    );
                  }
                  if (!checks[2]) {
                    errors.push(
                      rel(taskFile) +
                        " => missing risks artifact " +
                        artifact.artifacts.risks
                    );
                  }
                  return {
                    taskFile: taskFile,
                    taskId: artifact.taskId,
                    needsHumanReview:
                      artifact.riskSummary &&
                      artifact.riskSummary.needsHumanReview === true,
                    errors: errors
                  };
                });
              }

              errors.push(rel(taskFile) + " => missing artifacts object");
              return {
                taskFile: taskFile,
                taskId: artifact ? artifact.taskId : "unknown",
                needsHumanReview: false,
                errors: errors
              };
            })
            .catch(function (err) {
              return {
                taskFile: taskFile,
                taskId: "unknown",
                needsHumanReview: false,
                errors: [rel(taskFile) + " => invalid JSON: " + err.message]
              };
            });
        })
      );
    });
  })
  .then(function (results) {
    var allErrors = [];

    return Promise.all(
      results.map(function (result) {
        if (result.needsHumanReview && result.taskId) {
          var flagPath = path.join(FLAGS_DIR, result.taskId + ".json");
          return exists(flagPath).then(function (hasFlag) {
            if (!hasFlag) {
              allErrors.push(
                rel(result.taskFile) +
                  " => expected human-review flag file .cursor/provenance/flags/" +
                  result.taskId +
                  ".json"
              );
            }
            if (result.errors.length > 0) {
              allErrors = allErrors.concat(result.errors);
            }
          });
        }

        if (result.errors.length > 0) {
          allErrors = allErrors.concat(result.errors);
        }
        return Promise.resolve();
      })
    ).then(function () {
      if (allErrors.length > 0) {
        console.error("[provenance] validation failed:");
        allErrors.forEach(function (msg) {
          console.error(" - " + msg);
        });
        process.exit(1);
      }
      console.log("[provenance] validation passed");
    });
  })
  .catch(function (err) {
    console.error("[provenance] validation failed:", err.message);
    process.exit(1);
  });
