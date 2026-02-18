# Repository Layout Specification

**Version:** 1.0.0  
**Status:** Draft  
**Part of:** ProvenanceCode Open Standard

## Abstract

This document defines the required directory structure, file naming conventions, and organization patterns for ProvenanceCode-compliant repositories.

## Table of Contents

1. [Overview](#overview)
2. [Root Directory Structure](#root-directory-structure)
3. [Provenance Directory](#provenance-directory)
4. [Decision Structure](#decision-structure)
5. [Risk Structure](#risk-structure)
6. [Mistake Structure](#mistake-structure)
7. [Specification Structure](#specification-structure)
8. [Policy Files](#policy-files)
9. [Supporting Directories](#supporting-directories)
10. [File Naming Conventions](#file-naming-conventions)
11. [Conformance Requirements](#conformance-requirements)

## Overview

ProvenanceCode uses a standardized directory structure to ensure:
- **Predictability** - Tools know where to find artifacts
- **Separation** - Different artifact types in dedicated directories
- **Scalability** - Structure works from 1 to 10,000+ decisions
- **Git-friendly** - Merge conflicts minimized through directory separation

## Root Directory Structure

### Minimal Conformance (Level 1)

```
repository-root/
├── provenance/
│   ├── config.json          (REQUIRED)
│   └── decisions/           (REQUIRED)
│       └── DEC-SDM-FRD-0000001/
│           └── decision.json
└── (your project files)
```

### Standard Conformance (Level 2)

```
repository-root/
├── .provenancecode/
│   └── ai-rules.md          (RECOMMENDED)
├── provenance/
│   ├── config.json          (REQUIRED)
│   ├── decisions/           (REQUIRED)
│   ├── risks/               (REQUIRED - directory exists)
│   ├── mistakes/            (REQUIRED - directory exists)
│   ├── specs/               (REQUIRED - directory exists)
│   ├── policies/            (REQUIRED)
│   │   ├── enforcement.yml
│   │   └── constitution.md
│   ├── drafts/              (RECOMMENDED)
│   └── links/               (OPTIONAL)
└── (your project files)
```

### Full Conformance (Level 3)

```
repository-root/
├── .provenancecode/
│   ├── ai-rules.md          (REQUIRED)
│   └── validation-config.json
├── .github/                  or .gitlab/
│   ├── workflows/
│   │   └── provenance-check.yml
│   └── pull_request_template.md
├── provenance/
│   ├── config.json
│   ├── decisions/
│   │   ├── DEC-SDM-FRD-0000001/
│   │   │   ├── decision.json
│   │   │   ├── decision.md
│   │   │   ├── acceptance.receipt.json
│   │   │   ├── prov.jsonld
│   │   │   └── c2pa.manifest.json
│   │   └── DEC-SDM-FRD-0000002/
│   ├── risks/
│   │   ├── RA-000001/
│   │   │   ├── risk.json
│   │   │   └── risk.md
│   │   └── RA-000002/
│   ├── mistakes/
│   │   ├── MR-000001/
│   │   │   ├── mistake.json
│   │   │   └── mistake.md
│   │   └── MR-000002/
│   ├── specs/
│   │   ├── SPEC-000001/
│   │   │   ├── spec.json
│   │   │   └── spec.md
│   │   └── SPEC-000002/
│   ├── policies/
│   │   ├── constitution.md
│   │   ├── enforcement.yml
│   │   └── mistakes-enforcement.json
│   ├── drafts/
│   │   ├── DEC-SDM-FRD-0000003-draft.md
│   │   ├── SPEC-000003-draft.md
│   │   └── README.md
│   ├── links/
│   │   ├── .gitkeep
│   │   └── external-references.json
│   ├── indexes/
│   │   ├── learnings.index.json
│   │   └── tags.index.json
│   └── schema/              (OPTIONAL - for custom schemas)
│       ├── decision.schema.json
│       └── risk.schema.json
└── (your project files)
```

## Provenance Directory

### Location

The provenance directory MUST be at the repository root:

```
/provenance/
```

Alternative locations are NOT supported for Level 1 or Level 2 conformance.

### Purpose

Central location for all decision evidence, risks, mistakes, and specifications.

### Subdirectories

| Directory | Required | Purpose |
|-----------|----------|---------|
| `decisions/` | Level 1+ | Decision Evidence Objects |
| `risks/` | Level 2+ | Risk acceptance records |
| `mistakes/` | Level 2+ | Mistake records and guardrails |
| `specs/` | Level 2+ | Specification documents |
| `policies/` | Level 2+ | Enforcement and governance rules |
| `drafts/` | Recommended | Work-in-progress artifacts |
| `links/` | Optional | Cross-reference indexes |
| `indexes/` | Optional | Searchable indexes (tags, learnings) |
| `schema/` | Optional | Custom JSON schemas |

## Decision Structure

### Directory Pattern

Each decision MUST have its own directory:

```
provenance/decisions/{DEC-ID}/
```

Where `XXXXXX` is a zero-padded 6-digit number (000001–999999).

### Decision Files

```
provenance/decisions/DEC-SDM-FRD-0000042/
├── decision.json               (REQUIRED - source of truth)
├── decision.md                 (RECOMMENDED - human narrative)
├── acceptance.receipt.json     (OPTIONAL - cryptographic proof)
├── prov.jsonld                 (OPTIONAL - W3C PROV format)
├── c2pa.manifest.json          (OPTIONAL - C2PA credentials)
└── evidence/                   (OPTIONAL - supporting files)
    ├── diagram.png
    ├── benchmark-results.csv
    └── meeting-notes.md
```

### File Requirements by Conformance Level

| File | Level 1 | Level 2 | Level 3 |
|------|---------|---------|---------|
| `decision.json` | ✅ Required | ✅ Required | ✅ Required |
| `decision.md` | ⚠️ Recommended | ⚠️ Recommended | ✅ Required |
| `acceptance.receipt.json` | ⬜ Optional | ⬜ Optional | ✅ Required |
| `prov.jsonld` | ⬜ Optional | ⬜ Optional | ⬜ Optional |
| `c2pa.manifest.json` | ⬜ Optional | ⬜ Optional | ⬜ Optional |

### Example Layout

```
provenance/decisions/
├── DEC-SDM-FRD-0000001/
│   ├── decision.json
│   └── decision.md
├── DEC-SDM-FRD-0000002/
│   ├── decision.json
│   ├── decision.md
│   ├── acceptance.receipt.json
│   └── evidence/
│       └── architecture-diagram.png
├── DEC-SDM-FRD-0000003/
│   ├── decision.json
│   └── decision.md
└── README.md                  (Optional - index of decisions)
```

## Risk Structure

### Directory Pattern

```
provenance/risks/RA-XXXXXX/
```

### Risk Files

```
provenance/risks/RA-000015/
├── risk.json                  (REQUIRED - source of truth)
├── risk.md                    (RECOMMENDED - human description)
└── evidence/                  (OPTIONAL - supporting files)
    ├── vulnerability-scan.pdf
    └── risk-analysis.xlsx
```

### Example Layout

```
provenance/risks/
├── RA-000001/
│   ├── risk.json
│   └── risk.md
├── RA-000002/
│   ├── risk.json
│   ├── risk.md
│   └── evidence/
│       └── threat-model.pdf
└── README.md                  (Optional)
```

### Risk Fields Reference

The `risk.json` file MUST include:
- `ra_id` - Risk acceptance ID (RA-XXXXXX)
- `title` - Brief description
- `status` - Current state (active, expired, mitigated, rejected)
- `risk_statement` - Clear description of the risk
- `severity` - Risk level (low, medium, high, critical)
- `likelihood` - Probability (low, medium, high)
- `acceptance` - Who accepted and when
- `mitigations` - Risk reduction strategies
- `links.decisions` - Decisions that reference this risk

## Mistake Structure

### Directory Pattern

```
provenance/mistakes/MR-XXXXXX/
```

### Mistake Files

```
provenance/mistakes/MR-000003/
├── mistake.json               (REQUIRED - source of truth)
├── mistake.md                 (RECOMMENDED - post-mortem)
└── evidence/                  (OPTIONAL - incident artifacts)
    ├── logs.txt
    ├── timeline.md
    └── root-cause-analysis.pdf
```

### Example Layout

```
provenance/mistakes/
├── MR-000001/
│   ├── mistake.json
│   └── mistake.md
├── MR-000002/
│   ├── mistake.json
│   ├── mistake.md
│   └── evidence/
│       ├── incident-logs.txt
│       └── postmortem-slides.pdf
└── README.md                  (Optional)
```

### Mistake Fields Reference

The `mistake.json` file MUST include:
- `mr_id` - Mistake record ID (MR-XXXXXX)
- `title` - Brief description
- `status` - Current state (open, mitigated, closed)
- `severity` - Impact level (low, medium, high, critical)
- `failure_type` - Category (bug, security, compliance, process)
- `root_cause` - What went wrong and why
- `fix` - How it was resolved
- `prevent_rule` - Guardrail to prevent recurrence
- `links.decisions` - Decisions created in response

## Specification Structure

### Directory Pattern

```
provenance/specs/SPEC-XXXXXX/
```

### Spec Files

```
provenance/specs/SPEC-000028/
├── spec.json                  (REQUIRED - source of truth)
├── spec.md                    (RECOMMENDED - detailed requirements)
└── artifacts/                 (OPTIONAL - mockups, diagrams)
    ├── wireframes.fig
    ├── api-schema.yml
    └── acceptance-tests.md
```

### Example Layout

```
provenance/specs/
├── SPEC-000001/
│   ├── spec.json
│   └── spec.md
├── SPEC-000002/
│   ├── spec.json
│   ├── spec.md
│   └── artifacts/
│       ├── user-flows.png
│       └── api-spec.yml
└── README.md                  (Optional)
```

### Spec Fields Reference

The `spec.json` file MUST include:
- `id` - Specification ID (SPEC-XXXXXX)
- `title` - Brief description
- `status` - Current state (draft, review, approved, implemented, rejected)
- `risk` - Risk level associated with implementation
- `acceptanceCriteria` - List of requirements for completion
- `affectedPaths` - Code paths this spec impacts
- `relatedDecisions` - Implementing decision IDs

## Policy Files

### Location

```
provenance/policies/
```

### Required Files (Level 2+)

```
provenance/policies/
├── constitution.md            (REQUIRED - human-readable governance)
├── enforcement.yml            (REQUIRED - validation rules)
└── mistakes-enforcement.json  (RECOMMENDED - guardrail policy)
```

### File Purposes

| File | Purpose |
|------|---------|
| `constitution.md` | Documents the three presets (Light, Standard, Regulated) and team philosophy |
| `enforcement.yml` | Machine-readable enforcement rules and thresholds |
| `mistakes-enforcement.json` | Rules for validating mistake record references |

### Example Content

**constitution.md:**
```markdown
# Enforcement Philosophy

We use the **Standard** preset because...

## When Decisions Required
- Security changes
- Architecture changes
- Breaking changes

## When Specs Required
- New features
- API changes
- Database migrations
```

**enforcement.yml:**
```yaml
version: 2
preset: standard
blocking:
  mode: selective
decisions:
  requireOnLabels: [security, breaking-change]
  requireOnPaths: [src/api/, auth/]
```

## Supporting Directories

### Drafts Directory

**Location:** `provenance/drafts/`

**Purpose:** Work-in-progress artifacts not yet finalized

**Contents:**
```
provenance/drafts/
├── DEC-SDM-FRD-0000005-draft.md
├── SPEC-000010-draft.md
├── RA-000003-draft.json
└── README.md              (Template instructions)
```

**Rules:**
- Draft files are NOT enforced by validation
- File naming: `{TYPE}-{ID}-draft.{ext}`
- Move to proper directory when finalized

### Links Directory

**Location:** `provenance/links/`

**Purpose:** Cross-references to external systems (Jira, Linear, Slack, etc.)

**Contents:**
```
provenance/links/
├── .gitkeep
├── jira-mapping.json      (Decision ID → Jira key)
├── slack-threads.json     (Decision ID → Slack URL)
└── external-refs.json     (Generic external links)
```

### Indexes Directory

**Location:** `provenance/indexes/`

**Purpose:** Searchable indexes for fast lookups

**Contents:**
```
provenance/indexes/
├── learnings.index.json   (Lessons learned from mistakes)
├── tags.index.json        (All tags across artifacts)
├── by-author.index.json   (Artifacts by author)
└── by-date.index.json     (Chronological index)
```

**Example learnings.index.json:**
```json
{
  "version": "1.0",
  "updated_at": "2026-02-12T10:00:00Z",
  "learnings": [
    {
      "mr_id": "MR-000001",
      "title": "Missing input validation",
      "category": "security",
      "prevent_rule": "All user input must be validated",
      "linked_decisions": ["DEC-SDM-FRD-0000025"]
    }
  ]
}
```

## File Naming Conventions

### ID Formats

ProvenanceCode supports hierarchical ID formats to enable monorepo organization and cross-system referencing (dashboards, JIRA, etc.). The format is configurable via `provenance/config.json`.

**Hierarchical Format:**
```
{TYPE}-{PROJECT}-[{SUBPROJECT}-]{NUMBER}
```

**Components:**
- **TYPE**: Artifact type prefix (DEC, RA, MR, SPEC)
- **PROJECT**: Project identifier (2-6 uppercase alphanumeric chars)
- **SUBPROJECT**: (OPTIONAL) Sub-project/module identifier (2-6 uppercase alphanumeric chars)
- **NUMBER**: Zero-padded 7-digit number (0000001-9999999)

| Artifact Type | Full Format | Example | Without Subproject | Example |
|--------------|-------------|---------|-------------------|---------|
| Decision | `DEC-{PROJECT}-{SUBPROJECT}-{NUMBER}` | `DEC-SDM-FRD-0000019` | `DEC-{PROJECT}-{NUMBER}` | `DEC-CORE-0000042` |
| Risk | `RA-{PROJECT}-{SUBPROJECT}-{NUMBER}` | `RA-CORE-API-0000042` | `RA-{PROJECT}-{NUMBER}` | `RA-PLT-0000015` |
| Mistake | `MR-{PROJECT}-{SUBPROJECT}-{NUMBER}` | `MR-PLT-AUTH-0000003` | `MR-{PROJECT}-{NUMBER}` | `MR-WEB-0000007` |
| Specification | `SPEC-{PROJECT}-{SUBPROJECT}-{NUMBER}` | `SPEC-WEB-UI-0000128` | `SPEC-{PROJECT}-{NUMBER}` | `SPEC-API-0000050` |

**Legacy Format Support:**

For backward compatibility, the simple format is still supported:

| Artifact Type | Legacy Format | Example |
|--------------|---------------|---------|
| Decision | `DEC-{NUMBER}` | `DEC-000042` |
| Risk | `RA-{NUMBER}` | `RA-000015` |
| Mistake | `MR-{NUMBER}` | `MR-000003` |
| Specification | `SPEC-{NUMBER}` | `SPEC-000028` |

**Format Rules:**
- PROJECT and SUBPROJECT identifiers:
  - MUST be 2-6 uppercase alphanumeric characters
  - SHOULD use meaningful abbreviations (SDM=system-demo, FRD=frontend, CORE=core-services)
  - SHOULD be consistent within a repository
  - SUBPROJECT is OPTIONAL (can use `DEC-{PROJECT}-{NUMBER}` format)
- NUMBER component:
  - MUST be zero-padded to 7 digits in hierarchical format
  - MUST be zero-padded to 6 digits in legacy format
  - SHOULD be assigned sequentially within scope (PROJECT-SUBPROJECT or PROJECT or global)

**Configuration:**

The ID format is configured in `provenance/config.json`:

```json
{
  "version": "1.0",
  "id_format": {
    "style": "hierarchical",
    "project": "SDM",
    "subproject": "FRD",
    "require_subproject": false
  }
}
```

Configuration options:
- `style`: `"hierarchical"` or `"legacy"` (default: `"legacy"`)
- `project`: Project identifier (required if style is hierarchical)
- `subproject`: Default subproject identifier (optional)
- `require_subproject`: If true, all IDs must include subproject (default: `false`)

### Directory Names

- MUST match the ID exactly
- MUST be uppercase
- MUST include leading zeros
- PROJECT and SUBPROJECT identifiers MUST match exactly

✅ Good (Hierarchical):
```
provenance/decisions/DEC-SDM-FRD-0000019/
provenance/risks/RA-CORE-API-0000042/
provenance/mistakes/MR-PLT-AUTH-0000003/
provenance/specs/SPEC-WEB-UI-0000128/
```

✅ Good (Legacy):
```
provenance/decisions/DEC-000001/
provenance/risks/RA-000042/
```

❌ Bad:
```
provenance/decisions/dec-sdm-frd-1/           # Wrong case, missing zeros
provenance/decisions/DEC-SDM-FRD-0000001-foo/ # Extra suffix
provenance/decisions/DEC-SDM-frd-0000001/     # Lowercase subproject
```

### File Names

| File Purpose | Naming Pattern | Example |
|--------------|---------------|---------|
| Primary artifact | `{type}.json` | `decision.json`, `risk.json` |
| Markdown narrative | `{type}.md` | `decision.md`, `spec.md` |
| Acceptance receipt | `acceptance.receipt.json` | (exact name) |
| W3C PROV | `prov.jsonld` | (exact name) |
| C2PA manifest | `c2pa.manifest.json` | (exact name) |
| Draft | `{ID}-draft.{ext}` | `DEC-SDM-FRD-0000005-draft.md` or `DEC-000005-draft.md` |
| Evidence | (any) | `diagram.png`, `logs.txt` |

## Conformance Requirements

### Level 1: Decision Records Only

**MUST have:**
- `/provenance/` directory at root
- `/provenance/config.json` file
- `/provenance/decisions/` directory
- At least one valid decision: `/provenance/decisions/{DEC-ID}/decision.json`

**Example:**
```
repo-root/
├── provenance/
│   ├── config.json
│   └── decisions/
│       └── DEC-SDM-FRD-0000001/
│           └── decision.json
└── src/
```

### Level 2: Standard Compliance

**MUST have all Level 1 requirements, plus:**
- `/provenance/risks/` directory (may be empty)
- `/provenance/mistakes/` directory (may be empty)
- `/provenance/specs/` directory (may be empty)
- `/provenance/policies/enforcement.yml`
- `/provenance/policies/constitution.md`

**Example:**
```
repo-root/
├── provenance/
│   ├── config.json
│   ├── decisions/
│   ├── risks/
│   ├── mistakes/
│   ├── specs/
│   └── policies/
│       ├── enforcement.yml
│       └── constitution.md
└── src/
```

### Level 3: Full Provenance

**MUST have all Level 2 requirements, plus:**
- `/.provenancecode/ai-rules.md`
- At least one decision with `acceptance.receipt.json`
- At least one mistake record
- At least one risk acceptance
- `/provenance/drafts/` directory
- `/provenance/indexes/` directory with at least `learnings.index.json`

## Migration and Growth

### Starting Small

Begin with Level 1:
```bash
mkdir -p provenance/decisions
touch provenance/config.json
```

### Adding Structure

Grow to Level 2:
```bash
mkdir -p provenance/{risks,mistakes,specs,policies,drafts}
touch provenance/policies/enforcement.yml
touch provenance/policies/constitution.md
```

### Full Adoption

Reach Level 3:
```bash
mkdir -p .provenancecode
mkdir -p provenance/indexes
touch .provenancecode/ai-rules.md
touch provenance/indexes/learnings.index.json
```

## Platform-Specific Notes

### GitHub
- Use `.github/workflows/` for validation actions
- Use `.github/pull_request_template.md` for PR template

### GitLab
- Use `.gitlab-ci.yml` for validation pipeline
- Use `.gitlab/merge_request_templates/` for MR template

### Bitbucket
- Use `bitbucket-pipelines.yml` for validation
- Use pull request description template feature

All platforms work with the same `/provenance/` structure.

## Best Practices

1. **Keep flat** - Don't nest subdirectories within decision folders (except `/evidence/`)
2. **One artifact per directory** - Don't combine multiple decisions in one folder
3. **Sequential IDs** - Assign IDs in order for easier browsing
4. **README files** - Add optional README.md files to directories for navigation
5. **Gitignore evidence** - Optionally exclude large binary files from `/evidence/`

---

**Next:** [Versioning and Lifecycle](versioning.md) - Managing artifact states  
**See Also:** [Decision Evidence Objects (DEO)](deo.md) - Decision file formats

