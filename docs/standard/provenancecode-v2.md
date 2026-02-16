# ProvenanceCode v2.0 Naming Convention

**Version:** 2.0  
**Status:** Active  
**Part of:** ProvenanceCode Open Standard  
**Specification:** [SPEC-000046](../../provenance/specs/SPEC-000046/specification.md)

---

## Overview

ProvenanceCode v2.0 introduces an enhanced naming convention that extends the original v1.0 format to support monorepo organizations, Jira integration, and hierarchical project structures.

**Key Principle:** v2.0 is **fully backward compatible** with v1.0. Both formats can coexist in the same repository.

**Note:** This document provides a summary of the v2.0 naming convention. For the complete specification, see [SPEC-000046](../../provenance/specs/SPEC-000046/specification.md).

## Naming Format

### v1.0 Format (Legacy)

```
{ARTIFACT_TYPE}-{SEQUENCE}
```

**Examples:**
```
DEC-000001
SPEC-000042
RA-000007
MR-000003
```

**Components:**
- `ARTIFACT_TYPE`: DEC, SPEC, RA, MR
- `SEQUENCE`: 6-digit zero-padded number

### v2.0 Format (New)

```
{ARTIFACT_TYPE}-{PROJECT_CODE}-{SUBPROJECT_CODE}-{SEQUENCE}
```

**Examples:**
```
DEC-PROJ-CORE-000001
SPEC-AUTH-API-000042
RA-PAY-SEC-000007
MR-SHOP-FE-000003
```

**Components:**
- `ARTIFACT_TYPE`: DEC, SPEC, RA, MR (same as v1.0)
- `PROJECT_CODE`: 2-4 uppercase letters/numbers
- `SUBPROJECT_CODE`: 2-4 uppercase letters/numbers
- `SEQUENCE`: 6-digit zero-padded number

## Format Specification

### Artifact Types

Same as v1.0:

| Code | Full Name | Purpose |
|------|-----------|---------|
| `DEC` | Decision | Architectural and technical decisions |
| `SPEC` | Specification | Requirements and feature specifications |
| `RA` | Risk Acceptance | Documented risk acceptances |
| `MR` | Mistake Record | Post-incident learning records |

### Project Code

**Format:** 2-4 uppercase characters (A-Z, 0-9)

**Purpose:** Identifies the primary project or product

**Examples:**
- `SHOP` - E-commerce shop
- `AUTH` - Authentication service
- `PAY` - Payment service
- `PROJ` - Generic project name
- `API` - API layer

**Rules:**
- Minimum 2 characters
- Maximum 4 characters
- Uppercase letters (A-Z) only
- Numbers (0-9) allowed
- No special characters
- Should be memorable and meaningful

### Subproject Code

**Format:** 2-4 uppercase characters (A-Z, 0-9)

**Purpose:** Identifies a component, workspace, or team within the project

**Examples:**
- `FE` - Frontend
- `BE` - Backend
- `API` - API layer
- `CORE` - Core functionality
- `SEC` - Security
- `INFRA` - Infrastructure
- `MOB` - Mobile

**Rules:**
- Same format rules as PROJECT_CODE
- Should map to a logical division in your codebase
- In monorepos, typically maps to a workspace
- Can represent teams, components, or modules

### Sequence Number

**Format:** 6-digit zero-padded number

**Purpose:** Unique sequential identifier within PROJECT-SUBPROJECT scope

**Examples:**
- `000001` - First artifact
- `000042` - Forty-second artifact
- `123456` - Large sequence number

**Rules:**
- Always 6 digits
- Zero-padded (e.g., `000001` not `1`)
- Increments per artifact type per subproject
- Starts at `000001`

## Validation Rules

### Valid v2.0 IDs

Pattern: `^(DEC|SPEC|RA|MR)-[A-Z0-9]{2,4}-[A-Z0-9]{2,4}-\d{6}$`

**Valid Examples:**
```
DEC-SHOP-FE-000001      ✅ Standard format
SPEC-AUTH-API-000042    ✅ Different types
RA-PAY-SEC-000007       ✅ Different artifact
MR-PROJ-BE-000123       ✅ Three-letter codes
DEC-AB-CD-000001        ✅ Minimum length (2 chars)
SPEC-ABCD-EFGH-000001   ✅ Maximum length (4 chars)
```

**Invalid Examples:**
```
DEC-project-core-000001 ❌ Lowercase
DEC-PROJ-000001         ❌ Missing subproject
DEC-PROJ_CORE-000001    ❌ Special characters
DEC-P-CORE-000001       ❌ Project too short
DEC-TOOLONG-CORE-000001 ❌ Project too long
DEC-PROJ-CORE-1         ❌ Sequence not padded
```

### Backward Compatibility

Pattern: `^(DEC|SPEC|RA|MR)-\d{6}$`

**Valid v1.0 Examples:**
```
DEC-000001              ✅ Valid v1.0 format
SPEC-000042             ✅ Still supported
RA-000007               ✅ Always valid
MR-000003               ✅ No migration required
```

## Code Registry

The code registry (`codes.json`) defines available projects and subprojects.

### Schema

```json
{
  "schema": "provenancecode.codes@1.0",
  "monorepo": boolean,
  "projects": {
    "{PROJECT_CODE}": {
      "name": string,
      "description": string (optional),
      "jiraProject": string (optional),
      "jiraUrl": string (optional),
      "subprojects": {
        "{SUBPROJECT_CODE}": {
          "name": string,
          "description": string (optional),
          "workspace": string,
          "paths": [string] (optional, for monorepo),
          "jiraComponent": string (optional)
        }
      }
    }
  }
}
```

### Example: Single Repository

```json
{
  "schema": "provenancecode.codes@1.0",
  "monorepo": false,
  "projects": {
    "MYAPP": {
      "name": "My Application",
      "description": "Main application project",
      "jiraProject": "MYAPP",
      "subprojects": {
        "CORE": {
          "name": "Core",
          "description": "Core application logic",
          "workspace": ".",
          "jiraComponent": "Core"
        }
      }
    }
  }
}
```

### Example: Monorepo

```json
{
  "schema": "provenancecode.codes@1.0",
  "monorepo": true,
  "projects": {
    "SHOP": {
      "name": "E-Commerce Shop",
      "description": "Online shopping platform",
      "jiraProject": "SHOP",
      "jiraUrl": "https://company.atlassian.net",
      "subprojects": {
        "FE": {
          "name": "Frontend",
          "description": "React-based web frontend",
          "workspace": "apps/frontend",
          "paths": ["apps/frontend/**"],
          "jiraComponent": "Frontend"
        },
        "BE": {
          "name": "Backend",
          "description": "Node.js API backend",
          "workspace": "apps/backend",
          "paths": ["apps/backend/**"],
          "jiraComponent": "Backend"
        },
        "MOBILE": {
          "name": "Mobile App",
          "description": "React Native mobile app",
          "workspace": "apps/mobile",
          "paths": ["apps/mobile/**"],
          "jiraComponent": "Mobile"
        }
      }
    }
  }
}
```

## Sequence Tracking

The sequences file (`sequences.json`) tracks the next available sequence number for each artifact type within each subproject.

### Schema

```json
{
  "schema": "provenancecode.sequences@1.0",
  "sequences": {
    "{PROJECT_CODE}-{SUBPROJECT_CODE}": {
      "DEC": number,
      "SPEC": number,
      "RA": number,
      "MR": number
    }
  }
}
```

### Example

```json
{
  "schema": "provenancecode.sequences@1.0",
  "sequences": {
    "SHOP-FE": {
      "DEC": 5,
      "SPEC": 12,
      "RA": 2,
      "MR": 1
    },
    "SHOP-BE": {
      "DEC": 8,
      "SPEC": 15,
      "RA": 3,
      "MR": 2
    }
  }
}
```

**Next IDs would be:**
- `DEC-SHOP-FE-000005`
- `SPEC-SHOP-FE-000012`
- `DEC-SHOP-BE-000008`

## Directory Structure

### v1.0 Structure

```
/provenance/
  /decisions/
    /DEC-000001/
      decision.json
      decision.md
  /specs/
    /SPEC-000001/
  /risks/
    /RA-000001/
  /mistakes/
    /MR-000001/
```

### v2.0 Structure

```
/provenance/
  codes.json              ← Project registry
  sequences.json          ← Sequence tracking
  /decisions/
    /DEC-PROJ-CORE-000001/
      decision.json
      decision.md
    /DEC-PROJ-API-000001/
  /specs/
    /SPEC-PROJ-CORE-000001/
  /risks/
    /RA-PROJ-SEC-000001/
  /mistakes/
    /MR-PROJ-FE-000001/
```

### Mixed v1.0 and v2.0

Both formats can coexist:

```
/provenance/
  codes.json
  sequences.json
  /decisions/
    /DEC-000001/              ← v1.0 format
    /DEC-000002/              ← v1.0 format
    /DEC-PROJ-CORE-000001/    ← v2.0 format
    /DEC-PROJ-API-000001/     ← v2.0 format
```

## Artifact Schema Updates

### Decision Schema (v2.0)

```json
{
  "schema": "provenancecode.decision.v2",
  "decision_id": "DEC-PROJ-CORE-000001",
  
  "project": {
    "code": "PROJ",
    "name": "Project Name",
    "jiraProject": "PROJ"
  },
  
  "subproject": {
    "code": "CORE",
    "name": "Core",
    "workspace": ".",
    "jiraComponent": "Core"
  },
  
  "title": "Decision title",
  "status": "draft",
  "context": {
    "problem": "What problem are we solving?",
    "constraints": ["Technical constraints"]
  },
  "decision": "What we decided",
  "consequences": "Impact of the decision",
  
  "links": {
    "pr": "https://github.com/org/repo/pull/123",
    "jira": "https://company.atlassian.net/browse/PROJ-123"
  },
  
  "timestamps": {
    "created_at": "2026-02-16T00:00:00Z",
    "updated_at": "2026-02-16T00:00:00Z"
  }
}
```

### Key Additions

**v2.0 adds these optional fields:**

- `project` (object) - Project information
  - `code` (string) - Project code
  - `name` (string) - Project name
  - `jiraProject` (string, optional) - Jira project key

- `subproject` (object) - Subproject information
  - `code` (string) - Subproject code
  - `name` (string) - Subproject name
  - `workspace` (string) - Workspace path
  - `jiraComponent` (string, optional) - Jira component name

**v1.0 format remains valid:**

```json
{
  "schema": "provenancecode.decision.v2",
  "decision_id": "DEC-000001",
  "title": "Decision title",
  "status": "draft"
}
```

## Monorepo Support

v2.0 provides native monorepo support through workspace mapping.

### Configuration

```json
{
  "schema": "provenancecode.codes@1.0",
  "monorepo": true,
  "projects": {
    "SHOP": {
      "subprojects": {
        "FE": {
          "workspace": "apps/frontend",
          "paths": ["apps/frontend/**"]
        }
      }
    }
  }
}
```

### Workspace Mapping

Artifacts map to specific workspaces:

```
DEC-SHOP-FE-000001  → apps/frontend/
DEC-SHOP-BE-000001  → apps/backend/
DEC-SHOP-MOB-000001 → apps/mobile/
```

### Path-Based Validation

When `paths` are specified, validators can:

- Detect which subproject changed files belong to
- Require decisions from the correct subproject
- Auto-suggest subproject based on PR file changes

**Example:**
```
PR changes: apps/frontend/src/Login.tsx
Validator suggests: DEC-SHOP-FE-XXXXXX
```

## Jira Integration

v2.0 enables automatic Jira integration.

### Configuration

```json
{
  "projects": {
    "SHOP": {
      "jiraProject": "SHOP",
      "jiraUrl": "https://company.atlassian.net",
      "subprojects": {
        "FE": {
          "jiraComponent": "Frontend"
        }
      }
    }
  }
}
```

### Automatic Linking

When a decision is created:

```
DEC-SHOP-FE-000001
```

The validator can automatically:

1. **Create Jira ticket** in project `SHOP`
2. **Assign component** `Frontend`
3. **Link PR** to Jira ticket
4. **Update decision** with Jira link

### Jira Ticket Structure

**Example Jira ticket created from decision:**

```
Project: SHOP
Type: Technical Decision
Component: Frontend
Summary: [DEC-SHOP-FE-000001] Decision Title
Description: Decision context and details
Labels: provenancecode, decision
```

## Use Cases

### Use Case 1: Monorepo Organization

**Scenario:** Monorepo with 3 apps

**Setup:**
```json
{
  "projects": {
    "PLATFORM": {
      "subprojects": {
        "WEB": { "workspace": "apps/web" },
        "API": { "workspace": "apps/api" },
        "ADMIN": { "workspace": "apps/admin" }
      }
    }
  }
}
```

**Artifacts:**
```
DEC-PLATFORM-WEB-000001   → Web app decision
DEC-PLATFORM-API-000001   → API decision
DEC-PLATFORM-ADMIN-000001 → Admin panel decision
```

### Use Case 2: Microservices

**Scenario:** Microservices architecture

**Setup:**
```json
{
  "projects": {
    "SVC": {
      "subprojects": {
        "AUTH": { "workspace": "services/auth" },
        "PAY": { "workspace": "services/payment" },
        "USER": { "workspace": "services/user" }
      }
    }
  }
}
```

**Artifacts:**
```
DEC-SVC-AUTH-000001  → Auth service decision
DEC-SVC-PAY-000001   → Payment service decision
DEC-SVC-USER-000001  → User service decision
```

### Use Case 3: Team-Based Organization

**Scenario:** Multiple teams in one repo

**Setup:**
```json
{
  "projects": {
    "PROD": {
      "subprojects": {
        "FE": { "name": "Frontend Team" },
        "BE": { "name": "Backend Team" },
        "INFRA": { "name": "Infrastructure Team" }
      }
    }
  }
}
```

**Artifacts:**
```
DEC-PROD-FE-000001     → Frontend team decision
DEC-PROD-BE-000001     → Backend team decision
DEC-PROD-INFRA-000001  → Infrastructure team decision
```

## Migration Path

See [Migration Guide](../MIGRATION_GUIDE_V2.md) for detailed migration instructions.

**Summary:**
1. ✅ v1.0 continues to work indefinitely
2. ✅ Both formats can coexist
3. ✅ No breaking changes
4. ✅ Gradual migration supported
5. ✅ No forced migration

## Implementation Guidelines

### For Validator Implementations

Validators MUST:

1. ✅ Support both v1.0 and v2.0 formats
2. ✅ Validate v2.0 format against regex pattern
3. ✅ Validate project/subproject codes exist in `codes.json`
4. ✅ Track sequences in `sequences.json`
5. ✅ Handle missing `codes.json` (v1.0 fallback)

Validators MAY:

- Auto-suggest subproject based on file paths
- Create Jira tickets automatically
- Link PRs to Jira
- Generate next sequence number

### For Tool Implementations

Tools SHOULD:

1. ✅ Read `codes.json` for available projects
2. ✅ Update `sequences.json` when creating artifacts
3. ✅ Validate format before creating artifacts
4. ✅ Provide v1.0 fallback if `codes.json` missing

### Configuration Detection

```javascript
// Detect v2.0 support
const codesPath = '/provenance/codes.json';
const hasV2Support = fs.existsSync(codesPath);

if (hasV2Support) {
  // Use v2.0 format
  const codes = JSON.parse(fs.readFileSync(codesPath));
  // ...
} else {
  // Use v1.0 format
  // ...
}
```

## FAQ

**Q: Is v2.0 required?**  
A: No, v1.0 is still fully supported. v2.0 is optional.

**Q: Can I mix v1.0 and v2.0?**  
A: Yes, both formats work together in the same repository.

**Q: What if I don't have `codes.json`?**  
A: Validators fall back to v1.0 format validation.

**Q: How do sequences work across formats?**  
A: v1.0 and v2.0 use independent sequences. No conflicts.

**Q: Can I change project codes later?**  
A: Not recommended. Choose codes carefully as they become part of artifact IDs.

**Q: Do all subprojects need Jira?**  
A: No, Jira integration is optional.

## Related Documentation

- [Migration Guide](../MIGRATION_GUIDE_V2.md) - How to migrate to v2.0
- [Repository Layout](./repo-layout.md) - Directory structure
- [Versioning](./versioning.md) - Artifact versioning
- [Decision Evidence Objects](./deo.md) - Decision format

## Changelog

### Version 2.0 (2026-02-16)
- ✨ Added hierarchical naming convention
- ✨ Added monorepo support
- ✨ Added Jira integration
- ✨ Added `codes.json` registry
- ✨ Added `sequences.json` tracking
- ✅ Maintained full v1.0 backward compatibility

### Version 1.0 (2024-01-01)
- Initial release
- Basic naming convention: `{TYPE}-{SEQUENCE}`

---

**ProvenanceCode™** is a trademark of **KDDLC AI Solutions SL**.

The ProvenanceCode standard specification is licensed under [Apache License 2.0](../../LICENSE).
