# provenancecode.bundle.github.copilot.v1

Reusable bundle descriptor for the Copilot + Cursor governance setup installed in this repository.

## Bundle IDs

- Bundle ID: `provenancecode.bundle.github.copilot.v1`
- Cursor Adapter ID: `provenancecode.adapter.cursor.v1`

## Manifest

See [`bundle.json`](./bundle.json) for:

- enforcement surfaces,
- invariants,
- installed path map,
- required repository layout.

## Runtime components in this repository

- `./.provenance/bin/prvc`
- `./.github/hooks/*.json`
- `./.cursor/hooks/hooks.json`
- `./.github/workflows/provenance-governance-gate.yml`
