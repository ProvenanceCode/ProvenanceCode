# Decision Evidence Objects (DEO) Specification

**Version:** 1.0.0  
**Status:** Draft  
**Part of:** ProvenanceCode Open Standard

## Abstract

This document defines the Decision Evidence Object (DEO) format, a structured way to capture technical decisions in software projects. DEOs provide auditable evidence of why decisions were made, what options were considered, and what risks were accepted.

## Table of Contents

1. [Overview](#overview)
2. [File Structure](#file-structure)
3. [Decision ID Format](#decision-id-format)
4. [JSON Schema](#json-schema)
5. [Markdown Format](#markdown-format)
6. [Lifecycle States](#lifecycle-states)
7. [Required Fields](#required-fields)
8. [Optional Extensions](#optional-extensions)
9. [Examples](#examples)
10. [Validation Rules](#validation-rules)

## Overview

A Decision Evidence Object (DEO) is a structured record that captures:
- **Context:** Why the decision was needed
- **Options:** Alternatives that were considered
- **Outcome:** What was chosen
- **Rationale:** Why this option was selected
- **Risk:** Associated risks and their acceptance
- **Links:** Connections to specs, PRs, issues, and other decisions

## File Structure

Each decision MUST be stored in its own directory:

```
/provenance/decisions/{DEC-ID}/
  decision.json          (REQUIRED - source of truth)
  decision.md            (RECOMMENDED - human narrative)
  acceptance.receipt.json (OPTIONAL - cryptographic proof)
  prov.jsonld            (OPTIONAL - W3C PROV format)
  c2pa.manifest.json     (OPTIONAL - C2PA credentials)
  /evidence/             (OPTIONAL - supporting artifacts)
```

### File Purposes

- **decision.json** - Structured data, machine-readable, validates against schema
- **decision.md** - Human-friendly narrative, context, and discussion
- **acceptance.receipt.json** - Cryptographic proof of approval (timestamps, signatures)
- **prov.jsonld** - W3C PROV format for provenance chains
- **c2pa.manifest.json** - Content Credentials for tamper detection
- **/evidence/** - Screenshots, diagrams, logs, or other supporting files

## Decision ID Format

Decision IDs support two formats: **Hierarchical** (recommended for monorepos) and **Legacy** (simple format).

### Hierarchical Format (Recommended)

**Format:**
```
DEC-{PROJECT}-[{SUBPROJECT}-]{NUMBER}
```

**Components:**
- `DEC-` - Required prefix for decisions
- `{PROJECT}` - 2-6 uppercase alphanumeric characters identifying the project (e.g., SDM for system-demo, CORE for core-services)
- `{SUBPROJECT}` - (OPTIONAL) 2-6 uppercase alphanumeric characters identifying the sub-project/module (e.g., FRD for frontend, API for api-layer)
- `{NUMBER}` - 7-digit zero-padded number (0000001 through 9999999)

**Examples with subproject:**
- ✅ `DEC-SDM-FRD-0000019` (system-demo, frontend, decision 19)
- ✅ `DEC-CORE-API-0000042` (core, api, decision 42)
- ✅ `DEC-PLT-AUTH-0000128` (platform, auth, decision 128)

**Examples without subproject:**
- ✅ `DEC-CORE-0000042` (core project, decision 42)
- ✅ `DEC-WEB-0000015` (web project, decision 15)
- ✅ `DEC-API-0000007` (api project, decision 7)

**Invalid examples:**
- ❌ `DEC-sdm-frd-0000019` (lowercase not allowed)
- ❌ `DEC-SDM-FRD-19` (must be zero-padded to 7 digits)
- ❌ `DEC-VERYLONGPROJECT-FRD-0000019` (project identifier too long)

**Benefits:**
- Flexible organization for both monorepos and simple structures
- Easy filtering in dashboards and JIRA
- Scoped sequential numbering per project or project-subproject
- Better cross-repository referencing
- Optional subproject allows simpler structure when not needed

### Legacy Format

**Format:**
```
DEC-{NUMBER}
```

**Components:**
- `DEC-` - Required prefix
- `{NUMBER}` - 6-digit zero-padded number (000001 through 999999)

**Examples:**
- ✅ `DEC-000001`
- ✅ `DEC-042815`
- ❌ `DEC-1` (must be zero-padded)
- ❌ `DECISION-000001` (wrong prefix)
- ❌ `DEC-0000001` (wrong digit count for legacy format)

### Format Configuration

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

**Configuration Options:**
- `style`: `"hierarchical"` or `"legacy"` (default: `"legacy"`)
- `project`: Project identifier, required if style is `"hierarchical"`
- `subproject`: Default subproject identifier (optional)
- `require_subproject`: If `true`, all IDs must include subproject (default: `false`)

### ID Assignment

Decision IDs SHOULD be assigned sequentially within their scope:
- **Hierarchical with subproject**: Sequential within each PROJECT-SUBPROJECT combination
- **Hierarchical without subproject**: Sequential within each PROJECT
- **Legacy**: Sequential globally

The folder name MUST match the `id` field in `decision.json`.

**Hierarchical Example:**
```
/provenance/decisions/DEC-SDM-FRD-0000042/decision.json
```

Contains:

```json
{
  "id": "DEC-SDM-FRD-0000042",
  ...
}
```

**Legacy Example:**
```
/provenance/decisions/DEC-000042/decision.json
```

Contains:

```json
{
  "id": "DEC-SDM-FRD-0000042",
  ...
}
```

## JSON Schema

### Minimal Required Decision

```json
{
  "schema": "provenancecode.decision.v1",
  "id": "DEC-SDM-FRD-0000001",
  "title": "Brief decision title",
  "version": 1,
  "lifecycle": {
    "state": "accepted"
  },
  "timestamps": {
    "created_at": "2026-02-12T10:30:00Z"
  },
  "actors": {
    "author": "username"
  },
  "outcome": "What was decided",
  "rationale": "Why this was chosen",
  "risk": {
    "level": "low"
  }
}
```

### Complete Decision Schema

```json
{
  "schema": "provenancecode.decision.v1",
  "id": "DEC-SDM-FRD-0000042",
  "title": "Migrate from REST to GraphQL for API layer",
  "version": 1,
  
  "lifecycle": {
    "state": "accepted",
    "supersedes": null,
    "superseded_by": null
  },
  
  "timestamps": {
    "created_at": "2026-02-10T14:30:00Z",
    "accepted_at": "2026-02-12T09:15:00Z",
    "updated_at": null,
    "expires_at": null
  },
  
  "actors": {
    "author": "user:alice",
    "approver": "user:bob",
    "bot": "cursor-ai",
    "reviewers": ["user:carol", "user:dave"]
  },
  
  "context": {
    "jira_key": "ARCH-425",
    "repo": "backend-api",
    "component": "api-layer",
    "links": [
      "https://company.atlassian.net/browse/ARCH-425",
      "https://github.com/org/repo/pull/142"
    ]
  },
  
  "problem": "REST API has grown complex with multiple endpoints, inconsistent patterns, and overfetching issues affecting mobile clients.",
  
  "options": [
    "Continue with REST and refactor endpoints",
    "Migrate to GraphQL with gradual rollout",
    "Adopt gRPC for internal services"
  ],
  
  "outcome": "Migrate to GraphQL with gradual rollout starting with mobile endpoints.",
  
  "rationale": "GraphQL provides better mobile experience, type safety, and eliminates overfetching. Gradual rollout minimizes risk.",
  
  "risk": {
    "level": "medium",
    "description": "Learning curve and potential performance issues with complex queries",
    "acceptance": "RA-000015",
    "mitigations": [
      "Team training on GraphQL best practices",
      "Query complexity limits enforced",
      "Performance monitoring dashboard"
    ]
  },
  
  "scope": [
    "api",
    "mobile",
    "architecture"
  ],
  
  "tags": [
    "graphql",
    "rest",
    "migration",
    "architecture"
  ],
  
  "links": {
    "pr": ["142"],
    "issues": ["https://github.com/org/repo/issues/98"],
    "specs": ["SPEC-000028"],
    "decisions": ["DEC-SDM-FRD-0000015"],
    "risks": ["RA-000015"]
  },
  
  "integrity": {
    "receipt_path": "provenance/decisions/DEC-000042/acceptance.receipt.json",
    "commit_sha": "a1b2c3d4e5f6",
    "prov_path": "provenance/decisions/DEC-000042/prov.jsonld"
  },
  
  "attestations": [
    {
      "type": "c2pa",
      "manifest_path": "provenance/decisions/DEC-000042/c2pa.manifest.json"
    }
  ],
  
  "metadata": {
    "review_duration_hours": 48,
    "stakeholder_count": 4,
    "impact_score": 8
  }
}
```

## Field Definitions

### Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `schema` | string | MUST be `"provenancecode.decision.v1"` |
| `id` | string | Decision ID in hierarchical format `DEC-{PROJECT}-[{SUBPROJECT}-]{NUMBER}` or legacy format `DEC-{NUMBER}` |
| `title` | string | Brief, descriptive title (max 120 chars recommended) |
| `version` | integer | Version number (starts at 1, increments on updates) |
| `lifecycle.state` | string | Current state: `draft`, `proposed`, `accepted`, `rejected`, `superseded` |
| `timestamps.created_at` | string | ISO 8601 timestamp of creation |
| `actors.author` | string | Username or identifier of decision author |
| `outcome` | string | What was decided |
| `rationale` | string | Why this outcome was chosen |
| `risk.level` | string | Risk level: `low`, `medium`, `high`, `critical` |

### Recommended Fields

| Field | Type | Description |
|-------|------|-------------|
| `decision.md` | file | Human-readable narrative |
| `timestamps.accepted_at` | string | When decision was approved |
| `actors.approver` | string | Who approved the decision |
| `options` | array | List of alternatives considered |
| `problem` | string | Context and motivation |
| `links.pr` | array | Pull request numbers or URLs |
| `scope` | array | Affected areas: `security`, `architecture`, `data`, etc. |
| `tags` | array | Searchable keywords |

### Optional Fields

| Field | Type | Description |
|-------|------|-------------|
| `lifecycle.supersedes` | string | Previous decision ID this replaces |
| `lifecycle.superseded_by` | string | New decision ID that replaces this |
| `timestamps.updated_at` | string | Last update timestamp |
| `timestamps.expires_at` | string | Expiration for temporary decisions |
| `actors.bot` | string | AI assistant that created draft |
| `actors.reviewers` | array | List of reviewers |
| `context.*` | object | External system links (Jira, Linear, etc.) |
| `links.specs` | array | Related specification IDs |
| `links.decisions` | array | Related decision IDs |
| `links.risks` | array | Related risk acceptance IDs |
| `risk.acceptance` | string | Risk acceptance ID (RA-XXXXXX) |
| `risk.mitigations` | array | Risk mitigation strategies |
| `integrity.*` | object | Cryptographic proof references |
| `attestations` | array | External attestation formats |
| `metadata` | object | Custom project-specific fields |

## Markdown Format

The `decision.md` file provides human context. It SHOULD follow this structure:

```markdown
# {DEC-ID}: [Title]

**Status:** [State]  
**Date:** [YYYY-MM-DD]  
**Author:** [Name]  
**Approver:** [Name]

## Context

[Why was this decision needed? What problem are we solving?]

## Options Considered

1. **Option A** - [Description and tradeoffs]
2. **Option B** - [Description and tradeoffs]
3. **Option C** - [Description and tradeoffs]

## Decision

[What did we decide to do?]

## Rationale

[Why did we choose this option? What makes it better than alternatives?]

## Consequences

### Positive
- [Benefit 1]
- [Benefit 2]

### Negative
- [Tradeoff 1]
- [Tradeoff 2]

## Risk

**Level:** [low/medium/high/critical]

[Risk description and mitigation plan]

## Implementation

[How will this be implemented? Any phasing or milestones?]

## References

- [SPEC-XXXXXX: Related Specification](../specs/SPEC-XXXXXX/spec.md)
- [PR #123](https://github.com/org/repo/pull/123)
- [Original Discussion](https://company.slack.com/archives/C123/p123456)
```

## Lifecycle States

### State Definitions

| State | Description | Transitions To |
|-------|-------------|----------------|
| `draft` | Initial creation, not yet reviewed | `proposed`, `rejected` |
| `proposed` | Submitted for review | `accepted`, `rejected`, `draft` |
| `accepted` | Approved and active | `superseded` |
| `rejected` | Not approved, will not be implemented | none (terminal) |
| `superseded` | Replaced by a newer decision | none (terminal) |

### State Transition Rules

1. New decisions MUST start in `draft` state
2. Decisions can move from `draft` to `proposed` when ready for review
3. Only `proposed` decisions can become `accepted`
4. `accepted` decisions MUST NOT be edited; create new decision and mark old as `superseded`
5. `rejected` and `superseded` are terminal states

### Supersession

When superseding a decision:

```json
// Old decision DEC-000010
{
  "id": "DEC-SDM-FRD-0000010",
  "lifecycle": {
    "state": "superseded",
    "superseded_by": "DEC-SDM-FRD-0000042"
  }
}

// New decision DEC-000042
{
  "id": "DEC-SDM-FRD-0000042",
  "lifecycle": {
    "state": "accepted",
    "supersedes": "DEC-SDM-FRD-0000010"
  }
}
```

## Optional Extensions

### Acceptance Receipts

File: `acceptance.receipt.json`

Provides cryptographic proof of approval:

```json
{
  "schema": "provenancecode.receipt.v1",
  "decision_id": "DEC-SDM-FRD-0000042",
  "approved_by": "user:bob",
  "approved_at": "2026-02-12T09:15:00Z",
  "commit_sha": "a1b2c3d4e5f6",
  "signature": "base64-encoded-signature",
  "certificate": "base64-encoded-cert"
}
```

### W3C PROV Format

File: `prov.jsonld`

Provides provenance chain in W3C standard format for interoperability.

### C2PA Content Credentials

File: `c2pa.manifest.json`

Tamper-evident credentials following C2PA standard.

## Validation Rules

### Structural Validation

1. Decision folder name MUST match `id` field
2. `decision.json` MUST exist and be valid JSON
3. `decision.json` MUST validate against schema
4. `schema` field MUST be `"provenancecode.decision.v1"`
5. All required fields MUST be present

### Semantic Validation

6. `id` MUST match hierarchical format `DEC-{PROJECT}-[{SUBPROJECT}-]{NUMBER}` or legacy format `DEC-{NUMBER}` based on config
7. `lifecycle.state` MUST be valid state name
8. `timestamps.created_at` MUST be valid ISO 8601
9. `risk.level` MUST be `low`, `medium`, `high`, or `critical`
10. If `lifecycle.supersedes` is present, that decision MUST exist
11. If `links.specs` is present, referenced specs SHOULD exist
12. If `links.pr` is present and enforcement requires it, PR MUST match current PR

### Link Validation

13. `links.pr` entries MUST be valid PR numbers or URLs
14. `links.decisions` entries MUST reference existing decisions
15. `links.risks` entries MUST reference existing risk acceptances
16. `links.specs` entries MUST reference existing specifications

## Examples

See `/examples/example-decision/` for complete working examples including:
- Minimal decision
- Architectural decision with multiple options
- Security decision with risk acceptance
- Decision with cryptographic receipt

## Non-Normative Guidance

### When to Create a Decision

Create a decision record when:
- Making architectural or cross-cutting changes
- Accepting technical debt or risks
- Choosing between significant alternatives
- Making security or compliance-related choices
- Establishing patterns or conventions
- Making irreversible changes (migrations, API contracts)

### When NOT to Create a Decision

Skip decision records for:
- Routine bug fixes
- Documentation updates
- Code formatting or style changes
- Dependency version bumps (unless breaking)
- Test additions

### Best Practices

1. **Write drafts early** - Create draft while evaluating options
2. **Be concise** - Keep outcome and rationale focused
3. **List alternatives** - Show what was considered
4. **Link everything** - Connect to PRs, specs, and related decisions
5. **Update state** - Mark as accepted when merged
6. **Never edit accepted** - Supersede instead of modifying

---

**Next:** [Enforcement Policies](enforcement.md) - Learn how decisions are validated

