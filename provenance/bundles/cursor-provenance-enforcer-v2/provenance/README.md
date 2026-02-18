# ProvenanceCode Artifacts

This directory contains ProvenanceCode artifacts for this repository.

## Structure

```text
provenance/
├── bundles/            # Reusable enforcement bundles
│   └── cursor-provenance-enforcer-v2/
├── specs/              # Specifications (SPEC-*)
│   ├── SPEC-000046/    # ProvenanceCode v2.0 naming convention
│   └── SPEC-000047/    # Cursor provenance task enforcement bundle
├── decisions/          # Architectural decisions (DEC-*)
│   └── DEC-000001/     # Enforce task-start/task-end provenance artifacts
├── risks/              # Risk acceptances (RA-*)
├── mistakes/           # Mistake records (MR-*)
└── examples/           # Example artifacts and configurations
    └── v2.0/           # v2.0 format examples
        ├── codes.json      # Example project/subproject registry
        └── sequences.json  # Example sequence tracking
```

## Specifications

### SPEC-000046: ProvenanceCode v2.0 Naming Convention

The v2.0 naming convention introduces project and subproject codes for better monorepo support and Jira integration.

**Format:** `{TYPE}-{PROJECT}-{SUBPROJECT}-{SEQUENCE}`

**Example:** `DEC-PROJ-CORE-000001`

**Documentation:** See [specification.md](specs/SPEC-000046/specification.md)

### SPEC-000047: Cursor provenance enforcement bundle

Defines the enforcement contract for Cursor task-start/task-end provenance behavior, including hooks, schema validation, risk flagging, and CI gating.

**Documentation:** See [specification.md](specs/SPEC-000047/specification.md)

## Decisions

### DEC-000001: Enforce task-start/task-end provenance artifacts

Records the architectural decision to require start review artifacts, end task provenance objects, and CI enforcement.

**Documentation:** See [decision.md](decisions/DEC-000001/decision.md)

## Bundles

- [cursor-provenance-enforcer-v2](bundles/cursor-provenance-enforcer-v2/README.md)
- [cursor-provenance-enforcer-v2.zip](bundles/cursor-provenance-enforcer-v2.zip)

## v2.0 Examples

Example configuration files for v2.0 are available in `examples/v2.0/`:

- **codes.json** - Project and subproject registry
- **sequences.json** - Sequence number tracking

## Quick Start

For v2.0 adoption:

1. Review [SPEC-000046](specs/SPEC-000046/specification.md)
2. Review [SPEC-000047](specs/SPEC-000047/specification.md) and [DEC-000001](decisions/DEC-000001/decision.md)
3. Check [examples/v2.0/codes.json](examples/v2.0/codes.json) for configuration format
4. See [Migration Guide](../docs/MIGRATION_GUIDE_V2.md) for adoption strategies

## Documentation

- [ProvenanceCode v2.0 Summary](../PROVENANCECODE_V2_SUMMARY.md)
- [Migration Guide](../docs/MIGRATION_GUIDE_V2.md)
- [Quick Start](../docs/QUICK_START.md)
- [Full Specification](specs/SPEC-000046/specification.md)
- [Cursor Enforcement Spec](specs/SPEC-000047/specification.md)
- [Cursor Enforcement Decision](decisions/DEC-000001/decision.md)

---

**ProvenanceCode(tm)** is a trademark of **KDDLC AI Solutions SL**.
