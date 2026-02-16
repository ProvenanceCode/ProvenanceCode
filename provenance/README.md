# ProvenanceCode Artifacts

This directory contains ProvenanceCode artifacts for this repository.

## Structure

```
provenance/
├── specs/              # Specifications (SPEC-*)
│   └── SPEC-000046/    # ProvenanceCode v2.0 naming convention
├── decisions/          # Architectural decisions (DEC-*)
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

## v2.0 Examples

Example configuration files for v2.0 are available in `examples/v2.0/`:

- **codes.json** - Project and subproject registry
- **sequences.json** - Sequence number tracking

## Quick Start

For v2.0 adoption:

1. Review [SPEC-000046](specs/SPEC-000046/specification.md)
2. Check [examples/v2.0/codes.json](examples/v2.0/codes.json) for configuration format
3. See [Migration Guide](../docs/MIGRATION_GUIDE_V2.md) for adoption strategies

## Documentation

- [ProvenanceCode v2.0 Summary](../PROVENANCECODE_V2_SUMMARY.md)
- [Migration Guide](../docs/MIGRATION_GUIDE_V2.md)
- [Quick Start](../docs/QUICK_START.md)
- [Full Specification](specs/SPEC-000046/specification.md)

---

**ProvenanceCode™** is a trademark of **KDDLC AI Solutions SL**.
