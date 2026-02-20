# Cursor Provenance Enforcer Bundle (ProvenanceCode v2)

This bundle enforces provenance review and artifact generation at task start and task end.

## What this bundle enables

- Mandatory task-start review of provenance rules and recent task history.
- Automatic creation of start artifacts:
  - `.cursor/provenance/reviews/<taskId>.md`
  - `.cursor/provenance/decisions/<taskId>.md`
  - `.cursor/provenance/risks/<taskId>.json`
- Mandatory task-end generation of `.cursor/provenance/tasks/<taskId>.json`.
- JSON Schema validation for task provenance objects with ProvenanceCode v2 fields.
- Human review flag files for open high or critical risks.
- CI checks that fail when code changes are made without provenance artifacts.

## Bundle layout

```text
cursor-provenance-enforcer-v2/
├── .cursor/rules/00-provenance.mdc
├── .cursor/provenance/schema/provenance.task.v2.schema.json
├── .cursor/provenance/{reviews,decisions,risks,tasks,flags}/.gitkeep
├── scripts/provenance/on-task-start.js
├── scripts/provenance/on-task-end.js
├── scripts/provenance/validate-provenance.js
├── scripts/provenance/check-pr-provenance.js
├── .github/workflows/provenance.yml
├── cursor-plugin.example.json
└── package.json
```

## Quick start

1. Unzip this bundle into your repository root.
2. Install dependencies:
   - `npm install`
3. Wire Cursor plugin hooks using `cursor-plugin.example.json` as a template.
4. Commit the added files.

## Commands

- Validate all task provenance files:
  - `npm run provenance:validate`
- Check if current diff includes required provenance artifacts:
  - `npm run provenance:check`
- Simulate hooks locally:
  - `CURSOR_TASK_ID=task-demo npm run provenance:hook:start`
  - `CURSOR_TASK_ID=task-demo npm run provenance:hook:end`

## Hook behavior

### Task start

- Reads current rules and recent task artifacts.
- Reads unresolved risks.
- Creates review, decisions, and risk artifacts for the current task.

### Task end

- Reads start artifacts and risk log.
- Creates a task provenance object.
- Validates against the schema.
- Writes a human-review flag if open high or critical risks exist.

## Hard enforcement

Set `PROVENANCE_ENFORCE_HARD_FAIL=1` to fail task-end hook when open high or critical risks remain.
