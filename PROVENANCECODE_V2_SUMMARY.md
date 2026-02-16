# ProvenanceCode v2.0 Support

This starter pack now includes support for ProvenanceCode v2.0 naming convention.

## What's New in v2.0

### Enhanced Naming Convention

**v1.0 (Legacy - Still Supported):**
```
DEC-000001
SPEC-000001
RA-000001
MR-000001
```

**v2.0 (New - Optional):**
```
DEC-PROJ-CORE-000001
SPEC-PROJ-API-000042
RA-PROJ-SEC-000007
MR-PROJ-FE-000003
```

### Format Structure

```
{ARTIFACT_TYPE}-{PROJECT_CODE}-{SUBPROJECT_CODE}-{SEQUENCE}
```

- **ARTIFACT_TYPE**: DEC, SPEC, RA, MR
- **PROJECT_CODE**: 2-4 uppercase letters (e.g., PROJ, AUTH, PAY)
- **SUBPROJECT_CODE**: 2-4 uppercase letters/numbers (e.g., CORE, API, FE)
- **SEQUENCE**: 6-digit zero-padded number (e.g., 000001)

## Key Features

### 🎯 Monorepo Support
Map artifacts to specific workspaces:
```
DEC-PROJ-FE-000001  → frontend/ workspace
DEC-PROJ-BE-000001  → backend/ workspace
```

### 🔗 Jira Integration
Direct mapping to Jira projects and components:
```
DEC-PROJ-FE-000001
  ↓
Jira Project: PROJ
Jira Component: Frontend (FE)
```

### ✅ Backward Compatibility
- v1.0 format still fully supported
- Both formats can coexist
- No breaking changes

## Quick Start

### 1. Configure Your Project

Edit `/provenance/codes.json`:

```json
{
  "schema": "provenancecode.codes@1.0",
  "monorepo": false,
  "projects": {
    "MYAPP": {
      "name": "My Application",
      "jiraProject": "MYAPP",
      "subprojects": {
        "CORE": {
          "name": "Core",
          "workspace": ".",
          "jiraComponent": "Core"
        }
      }
    }
  }
}
```

### 2. Create Artifacts

**Using v2.0 format:**

Directory: `/provenance/decisions/DEC-MYAPP-CORE-000001/`

```json
{
  "schema": "provenancecode.decision.v2",
  "decision_id": "DEC-MYAPP-CORE-000001",
  "project": {
    "code": "MYAPP",
    "name": "My Application",
    "jiraProject": "MYAPP"
  },
  "subproject": {
    "code": "CORE",
    "name": "Core",
    "workspace": ".",
    "jiraComponent": "Core"
  },
  "title": "Your decision title",
  "status": "draft",
  "context": {
    "problem": "Description"
  },
  "decision": "What was decided",
  "consequences": "Impact",
  "links": {
    "pr": "https://github.com/org/repo/pull/123"
  },
  "risk": {
    "score": 2,
    "rationale": "Low risk"
  },
  "review": {
    "human": "@reviewer"
  }
}
```

**Or continue using v1.0 format:**

Directory: `/provenance/decisions/DEC-000001/`

```json
{
  "schema": "provenancecode.decision.v2",
  "decision_id": "DEC-000001",
  "title": "Your decision",
  "status": "draft",
  ...
}
```

## Monorepo Example

For a monorepo with frontend and backend:

**codes.json:**
```json
{
  "schema": "provenancecode.codes@1.0",
  "monorepo": true,
  "projects": {
    "SHOP": {
      "name": "E-Commerce Shop",
      "subprojects": {
        "FE": {
          "name": "Frontend",
          "workspace": "frontend",
          "paths": ["frontend/**"]
        },
        "BE": {
          "name": "Backend",
          "workspace": "backend",
          "paths": ["backend/**"]
        }
      }
    }
  }
}
```

**Artifacts:**
```
/provenance/
  /decisions/
    /DEC-SHOP-FE-000001/    ← Frontend decision
    /DEC-SHOP-BE-000001/    ← Backend decision
```

## Schema Files

All schemas have been updated to support both v1.0 and v2.0:

- ✅ `decision.schema.json` - Decision records
- ✅ `spec.schema.json` - Specifications
- ✅ `risk.schema.json` - Risk acceptances
- ✅ `mistake.schema.json` - Mistake records
- ✅ `codes.schema.json` - Code registry (new)
- ✅ `sequences.schema.json` - Sequence tracking (new)

## Documentation

For complete documentation, see:
- Migration Guide: [docs/MIGRATION_GUIDE_V2.md](docs/MIGRATION_GUIDE_V2.md)
- Full Specification: [docs/standard/provenancecode-v2.md](docs/standard/provenancecode-v2.md)

## FAQ

**Q: Do I have to use v2.0?**  
A: No, v1.0 format is still fully supported. v2.0 is optional.

**Q: Can I mix v1.0 and v2.0?**  
A: Yes, both formats can coexist in the same repository.

**Q: When should I use v2.0?**  
A: Use v2.0 if you have a monorepo, need Jira integration, or want hierarchical organization.

**Q: How do I migrate?**  
A: See the Migration Guide. You can migrate gradually or keep using v1.0.

## Support

For questions or issues:
- Open an issue on the [ProvenanceCode repository](https://github.com/ProvenanceCode/ProvenanceCode)
- Review the full specification document
- Check the examples in `/provenance/examples/v2.0/`

---

**ProvenanceCode™** is a trademark of **KDDLC AI Solutions SL**.

The ProvenanceCode standard specification is licensed under [Apache License 2.0](LICENSE).
