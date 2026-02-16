# ProvenanceCode v2.0 Standard - Implementation Summary

## Overview

This implementation introduces **ProvenanceCode v2.0**, an enhanced naming convention that supports monorepo architectures, project/subproject hierarchies, and seamless Jira integration while maintaining full backward compatibility with v1.0.

## What's New in v2.0

### Enhanced Naming Convention

**v1.0 (Legacy - Still Supported):**
```
DEC-000001
SPEC-000045
RA-000001
MR-000001
```

**v2.0 (New):**
```
DEC-SDO-FND-000001    (Decision in System Demo / Foundation)
SPEC-PQS-API-000042   (Spec in PlantQuest / API)
RA-AUTH-SEC-000007    (Risk in Auth / Security)
MR-PQS-FE-000003      (Mistake in PlantQuest / Frontend)
```

### Format Structure

```
{ARTIFACT_TYPE}-{PROJECT_CODE}-{SUBPROJECT_CODE}-{SEQUENCE}
```

- **ARTIFACT_TYPE**: 2-4 letter code (DEC, SPEC, RA, MR)
- **PROJECT_CODE**: 2-4 uppercase letters (SDO, PQS, AUTH)
- **SUBPROJECT_CODE**: 2-4 uppercase letters/numbers (FND, API, FE)
- **SEQUENCE**: 6-digit zero-padded number (000001)

## Key Features

### 1. Monorepo Support

Map artifacts to specific workspaces in monorepo projects:

```
/
├── pqs-frontend/           ← Subproject: FND
├── pqs-api/                ← Subproject: API
└── provenance/
    └── decisions/
        ├── DEC-PQS-FND-000001/    ← Frontend decision
        └── DEC-PQS-API-000001/    ← API decision
```

### 2. Jira Integration

- Project codes map to Jira project keys
- Subproject codes map to Jira components
- Custom fields for provenance tracking
- Automated sync capabilities

```json
{
  "project": {
    "code": "SDO",
    "jiraProject": "SDO"
  },
  "subproject": {
    "code": "FND",
    "jiraComponent": "Frontend"
  }
}
```

### 3. Backward Compatibility

- v1.0 artifacts remain fully valid
- v1.0 and v2.0 can coexist
- All schemas support both formats
- No breaking changes

### 4. Hierarchical Organization

- Clear project/subproject hierarchy
- Independent sequence numbers per namespace
- Better artifact organization at scale

## Files Created/Modified

### New Specification

- **`/provenance/specs/SPEC-000046/spec.json`** - Specification metadata
- **`/provenance/specs/SPEC-000046/specification.md`** - Complete v2.0 specification (comprehensive documentation)

### New Schemas

- **`/provenance/schema/codes.schema.json`** - Project/subproject code registry schema
- **`/provenance/schema/sequences.schema.json`** - Sequence number tracking schema
- **`/provenance/schema/mistake.schema.json`** - Mistake record schema (new, with v2.0 support)

### Updated Schemas

- **`/provenance/schema/decision.schema.json`** - Updated to support v2.0 format
- **`/provenance/schema/spec.schema.json`** - Updated to support v2.0 format
- **`/provenance/schema/risk.schema.json`** - Updated to support v2.0 format

### Configuration Files

- **`/provenance/codes.json`** - Code registry (example for this repo)
- **`/provenance/sequences.json`** - Sequence tracking (example for this repo)

### Documentation

- **`/docs/MIGRATION_GUIDE_V2.md`** - Comprehensive migration guide
- **`/PROVENANCECODE_V2_SUMMARY.md`** - This summary document

### Examples

- **`/provenance/examples/v2.0/README.md`** - Examples overview
- **`/provenance/examples/v2.0/DEC-SDO-FND-000001/`** - Example decision with full v2.0 format
- **`/provenance/examples/v2.0/SPEC-PQS-API-000042/`** - Example specification

## Schema Changes

All schemas now support both v1.0 and v2.0 patterns:

### ID Pattern (Before)
```json
{
  "decision_id": {
    "pattern": "^DEC-\\d{6}$"
  }
}
```

### ID Pattern (After - Supports Both)
```json
{
  "decision_id": {
    "pattern": "^(DEC-\\d{6}|DEC-[A-Z]{2,4}-[A-Z0-9]{2,4}-\\d{6})$",
    "description": "Decision ID in v1.0 or v2.0 format"
  }
}
```

### New Fields Added

All artifact schemas now include optional v2.0 metadata:

```json
{
  "project": {
    "type": "object",
    "properties": {
      "code": { "pattern": "^[A-Z]{2,4}$" },
      "name": { "type": "string" },
      "jiraProject": { "pattern": "^[A-Z]{2,10}$" }
    }
  },
  "subproject": {
    "type": "object",
    "properties": {
      "code": { "pattern": "^[A-Z0-9]{2,4}$" },
      "name": { "type": "string" },
      "workspace": { "type": "string" },
      "jiraComponent": { "type": "string" }
    }
  }
}
```

## Use Cases

### Use Case 1: Monorepo with Multiple Workspaces

**Scenario:** E-commerce platform with frontend, backend, and mobile apps

**Structure:**
```
DEC-SHOP-FE-000001    (Frontend decision)
DEC-SHOP-BE-000001    (Backend decision)
DEC-SHOP-MOB-000001   (Mobile decision)
```

**Benefits:**
- Clear workspace identification
- Independent sequencing
- Workspace-specific artifact tracking

### Use Case 2: Enterprise Multi-Project Organization

**Scenario:** Large organization with multiple products

**Structure:**
```
DEC-AUTH-CORE-000001   (Auth platform decision)
DEC-PAY-PROC-000001    (Payment platform decision)
DEC-USER-PROF-000001   (User management decision)
```

**Benefits:**
- Project isolation
- Clear ownership
- Scalable organization

### Use Case 3: Jira Integration

**Scenario:** Team using Jira for project management

**Mapping:**
```
DEC-SDO-FND-000001
  ↓
Jira Project: SDO
Jira Component: Frontend (FND)
Custom Field: DEC-SDO-FND-000001
```

**Benefits:**
- Bidirectional linking
- Automated sync
- Unified tracking

## Migration Strategies

### Strategy 1: Gradual Migration (Recommended)

- Keep existing v1.0 artifacts unchanged
- Use v2.0 for all new artifacts
- Update artifacts only when modified

### Strategy 2: Bulk Migration

- Convert all artifacts to v2.0
- Update all references
- Clean consistent naming

### Strategy 3: Hybrid

- Keep archived v1.0 artifacts
- Migrate active artifacts
- Use v2.0 for new work

## Next Steps

### For This Repository

1. ✅ Specification created (SPEC-000046)
2. ✅ Schemas updated to support v2.0
3. ✅ Documentation created
4. ✅ Examples provided
5. ⏭️ Update validation tooling
6. ⏭️ Create migration scripts
7. ⏭️ Update CI/CD workflows

### For Adopters

1. **Review Specification:** Read SPEC-000046 specification document
2. **Define Codes:** Choose project and subproject codes
3. **Create Registry:** Set up `/provenance/codes.json`
4. **Choose Strategy:** Decide on migration approach
5. **Update Tooling:** Ensure tools support v2.0
6. **Train Team:** Document naming conventions
7. **Start Using:** Create new artifacts with v2.0 format

## Example: Quick Start

### 1. Create Code Registry

**`/provenance/codes.json`:**
```json
{
  "schema": "provenancecode.codes@1.0",
  "monorepo": true,
  "projects": {
    "MYAPP": {
      "name": "My Application",
      "jiraProject": "MYAPP",
      "subprojects": {
        "FE": {
          "name": "Frontend",
          "workspace": "frontend",
          "jiraComponent": "Frontend"
        },
        "BE": {
          "name": "Backend",
          "workspace": "backend",
          "jiraComponent": "Backend"
        }
      }
    }
  }
}
```

### 2. Create First Artifact

**Directory:** `/provenance/decisions/DEC-MYAPP-FE-000001/`

**`decision.json`:**
```json
{
  "schema": "provenancecode.decision.v2",
  "decision_id": "DEC-MYAPP-FE-000001",
  "project": {
    "code": "MYAPP",
    "name": "My Application",
    "jiraProject": "MYAPP"
  },
  "subproject": {
    "code": "FE",
    "name": "Frontend",
    "workspace": "frontend",
    "jiraComponent": "Frontend"
  },
  "title": "Your decision title",
  "status": "draft",
  "context": { "problem": "..." },
  "decision": "...",
  "consequences": "...",
  "links": { "pr": "..." },
  "risk": { "score": 2, "rationale": "..." },
  "review": { "human": "@reviewer" }
}
```

### 3. Validate

```bash
npm run provenance:validate
```

## Benefits Summary

### For Developers

- ✅ Clear workspace/component identification
- ✅ Better organization in monorepos
- ✅ Easier to find relevant artifacts
- ✅ No breaking changes (v1.0 still works)

### For Organizations

- ✅ Scalable naming convention
- ✅ Jira integration support
- ✅ Multi-project support
- ✅ Clear ownership and boundaries

### For Tooling

- ✅ Backward compatible schemas
- ✅ Enhanced metadata for automation
- ✅ Better search and filtering
- ✅ Workspace-aware validation

## Resources

### Documentation

- **[SPEC-000046 Full Specification](./provenance/specs/SPEC-000046/specification.md)** - Complete technical specification
- **[Migration Guide](./docs/MIGRATION_GUIDE_V2.md)** - Step-by-step migration instructions
- **[v2.0 Examples](./provenance/examples/v2.0/)** - Working examples

### Schemas

- **[Codes Schema](./provenance/schema/codes.schema.json)** - Project/subproject registry
- **[Sequences Schema](./provenance/schema/sequences.schema.json)** - Sequence tracking
- **[Decision Schema](./provenance/schema/decision.schema.json)** - Updated for v2.0
- **[Spec Schema](./provenance/schema/spec.schema.json)** - Updated for v2.0
- **[Risk Schema](./provenance/schema/risk.schema.json)** - Updated for v2.0
- **[Mistake Schema](./provenance/schema/mistake.schema.json)** - New with v2.0 support

## FAQ

**Q: Is this a breaking change?**  
A: No. v1.0 format is fully supported indefinitely. Both formats can coexist.

**Q: Do I have to migrate?**  
A: No. Migration is optional. v1.0 continues to work.

**Q: Can I use this without Jira?**  
A: Yes. Jira integration is optional.

**Q: How do I choose project codes?**  
A: Use meaningful acronyms, 2-4 uppercase letters, aligned with your Jira project keys if possible.

**Q: What about existing artifacts?**  
A: They remain valid. You can keep them as-is or migrate gradually.

## Support and Feedback

- **Issues:** Open an issue on GitHub
- **Questions:** See Migration Guide FAQ section
- **Examples:** Review `/provenance/examples/v2.0/`
- **Specification:** Read SPEC-000046 for complete details

---

## Summary

ProvenanceCode v2.0 enhances the naming convention to support:
- **Monorepo architectures** with workspace identification
- **Jira integration** with project and component mapping
- **Hierarchical organization** for enterprise scale
- **Full backward compatibility** with v1.0

All while maintaining the core principles of tamper-evident, traceable decision and specification management.

---

**Specification:** SPEC-000046  
**Version:** 2.0.0  
**Date:** 2026-02-16  
**Status:** Draft (Ready for Review)
