# ProvenanceCode Governance Bundle v1

This directory contains the repository-local governance bundle for:

- **Bundle ID:** `provenancecode.bundle.github.copilot.v1`
- **Cursor Adapter ID:** `provenancecode.adapter.cursor.v1`

## What this bundle enforces

1. Meaningful agent-driven changes must include a `GEN-*` event artifact.
2. Risk-triggered changes must include a linked and valid `DEC-*` artifact.
3. `GEN-*`, `DEC-*`, and optional `SPEC-*` artifacts are validated against v2 schemas.
4. Pull requests are hard-gated through GitHub Actions.

## Layout

```text
.provenance/
  bin/
    prvc
  config/
    enforcement.json
    sequences.json
    schemas/
      gen-event.v2.schema.json
      decision.v2.schema.json
      spec.v2.schema.json
  sessions/
  events/
  decisions/
  specs/
```

## CLI quick usage

```bash
# record a GEN event (normally called from hooks)
./.provenance/bin/prvc gen record --trigger manual

# close a session (normally called from stop hooks)
./.provenance/bin/prvc session finalize --reason complete

# run governance validation locally
./.provenance/bin/prvc validate
```
