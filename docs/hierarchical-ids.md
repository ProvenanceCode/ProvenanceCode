# Hierarchical ID Format Guide

**Version:** 1.0.0  
**Status:** Active  
**Part of:** ProvenanceCode Open Standard

## Overview

ProvenanceCode supports hierarchical ID formats to enable better organization in monorepos, improved cross-system referencing (dashboards, JIRA), and flexible project structure management.

## Format Options

### Hierarchical Format (Recommended for Monorepos)

**Full Format (with subproject):**
```
{TYPE}-{PROJECT}-{SUBPROJECT}-{NUMBER}
```

**Simplified Format (without subproject):**
```
{TYPE}-{PROJECT}-{NUMBER}
```

**Examples:**
- `DEC-SDM-FRD-0000019` - System Demo, Frontend, Decision 19
- `DEC-CORE-API-0000042` - Core, API, Decision 42
- `DEC-WEB-0000015` - Web project (no subproject), Decision 15
- `RA-PLT-AUTH-0000007` - Platform, Auth, Risk Acceptance 7
- `SPEC-API-0000128` - API project (no subproject), Specification 128

### Legacy Format (Simple Projects)

**Format:**
```
{TYPE}-{NUMBER}
```

**Examples:**
- `DEC-000042` - Decision 42
- `RA-000015` - Risk Acceptance 15
- `MR-000003` - Mistake Record 3
- `SPEC-000028` - Specification 28

## Configuration

The ID format is configured in `provenance/config.json`:

### Example: Hierarchical with Required Subproject

```json
{
  "version": "1.0",
  "id_format": {
    "style": "hierarchical",
    "project": "SDM",
    "subproject": "FRD",
    "require_subproject": true
  }
}
```

**Result:** All IDs must use format `DEC-SDM-FRD-0000001`

### Example: Hierarchical with Optional Subproject

```json
{
  "version": "1.0",
  "id_format": {
    "style": "hierarchical",
    "project": "CORE",
    "require_subproject": false
  }
}
```

**Result:** IDs can use either:
- `DEC-CORE-API-0000001` (with subproject)
- `DEC-CORE-0000001` (without subproject)

### Example: Legacy Format

```json
{
  "version": "1.0",
  "id_format": {
    "style": "legacy"
  }
}
```

**Result:** All IDs must use format `DEC-000001`

## Configuration Options

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `style` | string | Yes | `"hierarchical"` or `"legacy"` |
| `project` | string | If hierarchical | 2-6 uppercase alphanumeric characters |
| `subproject` | string | No | Default subproject identifier (2-6 uppercase alphanumeric chars) |
| `require_subproject` | boolean | No | If `true`, all IDs must include subproject (default: `false`) |

## Use Cases

### Monorepo with Multiple Projects

```json
{
  "version": "1.0",
  "id_format": {
    "style": "hierarchical",
    "project": "MAIN",
    "require_subproject": true
  }
}
```

**Structure:**
```
provenance/decisions/
├── DEC-MAIN-WEB-0000001/
├── DEC-MAIN-API-0000001/
├── DEC-MAIN-MOBILE-0000001/
└── DEC-MAIN-INFRA-0000001/
```

**Benefits:**
- Clear separation by subproject
- Easy filtering: "Show me all API decisions"
- Scoped numbering per subproject

### Single Project with Modules

```json
{
  "version": "1.0",
  "id_format": {
    "style": "hierarchical",
    "project": "WEBAPP",
    "require_subproject": false
  }
}
```

**Structure:**
```
provenance/decisions/
├── DEC-WEBAPP-AUTH-0000001/
├── DEC-WEBAPP-UI-0000001/
├── DEC-WEBAPP-0000001/        # General decisions
└── DEC-WEBAPP-0000002/
```

**Benefits:**
- Flexible organization
- Can group by module when needed
- General decisions don't need subproject

### Simple Project (Legacy)

```json
{
  "version": "1.0",
  "id_format": {
    "style": "legacy"
  }
}
```

**Structure:**
```
provenance/decisions/
├── DEC-000001/
├── DEC-000002/
└── DEC-000003/
```

**Benefits:**
- Simple numbering
- No complexity overhead
- Perfect for small projects

## Migration Guide

### From Legacy to Hierarchical

**Step 1:** Update `provenance/config.json`

```json
{
  "version": "1.0",
  "id_format": {
    "style": "hierarchical",
    "project": "CORE",
    "require_subproject": false
  }
}
```

**Step 2:** Choose migration strategy

**Option A: Gradual Migration**
- Keep existing legacy IDs
- Create new decisions with hierarchical format
- Both formats coexist (validators support mixed formats)

**Option B: Full Migration**
- Rename all decision directories
- Update all `id` fields in `decision.json`
- Update all cross-references
- Use script or manual process

**Step 3:** Update CI/CD validation
- Ensure validators read config
- Update documentation
- Communicate to team

## JIRA Integration

Hierarchical IDs map naturally to JIRA:

**ProvenanceCode:** `DEC-SDM-FRD-0000019`  
**JIRA:** `SDM-FRD-19` or custom field mapping

**Example mapping in `provenance/links/jira-mapping.json`:**

```json
{
  "version": "1.0",
  "mappings": [
    {
      "decision_id": "DEC-SDM-FRD-0000019",
      "jira_key": "SDM-19",
      "jira_url": "https://company.atlassian.net/browse/SDM-19"
    }
  ]
}
```

## Dashboard Integration

Hierarchical IDs enable powerful filtering and reporting:

**Query Examples:**
- All decisions in project SDM: `DEC-SDM-*`
- All frontend decisions: `DEC-*-FRD-*`
- All API decisions across projects: `DEC-*-API-*`
- Specific project + subproject: `DEC-CORE-AUTH-*`

## Validation Rules

### Hierarchical Format Validation

**With subproject:**
```regex
^(DEC|RA|MR|SPEC)-[A-Z0-9]{2,6}-[A-Z0-9]{2,6}-\d{7}$
```

**Without subproject:**
```regex
^(DEC|RA|MR|SPEC)-[A-Z0-9]{2,6}-\d{7}$
```

### Legacy Format Validation

```regex
^(DEC|RA|MR|SPEC)-\d{6}$
```

## Best Practices

### Naming Conventions

**PROJECT identifiers:**
- Use 2-6 uppercase characters
- Meaningful abbreviations (CORE, WEB, API, MOBILE)
- Consistent across organization
- Avoid special characters

**SUBPROJECT identifiers:**
- Use 2-6 uppercase characters
- Module or feature area (AUTH, UI, DB, INFRA)
- Scoped to project
- Optional but recommended for large codebases

**Examples of good identifiers:**
- ✅ CORE, API, WEB, MOBILE, PLT (platform)
- ✅ AUTH, UI, DB, INFRA, DEPLOY
- ❌ VeryLongProjectName (too long)
- ❌ api (lowercase not allowed)
- ❌ P1 (too short, not descriptive)

### Sequential Numbering

**Hierarchical with subproject:**
- Number sequentially per PROJECT-SUBPROJECT
- `DEC-WEB-UI-0000001`, `DEC-WEB-UI-0000002`, etc.
- `DEC-WEB-API-0000001` starts independently

**Hierarchical without subproject:**
- Number sequentially per PROJECT
- `DEC-CORE-0000001`, `DEC-CORE-0000002`, etc.

**Legacy:**
- Number sequentially globally
- `DEC-000001`, `DEC-000002`, etc.

## FAQ

**Q: Can I mix legacy and hierarchical formats?**  
A: Yes, during migration. Validators support both formats simultaneously.

**Q: What if I don't have subprojects?**  
A: Set `require_subproject: false` and use `DEC-{PROJECT}-{NUMBER}` format.

**Q: Can I change PROJECT identifier later?**  
A: Yes, but requires renaming directories and updating references. Plan carefully.

**Q: Do I need to zero-pad to 7 digits?**  
A: Yes for hierarchical format (0000001-9999999), 6 digits for legacy (000001-999999).

**Q: What about other artifact types (RA, MR, SPEC)?**  
A: Same format rules apply to all artifact types.

## Example Repository Structures

### Monorepo Example

```
my-monorepo/
├── provenance/
│   ├── config.json                     # style: hierarchical, project: MAIN
│   ├── decisions/
│   │   ├── DEC-MAIN-WEB-0000001/
│   │   ├── DEC-MAIN-API-0000001/
│   │   ├── DEC-MAIN-MOBILE-0000001/
│   │   └── DEC-MAIN-INFRA-0000001/
│   ├── risks/
│   │   ├── RA-MAIN-WEB-0000001/
│   │   └── RA-MAIN-API-0000001/
│   └── specs/
│       ├── SPEC-MAIN-WEB-0000001/
│       └── SPEC-MAIN-API-0000001/
├── packages/
│   ├── web/
│   ├── api/
│   └── mobile/
└── infrastructure/
```

### Single Project Example

```
my-project/
├── provenance/
│   ├── config.json                     # style: hierarchical, project: APP
│   ├── decisions/
│   │   ├── DEC-APP-0000001/            # General decision
│   │   ├── DEC-APP-AUTH-0000001/       # Auth-specific
│   │   └── DEC-APP-UI-0000001/         # UI-specific
│   └── specs/
│       ├── SPEC-APP-0000001/
│       └── SPEC-APP-AUTH-0000001/
├── src/
│   ├── auth/
│   └── ui/
└── tests/
```

### Simple Project Example

```
my-simple-project/
├── provenance/
│   ├── config.json                     # style: legacy
│   ├── decisions/
│   │   ├── DEC-000001/
│   │   ├── DEC-000002/
│   │   └── DEC-000003/
│   └── specs/
│       └── SPEC-000001/
└── src/
```

## Support and Resources

- [Repository Layout Specification](standard/repo-layout.md)
- [Decision Evidence Object Spec](standard/deo.md)
- [Building Implementations](building-implementations.md)
- [ProvenanceCode Standard](standard/index.md)

---

<small>ProvenanceCode™ is a trademark of KDDLC AI Solutions SL.</small>

