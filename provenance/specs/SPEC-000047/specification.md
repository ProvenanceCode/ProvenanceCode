# SPEC-000047: Cursor provenance enforcement bundle for task start/end governance

## Status
Implemented

## Version
1.0.0

## Summary

Define a reusable bundle that enforces provenance behavior for Cursor agents at task start and task end. The bundle must ensure prior provenance review, decision/risk logging, schema-validated task provenance output, and CI blocking when substantive code changes are not accompanied by valid provenance artifacts.

---

## Motivation

Task completion quality depends on context continuity and auditable records. Without hard enforcement, agents can skip provenance review, omit risk flags, and finish without machine-verifiable artifacts. This specification standardizes enforcement and output artifacts.

---

## Requirements

### R1: Task Start Review Enforcement

The start hook MUST:

1. Verify `.cursor/rules/00-provenance.mdc` exists.
2. Review recent `.cursor/provenance/tasks/*.json` artifacts.
3. Review recent `.cursor/provenance/risks/*.json` artifacts.
4. Generate:
   - `.cursor/provenance/reviews/<taskId>.md`
   - `.cursor/provenance/decisions/<taskId>.md`
   - `.cursor/provenance/risks/<taskId>.json`

### R2: Task End Artifact Generation

The end hook MUST:

1. Require start artifacts to exist.
2. Generate `.cursor/provenance/tasks/<taskId>.json`.
3. Include task metadata: timestamps, model/agent, git branch/SHA, changed files.
4. Validate against `.cursor/provenance/schema/provenance.task.v2.schema.json`.

### R3: Risk Flagging

If open high or critical risks exist, the end hook MUST create:

- `.cursor/provenance/flags/<taskId>.json`

and set `needsHumanReview` in task provenance.

### R4: CI Enforcement

CI MUST run:

- provenance validation script, and
- diff-based check that fails substantive changes lacking task artifact updates.

### R5: Reusability

Bundle MUST be self-contained and portable as a zip package.

---

## Artifact Contract

The bundle MUST provide:

- Cursor rule file for mandatory behavior.
- Start hook script.
- End hook script.
- Provenance task schema (JSON Schema draft 2020-12).
- Validation script.
- PR enforcement script.
- CI workflow.
- Setup README and package scripts.

---

## Acceptance Criteria

1. Running start hook creates review/decision/risk artifacts.
2. Running end hook creates a schema-valid task provenance object.
3. High/critical open risks produce a flag artifact.
4. Validation script passes for valid artifacts and fails with actionable errors otherwise.
5. PR check fails when substantive changes occur without updated task artifacts.
6. Bundle can be distributed as `cursor-provenance-enforcer-v2.zip`.

---

## Out of Scope

- Artifact signing and cryptographic attestation.
- Remote provenance storage backends.
- Automatic Jira synchronization.

---

## Related Artifacts

- Decision: `DEC-000001`
- Prior standard: `SPEC-000046`
- Bundle location: `provenance/bundles/cursor-provenance-enforcer-v2/`
