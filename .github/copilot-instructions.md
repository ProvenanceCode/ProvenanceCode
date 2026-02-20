# ProvenanceCode Governance Bundle v1

This repository enforces machine-verifiable provenance for agent-assisted changes.

- **Bundle ID:** `provenancecode.bundle.github.copilot.v1`
- **Cursor Adapter ID:** `provenancecode.adapter.cursor.v1`
- **Primary gate:** GitHub PR check (`ProvenanceCode Governance Gate`)
- **Secondary gate:** local agent hooks (`.github/hooks/*.json`, `.cursor/hooks/hooks.json`)

## Required behavior for coding agents

1. **Record GEN artifacts**  
   Any meaningful change to code/config/workflows must produce at least one `GEN-*` artifact in:
   - `.provenance/events/`

2. **Link DEC artifacts for risk-triggered changes**  
   If changed files match risk-triggered paths (for example `.github/workflows/**`, `auth/**`, `security/**`, `infra/**`, `.provenance/config/**`), include or link a valid `DEC-*` artifact in:
   - `.provenance/decisions/<DEC-ID>/decision.json`

3. **Schema validity**  
   Artifacts must validate against local v2 schemas:
   - `.provenance/config/schemas/gen-event.v2.schema.json`
   - `.provenance/config/schemas/decision.v2.schema.json`
   - `.provenance/config/schemas/spec.v2.schema.json` (optional)

4. **Minimal data capture**  
   Keep provenance data hash-based by default. Do not store raw prompt text or sensitive data in artifacts.

## Local commands

```bash
# Generate an event (hooks do this automatically)
./.provenance/bin/prvc gen record --trigger manual

# Finalize session (hooks do this automatically)
./.provenance/bin/prvc session finalize --reason complete

# Run governance validation
./.provenance/bin/prvc validate
```
