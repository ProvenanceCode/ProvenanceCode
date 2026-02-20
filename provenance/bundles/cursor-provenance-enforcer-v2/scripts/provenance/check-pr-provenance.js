"use strict";

var childProcess = require("child_process");
var path = require("path");

function git(command) {
  try {
    return childProcess.execSync(command, { encoding: "utf8" }).trim();
  } catch (_err) {
    return "";
  }
}

function diffRange() {
  var explicit = String(process.env.PROVENANCE_DIFF_BASE || "").trim();
  if (explicit) {
    return explicit + "...HEAD";
  }

  var baseRef = String(process.env.GITHUB_BASE_REF || "").trim();
  if (baseRef) {
    return "origin/" + baseRef + "...HEAD";
  }

  return "HEAD~1...HEAD";
}

function changedFiles(range) {
  var output = git("git diff --name-only " + range);
  return output.split("\n").filter(Boolean);
}

function resolveScopePrefix() {
  var gitRoot = git("git rev-parse --show-toplevel");
  if (!gitRoot) {
    return "";
  }
  var relative = path.relative(gitRoot, process.cwd()).replace(/\\/g, "/");
  if (!relative || relative === ".") {
    return "";
  }
  return relative.replace(/\/+$/, "") + "/";
}

function isIgnoredChange(file) {
  var ignoredPatterns = [
    /^\.cursor\/provenance\//,
    /^\.cursor\/rules\//,
    /^docs\//,
    /^README\.md$/,
    /^LICENSE$/,
    /^\.github\/workflows\/provenance\.yml$/,
    /^scripts\/provenance\//,
    /^cursor-plugin\.example\.json$/,
    /^package\.json$/,
    /^package-lock\.json$/
  ];

  return ignoredPatterns.some(function (pattern) {
    return pattern.test(file);
  });
}

var range = diffRange();
var files = changedFiles(range);
var scopePrefix = resolveScopePrefix();
var scopedFiles = files
  .filter(function (file) {
    return scopePrefix === "" || file.indexOf(scopePrefix) === 0;
  })
  .map(function (file) {
    return scopePrefix ? file.slice(scopePrefix.length) : file;
  });

if (scopedFiles.length === 0) {
  console.log("[provenance] no changed files in diff range:", range);
  process.exit(0);
}

var substantiveChanges = scopedFiles.filter(function (file) {
  return !isIgnoredChange(file);
});

if (substantiveChanges.length === 0) {
  console.log("[provenance] only non-substantive changes detected");
  process.exit(0);
}

var changedTaskArtifacts = scopedFiles.filter(function (file) {
  return /^\.cursor\/provenance\/tasks\/[^/]+\.json$/i.test(file);
});

if (changedTaskArtifacts.length === 0) {
  console.error("[provenance] failed: substantive changes detected without");
  console.error(
    "a changed task provenance artifact in .cursor/provenance/tasks/*.json"
  );
  console.error("substantive files:");
  substantiveChanges.forEach(function (file) {
    console.error(" - " + file);
  });
  process.exit(1);
}

console.log(
  "[provenance] check passed with task artifacts:",
  changedTaskArtifacts.join(", ")
);
