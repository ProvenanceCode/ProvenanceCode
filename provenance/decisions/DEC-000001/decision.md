# DEC-000001: Adopt enforced task-start and task-end provenance artifacts for Cursor agents

**Status:** accepted  
**Date:** 2026-02-18  
**Author:** cursor-agent  
**Approver:** repo-owner

## Context

The repository now includes a Cursor provenance bundle under `provenance/bundles/cursor-provenance-enforcer-v2/` that can generate start-review logs, decision logs, risk logs, task provenance objects, and human-review flags. We need a formal decision artifact that explains why this enforcement model was selected and how it should be governed.

## Problem

Prompt-only guidance is not sufficient to guarantee provenance consistency. Without enforcement:

- task completion can happen without a provenance object,
- prior mistakes or unresolved risks can be ignored,
- CI may pass without auditable provenance evidence.

## Options Considered

1. Keep prompt-only guidance (no automation).
2. Require manual review files but no hooks.
3. Enforce a bundled approach: rules + hooks + schema + CI gate.

## Decision

Choose **Option 3** and treat provenance as a required execution artifact:

- Task start must review past provenance and create review/decision/risk artifacts.
- Task end must create and validate a task provenance object.
- Open high or critical risks must trigger human-review flags.
- CI must reject substantive code changes that lack valid task provenance artifacts.

## Consequences

### Positive

- Repeatable provenance behavior for agents.
- Better continuity from past decisions and risk history.
- Machine-verifiable evidence for audits and incident triage.

### Negative

- Slightly higher operational overhead.
- Potential task blocking when enforcement is misconfigured.

## Risk and Mitigation

- **Risk:** False negatives in enforcement block delivery.  
  **Mitigation:** Keep local simulation scripts and clear validator output.
- **Risk:** Teams bypass artifacts during migration.  
  **Mitigation:** Enforce via CI and repository policy.

## Related Artifacts

- Spec: `SPEC-000047`
- Bundle: `provenance/bundles/cursor-provenance-enforcer-v2/`
