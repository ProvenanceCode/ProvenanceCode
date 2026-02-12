# Versioning and Lifecycle Specification

**Version:** 1.0.0  
**Status:** Draft  
**Part of:** ProvenanceCode Open Standard

## Abstract

This document defines how ProvenanceCode artifacts progress through lifecycle states, how versions are managed, and how decisions evolve or become superseded over time.

## Table of Contents

1. [Overview](#overview)
2. [Lifecycle States](#lifecycle-states)
3. [State Transitions](#state-transitions)
4. [Versioning Rules](#versioning-rules)
5. [Supersession](#supersession)
6. [Expiration](#expiration)
7. [Artifact-Specific Lifecycles](#artifact-specific-lifecycles)
8. [Best Practices](#best-practices)
9. [Examples](#examples)

## Overview

ProvenanceCode artifacts (decisions, specs, risks, mistakes) follow defined lifecycles that track their progression from initial draft to final state. This ensures:

- **Clarity** - Everyone knows the current status
- **Auditability** - State changes are tracked
- **Immutability** - Accepted artifacts are never edited, only superseded
- **Traceability** - History is preserved through supersession chains

## Lifecycle States

### Decision States

| State | Description | Can Edit? | Terminal? |
|-------|-------------|-----------|-----------|
| `draft` | Initial creation, work in progress | ✅ Yes | ❌ No |
| `proposed` | Ready for review, awaiting approval | ⚠️ Minor edits | ❌ No |
| `accepted` | Approved and active | ❌ No | ❌ No |
| `rejected` | Not approved, will not implement | ❌ No | ✅ Yes |
| `superseded` | Replaced by newer decision | ❌ No | ✅ Yes |

### Specification States

| State | Description | Can Edit? | Terminal? |
|-------|-------------|-----------|-----------|
| `draft` | Initial requirements, under discussion | ✅ Yes | ❌ No |
| `review` | Ready for stakeholder review | ⚠️ Minor edits | ❌ No |
| `approved` | Accepted, ready for implementation | ❌ No | ❌ No |
| `implemented` | Completed and deployed | ❌ No | ✅ Yes |
| `rejected` | Not moving forward | ❌ No | ✅ Yes |
| `superseded` | Replaced by newer spec | ❌ No | ✅ Yes |

### Risk Acceptance States

| State | Description | Can Edit? | Terminal? |
|-------|-------------|-----------|-----------|
| `active` | Risk is currently accepted | ⚠️ Update mitigations | ❌ No |
| `expired` | Acceptance period ended | ❌ No | ⚠️ Review needed |
| `mitigated` | Risk has been eliminated | ❌ No | ✅ Yes |
| `rejected` | Risk not accepted | ❌ No | ✅ Yes |

### Mistake Record States

| State | Description | Can Edit? | Terminal? |
|-------|-------------|-----------|-----------|
| `open` | Identified, not yet fixed | ⚠️ Add details | ❌ No |
| `mitigated` | Prevention rules in place | ⚠️ Add learnings | ❌ No |
| `closed` | Fully resolved, guardrails active | ❌ No | ✅ Yes |

## State Transitions

### Decision Lifecycle Flow

```
   draft
     ↓
  proposed
   ↙   ↘
accepted  rejected
   ↓         (terminal)
superseded
 (terminal)
```

### Valid Transitions

| From | To | Condition |
|------|---|-----------|
| `draft` | `proposed` | Ready for review |
| `draft` | `rejected` | Decided not to proceed |
| `proposed` | `accepted` | Approval granted |
| `proposed` | `rejected` | Approval denied |
| `proposed` | `draft` | Needs more work |
| `accepted` | `superseded` | New decision replaces this |

### Invalid Transitions

❌ **Cannot** transition:
- From `accepted` back to `draft` or `proposed` (must supersede instead)
- From `rejected` to any other state (terminal)
- From `superseded` to any other state (terminal)

## Versioning Rules

### Version Numbers

Each artifact has a `version` field (integer starting at 1):

```json
{
  "id": "DEC-000042",
  "version": 1
}
```

### When to Increment Version

Increment the version number when making **substantive changes** to:
- Outcome or decision
- Risk level
- Acceptance criteria (specs)
- Mitigations (risks)

Do NOT increment for:
- Typo fixes
- Formatting changes
- Adding links or tags
- Updating timestamps

### Version History

Store version history in `timestamps.updated_at`:

```json
{
  "version": 3,
  "timestamps": {
    "created_at": "2026-02-01T10:00:00Z",
    "accepted_at": "2026-02-02T14:30:00Z",
    "updated_at": "2026-02-10T09:15:00Z"
  }
}
```

For detailed history, optionally create:
```
provenance/decisions/DEC-000042/
├── decision.json           (current version)
├── decision.v1.json        (previous version)
├── decision.v2.json        (previous version)
└── CHANGELOG.md            (version history)
```

## Supersession

### Purpose

When an accepted decision needs substantial changes, **supersede** it instead of editing:

1. Create a new decision with new ID
2. Mark old decision as `superseded`
3. Link old ↔ new with `lifecycle.supersedes` and `lifecycle.superseded_by`

### Supersession Fields

**Old Decision (DEC-000010):**
```json
{
  "id": "DEC-000010",
  "version": 1,
  "lifecycle": {
    "state": "superseded",
    "superseded_by": "DEC-000042"
  }
}
```

**New Decision (DEC-000042):**
```json
{
  "id": "DEC-000042",
  "version": 1,
  "lifecycle": {
    "state": "accepted",
    "supersedes": "DEC-000010"
  }
}
```

### Supersession Chains

Decisions can form chains:

```
DEC-000010 (superseded)
    ↓
DEC-000042 (superseded)
    ↓
DEC-000081 (accepted) — current
```

**DEC-000081:**
```json
{
  "lifecycle": {
    "state": "accepted",
    "supersedes": "DEC-000042"
  },
  "supersession_chain": ["DEC-000010", "DEC-000042"]
}
```

### When to Supersede vs. Update

| Scenario | Action |
|----------|--------|
| Typo in rationale | ✏️ Edit and increment version |
| Add missing link | ✏️ Edit without version increment |
| Change outcome | 🔄 Supersede with new decision |
| Change risk level | 🔄 Supersede with new decision |
| Reverse decision | 🔄 Supersede with new decision |

**Rule of thumb:** If it changes *what* was decided or *why*, supersede. If it's just clarification, update.

## Expiration

### Purpose

Some decisions and risk acceptances have time limits:
- Temporary workarounds
- Trial periods
- Time-boxed experiments
- Compliance waivers

### Expiration Field

```json
{
  "timestamps": {
    "created_at": "2026-02-01T00:00:00Z",
    "accepted_at": "2026-02-01T00:00:00Z",
    "expires_at": "2026-08-01T00:00:00Z"
  }
}
```

### Handling Expiration

When `expires_at` is in the past:

1. **Validator behavior:**
   - Light preset: warn
   - Standard preset: warn
   - Regulated preset: block

2. **Team action:**
   - Review the decision/risk
   - Either:
     - Extend expiration (update `expires_at`)
     - Make permanent (remove `expires_at`)
     - Supersede with new decision
     - Mark as `expired` (for risks)

### Expiration Notifications

Optional: Create automation to notify teams of upcoming expirations:

```bash
# Example: Find decisions expiring in next 30 days
jq -r 'select(.timestamps.expires_at and 
  (.timestamps.expires_at | fromdateiso8601) < (now + 30*24*60*60)) | 
  .id' provenance/decisions/*/decision.json
```

## Artifact-Specific Lifecycles

### Decision Lifecycle Details

**Draft State:**
- Use for exploring options
- AI assistants create drafts automatically
- Can be freely edited
- Not enforced by validation

**Proposed State:**
- Submitted for review
- Minor edits allowed (typos, clarifications)
- Substantive changes → back to draft
- Reviewers provide feedback

**Accepted State:**
- Approval granted
- No longer editable
- Active and enforced
- Can only be superseded

**Best Practices:**
- Keep decisions in draft until implementation starts
- Move to proposed when PR is ready
- Accept only after human approval
- Supersede if decision changes after acceptance

### Specification Lifecycle Details

**Draft State:**
- Requirements gathering
- Stakeholder input
- Can change freely

**Review State:**
- Ready for approval
- Stakeholders confirm requirements
- Minor adjustments allowed

**Approved State:**
- Ready for implementation
- No changes without new spec
- Linked to implementing decision

**Implemented State:**
- Code deployed to production
- Terminal state
- Serves as historical record

**Best Practices:**
- Create spec before starting work
- Move to review when complete
- Approve before significant implementation
- Mark implemented when deployed

### Risk Acceptance Lifecycle Details

**Active State:**
- Risk is currently accepted
- Mitigations are in place
- Monitor regularly
- Update mitigations as needed

**Expired State:**
- Acceptance period ended
- Requires review
- Either renew or mitigate

**Mitigated State:**
- Risk eliminated
- Successful outcome
- Document lessons learned

**Best Practices:**
- Set expiration dates for all non-permanent risks
- Review active risks monthly
- Document mitigation strategies
- Link to implementing decisions

### Mistake Record Lifecycle Details

**Open State:**
- Incident documented
- Root cause identified
- Prevention rule drafted

**Mitigated State:**
- Guardrails in place
- Enforcement active
- Monitoring impact

**Closed State:**
- Fully resolved
- No recurrence
- Lessons captured

**Best Practices:**
- Create mistake records for all significant incidents
- Define clear prevention rules
- Link to enforcement policy
- Review quarterly for effectiveness

## Best Practices

### 1. Start in Draft

Always create new artifacts in draft state:

```json
{
  "lifecycle": {
    "state": "draft"
  },
  "timestamps": {
    "created_at": "2026-02-12T10:00:00Z"
  }
}
```

### 2. Update Timestamps

Set timestamps when changing states:

```json
{
  "lifecycle": {
    "state": "accepted"
  },
  "timestamps": {
    "created_at": "2026-02-12T10:00:00Z",
    "accepted_at": "2026-02-14T15:30:00Z"
  }
}
```

### 3. Record Actors

Track who made state transitions:

```json
{
  "lifecycle": {
    "state": "accepted"
  },
  "actors": {
    "author": "user:alice",
    "approver": "user:bob"
  }
}
```

### 4. Use Supersession Chains

When superseding, maintain full chain:

```json
{
  "lifecycle": {
    "supersedes": "DEC-000042"
  },
  "supersession_chain": ["DEC-000010", "DEC-000042"],
  "rationale": "Updated authentication approach based on new security requirements. Previous decisions (DEC-000010, DEC-000042) are superseded."
}
```

### 5. Document State Changes

In `decision.md`, document major state changes:

```markdown
## Version History

### Version 2 (2026-02-14)
- **State Change:** draft → accepted
- **Reason:** Team approved GraphQL migration approach
- **Approver:** @bob

### Version 1 (2026-02-12)
- **Created:** Initial draft
- **Author:** @alice
```

### 6. Handle Expiration Proactively

For expiring decisions:

```json
{
  "timestamps": {
    "expires_at": "2026-06-01T00:00:00Z"
  },
  "expiration_note": "Temporary workaround for payment provider migration. Review before June 1, 2026."
}
```

## Examples

### Example 1: Decision Evolution

**Initial Draft:**
```json
{
  "id": "DEC-000042",
  "version": 1,
  "lifecycle": {
    "state": "draft"
  },
  "timestamps": {
    "created_at": "2026-02-10T10:00:00Z"
  }
}
```

**After Review:**
```json
{
  "id": "DEC-000042",
  "version": 2,
  "lifecycle": {
    "state": "proposed"
  },
  "timestamps": {
    "created_at": "2026-02-10T10:00:00Z",
    "updated_at": "2026-02-12T14:30:00Z"
  }
}
```

**After Acceptance:**
```json
{
  "id": "DEC-000042",
  "version": 2,
  "lifecycle": {
    "state": "accepted"
  },
  "timestamps": {
    "created_at": "2026-02-10T10:00:00Z",
    "accepted_at": "2026-02-13T09:15:00Z",
    "updated_at": "2026-02-12T14:30:00Z"
  },
  "actors": {
    "author": "user:alice",
    "approver": "user:bob"
  }
}
```

### Example 2: Supersession

**Old Decision Marked as Superseded:**
```json
{
  "id": "DEC-000010",
  "title": "Use JWT for authentication",
  "version": 1,
  "lifecycle": {
    "state": "superseded",
    "superseded_by": "DEC-000042"
  },
  "timestamps": {
    "created_at": "2025-06-01T10:00:00Z",
    "accepted_at": "2025-06-05T14:00:00Z",
    "superseded_at": "2026-02-13T09:15:00Z"
  }
}
```

**New Decision:**
```json
{
  "id": "DEC-000042",
  "title": "Migrate from JWT to OAuth2 with session tokens",
  "version": 1,
  "lifecycle": {
    "state": "accepted",
    "supersedes": "DEC-000010"
  },
  "timestamps": {
    "created_at": "2026-02-10T10:00:00Z",
    "accepted_at": "2026-02-13T09:15:00Z"
  },
  "rationale": "OAuth2 provides better security and refresh token support. Supersedes DEC-000010 which used simpler JWT approach."
}
```

### Example 3: Risk Expiration

**Active Risk with Expiration:**
```json
{
  "ra_id": "RA-000015",
  "status": "active",
  "timestamps": {
    "created_at": "2026-02-01T00:00:00Z",
    "expires_at": "2026-05-01T00:00:00Z"
  },
  "risk_statement": "Temporary use of deprecated API until migration complete",
  "acceptance": {
    "accepted_by": "team-lead",
    "accepted_at": "2026-02-01T00:00:00Z",
    "expires_at": "2026-05-01T00:00:00Z",
    "reason": "Migration in progress, target completion April 2026"
  }
}
```

**After Expiration (needs review):**
```json
{
  "ra_id": "RA-000015",
  "status": "expired",
  "timestamps": {
    "created_at": "2026-02-01T00:00:00Z",
    "expires_at": "2026-05-01T00:00:00Z",
    "expired_at": "2026-05-01T00:00:00Z"
  },
  "review_note": "Migration delayed, need to extend acceptance or expedite migration"
}
```

### Example 4: Mistake Record Lifecycle

**Open Mistake:**
```json
{
  "mr_id": "MR-000003",
  "status": "open",
  "timestamps": {
    "created_at": "2026-02-12T10:00:00Z"
  },
  "root_cause": {
    "summary": "Missing input validation allowed SQL injection"
  },
  "prevent_rule": {
    "rule_id": "PRV-MR-000003-validate-all-inputs",
    "statement": "All user inputs must be validated and sanitized before database queries"
  }
}
```

**After Fix:**
```json
{
  "mr_id": "MR-000003",
  "status": "mitigated",
  "timestamps": {
    "created_at": "2026-02-12T10:00:00Z",
    "mitigated_at": "2026-02-14T15:00:00Z"
  },
  "fix": {
    "pr": "https://github.com/org/repo/pull/456",
    "commit": "abc123",
    "summary": "Added input validation library and updated all query builders"
  },
  "enforcement": [
    {
      "kind": "linter",
      "ref": "eslint-plugin-security",
      "must_exist": true
    }
  ]
}
```

**Fully Resolved:**
```json
{
  "mr_id": "MR-000003",
  "status": "closed",
  "timestamps": {
    "created_at": "2026-02-12T10:00:00Z",
    "mitigated_at": "2026-02-14T15:00:00Z",
    "closed_at": "2026-03-01T10:00:00Z"
  },
  "closure_note": "Validation in place for 2 weeks, no recurrence, enforcement automated"
}
```

## Validation Requirements

Validators SHOULD check:

1. **Valid States:**
   - `lifecycle.state` is one of the defined states for the artifact type

2. **Timestamp Consistency:**
   - `created_at` ≤ `accepted_at` ≤ `updated_at`
   - `expires_at` (if present) > `accepted_at`

3. **Supersession Integrity:**
   - If `supersedes` is present, referenced artifact exists
   - If `superseded_by` is present, that artifact references this one

4. **Terminal States:**
   - Artifacts in terminal states cannot transition further
   - Terminal artifacts should not be edited

5. **Expiration Warnings:**
   - Warn or block if `expires_at` is past and state is still `active`/`accepted`

---

**Next:** [Implementation Guides](../guides/) - How to use ProvenanceCode  
**See Also:** [Decision Evidence Objects (DEO)](deo.md) - Decision format details

