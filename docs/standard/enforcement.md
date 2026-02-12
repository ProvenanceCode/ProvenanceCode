# Enforcement Policies Specification

**Version:** 1.0.0  
**Status:** Draft  
**Part of:** ProvenanceCode Open Standard

## Abstract

This document defines how ProvenanceCode validates decision evidence, specifications, and risk acceptances through configurable enforcement policies. Three presets (Light, Standard, Regulated) provide flexibility for different team needs.

## Table of Contents

1. [Overview](#overview)
2. [Enforcement Philosophy](#enforcement-philosophy)
3. [Configuration Files](#configuration-files)
4. [Enforcement Presets](#enforcement-presets)
5. [Validation Rules](#validation-rules)
6. [Path and Label Triggers](#path-and-label-triggers)
7. [Blocking Modes](#blocking-modes)
8. [Drift Detection](#drift-detection)
9. [AI Attribution](#ai-attribution)
10. [Examples](#examples)

## Overview

Enforcement policies determine:
- **When** validation occurs (which paths, labels trigger requirements)
- **What** is required (decisions, specs, risks, or mistake references)
- **How strictly** rules are applied (warn, block selectively, or block always)
- **What state** artifacts must be in (draft, review, accepted)

## Enforcement Philosophy

### Three Principles

1. **Flexibility** - Teams choose their governance level
2. **Progressive Adoption** - Start light, increase rigor as needed
3. **Context-Aware** - Different rules for different paths and change types

### When Enforcement Runs

Enforcement validation SHOULD run:
- On pull request creation
- On pull request updates (new commits)
- Before merge (CI/CD gate)
- (Optional) As pre-commit hook

Enforcement MAY be skipped for:
- Documentation-only changes (when `allowNoDecisionForDocsOnly: true`)
- Automated dependency updates (configurable)
- Hotfix branches (policy decision)

## Configuration Files

### Primary: `provenance/config.json`

This file defines paths, thresholds, and basic requirements:

```json
{
  "decisionPath": "provenance/decisions",
  "riskPath": "provenance/risks",
  "mistakePath": "provenance/mistakes",
  "specPath": "provenance/specs",
  "indexesPath": "provenance/indexes",
  "enforcementPolicyPath": "provenance/policies/enforcement.yml",
  
  "requireDecisionOnPaths": [
    "src/",
    "infra/",
    "security/"
  ],
  "requireDecisionOnLabels": [
    "security",
    "breaking-change",
    "architecture"
  ],
  "allowNoDecisionForDocsOnly": true,
  
  "requireRiskOnPaths": [
    "**/auth/**",
    "**/security/**",
    "**/permissions/**",
    "**/crypto/**"
  ],
  "requireRiskOnLabels": [
    "risk-accepted",
    "security-waiver"
  ],
  "allowNoRiskForDocsOnly": true,
  
  "requireSpecOnPaths": [
    "src/"
  ],
  "requireSpecOnLabels": [
    "feature",
    "enhancement"
  ],
  "allowNoSpecForDocsOnly": true,
  
  "riskApprovalThreshold": "medium",
  "specRiskDecisionThreshold": "medium"
}
```

### Policy: `provenance/policies/enforcement.yml`

This file defines the enforcement preset and detailed rules:

```yaml
version: 2
preset: standard
blocking:
  mode: selective

specs:
  requireOnLabels:
    - feature
    - enhancement
    - breaking-change
  requireOnPaths:
    - src/api/
    - src/core/
    - frontend/state/
  allowNoSpecForDocsOnly: true
  requiredStatus:
    - review
    - approved
  acceptanceCriteriaRequired: false
  driftDetection: warn

decisions:
  requireOnLabels:
    - security
    - breaking-change
    - risk-high
  requireOnPaths:
    - auth/
    - payments/
    - infra/
  allowNoDecisionForDocsOnly: true
  requireOnSpecRisk: medium
  statusByRisk:
    low: draft
    medium: draft
    high: accepted

risks:
  requireOnLabels:
    - risk-accepted
    - security-waiver
  requireOnPaths:
    - "**/auth/**"
    - "**/security/**"
    - "**/permissions/**"
    - "**/crypto/**"
  allowNoRiskForDocsOnly: true

coherence:
  requireDecisionSpecLink: true

ai:
  attributionRequired: false
  attributionPattern: "AI Attribution"
```

### Constitution: `provenance/policies/constitution.md`

Human-readable explanation of the three presets. Not parsed, but documents intent.

## Enforcement Presets

### Light Preset

**Philosophy:** Move fast with advisory governance

**Characteristics:**
- Blocking: `never` by default
- Missing items produce warnings only
- Bot role: advisor
- Suitable for: Startups, MVPs, early-stage projects

**Behavior:**
```yaml
preset: light
blocking:
  mode: never

specs:
  requireOnLabels: [feature]  # recommended, not required
  requiredStatus: [draft, review, approved]
  driftDetection: off

decisions:
  requireOnLabels: [security, breaking-change]  # warn only
  statusByRisk:
    low: draft
    medium: draft
    high: draft  # acceptance not required

ai:
  attributionRequired: false
```

**What Gets Validated:**
- Decision format (if present)
- Spec format (if present)
- Links (if present)

**What Doesn't Block:**
- Missing decisions
- Missing specs
- Missing risk acceptances
- Draft-state decisions

### Standard Preset (Recommended)

**Philosophy:** Specs drive work, decisions guard risk

**Characteristics:**
- Blocking: `selective` (missing required items blocks)
- Bot role: gatekeeper
- Suitable for: Production teams, scale-ups, SaaS products

**Behavior:**
```yaml
preset: standard
blocking:
  mode: selective

specs:
  requireOnLabels: [feature, enhancement, breaking-change]
  requireOnPaths: [src/api/, src/core/, frontend/state/]
  requiredStatus: [review, approved]  # no drafts
  acceptanceCriteriaRequired: false
  driftDetection: warn

decisions:
  requireOnLabels: [security, breaking-change, risk-high]
  requireOnPaths: [auth/, payments/, infra/]
  requireOnSpecRisk: medium  # specs with medium+ risk need decision
  statusByRisk:
    low: draft        # low risk: draft OK
    medium: draft     # medium risk: draft OK (but review recommended)
    high: accepted    # high risk: must be accepted

risks:
  requireOnLabels: [risk-accepted, security-waiver]
  requireOnPaths: ["**/auth/**", "**/security/**"]

coherence:
  requireDecisionSpecLink: true  # decisions must reference specs

ai:
  attributionRequired: false
```

**What Gets Blocked:**
- Changes to sensitive paths without decisions
- Feature PRs without specs
- High-risk decisions not in `accepted` state
- Invalid decision/spec links

**What Still Allows Merge:**
- Draft decisions for low/medium risk
- Documentation-only changes
- Changes to non-sensitive paths

### Regulated Preset

**Philosophy:** Nothing ships without provenance

**Characteristics:**
- Blocking: `always` (missing required items blocks)
- Bot role: authority
- Suitable for: Enterprise, safety-critical, regulated industries (healthcare, finance)

**Behavior:**
```yaml
preset: regulated
blocking:
  mode: always

specs:
  requireOnLabels: ["*"]  # all labeled PRs
  requireOnPaths: ["src/", "infra/", "config/"]
  allowNoSpecForDocsOnly: true  # only exception
  requiredStatus: [approved]  # must be fully approved
  acceptanceCriteriaRequired: true  # specs must have acceptance criteria
  driftDetection: block  # block if diff doesn't match spec scope

decisions:
  requireOnLabels: [security, breaking-change, risk-high, architecture, compliance]
  requireOnPaths: [src/, infra/, security/, models/]
  requireOnSpecRisk: low  # any spec with risk needs decision
  statusByRisk:
    low: accepted     # even low risk needs acceptance
    medium: accepted
    high: accepted
    critical: accepted

risks:
  requireOnLabels: [risk-accepted, security-waiver, compliance-exception]
  requireOnPaths: ["**/auth/**", "**/security/**", "**/permissions/**", "**/crypto/**", "**/data/**"]

coherence:
  requireDecisionSpecLink: true
  requireSpecAcceptanceCriteria: true
  requireReceiptForDecisions: true  # cryptographic receipt required

ai:
  attributionRequired: true  # must declare AI involvement
  attributionPattern: "AI Attribution"
```

**What Gets Blocked:**
- Any non-doc PR without a spec
- Any decision not in `accepted` state
- Specs without acceptance criteria
- Changes to spec scope without updating spec
- Missing AI attribution when AI was involved

**No Exceptions Except:**
- Pure documentation changes (README, comments)

## Validation Rules

### Decision Validation

1. **Format Validation**
   - `decision.json` exists and is valid JSON
   - Matches JSON schema
   - Required fields present

2. **ID Validation**
   - Folder name matches `id` field
   - ID format is `DEC-XXXXXX`
   - ID is unique

3. **State Validation**
   - `lifecycle.state` is valid
   - State meets policy requirements
     - Light: any state allowed
     - Standard: `draft` or higher for low/medium risk, `accepted` for high risk
     - Regulated: `accepted` required

4. **Link Validation**
   - If `requireDecisionSpecLink: true`, decision MUST reference a spec
   - Referenced specs MUST exist
   - PR number/URL MUST match current PR (if configured)

5. **Timestamp Validation**
   - `created_at` is valid ISO 8601
   - `accepted_at` present if state is `accepted`
   - `accepted_at` is after `created_at`

### Spec Validation

1. **Format Validation**
   - `spec.json` exists and is valid JSON
   - Matches JSON schema

2. **Status Validation**
   - Status meets preset requirements:
     - Light: any status
     - Standard: `review` or `approved`
     - Regulated: `approved` only

3. **Acceptance Criteria**
   - If `acceptanceCriteriaRequired: true`, spec MUST have acceptance criteria

4. **Risk-Decision Coherence**
   - If spec risk level ≥ `specRiskDecisionThreshold`, a decision MUST be linked

### Risk Validation

1. **Format Validation**
   - `risk.json` exists and is valid JSON
   - Matches JSON schema

2. **Expiration Check**
   - If `expires_at` is present and past, validation SHOULD warn or block

3. **Decision Link**
   - Risk SHOULD be referenced by at least one decision

### Drift Detection

Drift occurs when the PR diff doesn't match the spec's `affectedPaths`:

```yaml
driftDetection: off     # Don't check
driftDetection: warn    # Log warning, allow merge
driftDetection: block   # Block merge
```

**Example:**

```json
// spec.json
{
  "affectedPaths": ["src/api/", "src/models/"]
}
```

If PR changes `src/database/` but spec doesn't mention it, drift is detected.

## Path and Label Triggers

### Path Matching

Paths support glob patterns:

```json
"requireDecisionOnPaths": [
  "src/",              // exact prefix
  "**/auth/**",        // any depth
  "infra/*.tf",        // specific file types
  "!docs/**"           // exclusion
]
```

### Label Matching

Labels are exact string matches:

```json
"requireDecisionOnLabels": [
  "security",
  "breaking-change",
  "architecture"
]
```

### Docs-Only Detection

If `allowNoDecisionForDocsOnly: true`, enforcement is skipped when ALL changed files match:

```
**/*.md
**/docs/**
**/README*
**/LICENSE
```

## Blocking Modes

### Never Block

```yaml
blocking:
  mode: never
```

All validation failures produce warnings in PR comments, but never block merge.

### Selective Block

```yaml
blocking:
  mode: selective
```

Block merge only when:
- A required decision/spec/risk is missing
- A decision/spec is in invalid state for the risk level
- Links are broken or invalid

Warnings are produced for:
- Drift detection (unless `block` mode)
- Recommendations (e.g., "consider adding risk acceptance")

### Always Block

```yaml
blocking:
  mode: always
```

Any validation failure blocks merge. Used in regulated environments.

## AI Attribution

### Purpose

Track when AI assistants contributed to decisions or implementation.

### Configuration

```yaml
ai:
  attributionRequired: true
  attributionPattern: "AI Attribution"
```

### Implementation

When `attributionRequired: true`, the PR body or commit messages MUST contain the `attributionPattern` string.

**Example PR Body:**

```markdown
## Summary

Implement GraphQL migration as per DEC-000042.

## AI Attribution

Cursor AI assisted with:
- Initial decision draft
- Schema design
- Migration script generation
```

### Decision Bot Field

AI assistants SHOULD populate the `bot` field in decisions they create:

```json
{
  "actors": {
    "author": "user:alice",
    "bot": "cursor-ai",
    "approver": "user:bob"
  }
}
```

## Examples

### Example 1: Light Enforcement

A startup wants decision tracking but no blocking:

**provenance/config.json:**
```json
{
  "requireDecisionOnPaths": ["src/"],
  "requireDecisionOnLabels": ["security"],
  "allowNoDecisionForDocsOnly": true
}
```

**provenance/policies/enforcement.yml:**
```yaml
preset: light
blocking:
  mode: never
decisions:
  requireOnLabels: [security]
  statusByRisk:
    low: draft
    medium: draft
    high: draft
```

**Result:** All PRs produce warnings if missing decisions, but never block.

### Example 2: Standard Enforcement

A SaaS company wants governance on API and security changes:

**provenance/config.json:**
```json
{
  "requireDecisionOnPaths": ["src/api/", "auth/", "payments/"],
  "requireDecisionOnLabels": ["security", "breaking-change"],
  "requireSpecOnLabels": ["feature", "enhancement"]
}
```

**provenance/policies/enforcement.yml:**
```yaml
preset: standard
blocking:
  mode: selective
specs:
  requireOnLabels: [feature, enhancement]
  requiredStatus: [review, approved]
decisions:
  requireOnPaths: [auth/, payments/]
  requireOnLabels: [security, breaking-change]
  statusByRisk:
    low: draft
    medium: draft
    high: accepted
```

**Result:**
- Feature PRs need specs in review/approved state
- Changes to auth/ or payments/ need decisions
- High-risk decisions must be accepted
- Other PRs pass through

### Example 3: Regulated Enforcement

A healthcare company needs strict compliance:

**provenance/policies/enforcement.yml:**
```yaml
preset: regulated
blocking:
  mode: always
specs:
  requireOnPaths: ["src/"]
  allowNoSpecForDocsOnly: true
  requiredStatus: [approved]
  acceptanceCriteriaRequired: true
decisions:
  requireOnPaths: ["src/", "infra/"]
  statusByRisk:
    low: accepted
    medium: accepted
    high: accepted
coherence:
  requireDecisionSpecLink: true
  requireReceiptForDecisions: true
ai:
  attributionRequired: true
```

**Result:**
- Every code change needs an approved spec
- Every spec needs an accepted decision
- Acceptance receipts required
- AI usage must be declared
- Documentation is the only exception

## Migration Between Presets

Teams can graduate from Light → Standard → Regulated:

1. **Start Light**
   - Install ProvenanceCode
   - Create decisions for major changes
   - Get comfortable with workflow

2. **Move to Standard**
   - Add spec requirements for features
   - Require accepted state for high-risk decisions
   - Enable selective blocking

3. **Adopt Regulated**
   - Require acceptance for all decisions
   - Add cryptographic receipts
   - Enable AI attribution
   - Block on drift detection

## Custom Presets

Teams MAY define custom presets by:

1. Choosing a base preset (`light`, `standard`, or `regulated`)
2. Overriding specific rules
3. Documenting the custom preset in `constitution.md`

**Example:**

```yaml
preset: standard-plus
extends: standard
blocking:
  mode: selective
specs:
  acceptanceCriteriaRequired: true  # stricter than standard
decisions:
  statusByRisk:
    medium: accepted  # stricter than standard
```

## Validation Implementation

### Validator Requirements

A compliant validator MUST:
1. Read `provenance/config.json` and `provenance/policies/enforcement.yml`
2. Apply rules based on preset
3. Check path and label triggers
4. Validate artifact formats and states
5. Report results as warnings or errors
6. Return exit code 0 (pass) or non-zero (fail)

### Validator Outputs

Validators SHOULD produce:
- **Console output** for CI/CD logs
- **PR comments** with validation results
- **Check run annotations** (GitHub, GitLab)
- **Structured JSON** for tooling integration

---

**Next:** [Repository Layout](repo-layout.md) - Required directory structure  
**See Also:** [Versioning](versioning.md) - Lifecycle state management

