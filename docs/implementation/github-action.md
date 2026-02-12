# GitHub Action Implementation

This page documents the GitHub Action implementation for ProvenanceCode enforcement.

## Overview

The ProvenanceCode GitHub Action validates Decision Evidence Objects (DEOs) at pull request time, ensuring that code changes are properly documented and approved before merging.

## Installation

### Quick Start

Add the following workflow file to your repository at `.github/workflows/provenancecode.yml`:

```yaml
name: ProvenanceCode Validation

on:
  pull_request:
    types: [opened, synchronize, reopened]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      
      - name: Validate ProvenanceCode
        uses: provenancecode/action@v1
        with:
          enforcement-preset: standard
          token: ${{ secrets.GITHUB_TOKEN }}
```

## Configuration

### Enforcement Presets

Choose the enforcement level that matches your team's needs:

#### Light
- Never blocks merges
- Warns on missing decisions
- Ideal for: Teams starting with ProvenanceCode

#### Standard (Recommended)
- Selective blocking for high-risk areas/labels
- Warns on missing decisions
- Blocks when required by labels
- Ideal for: Most development teams

#### Regulated
- Blocks merges when required decisions/specs are missing or unapproved
- Strong validation requirements
- Ideal for: Regulated industries, critical infrastructure

### Advanced Options

```yaml
- name: Validate ProvenanceCode
  uses: provenancecode/action@v1
  with:
    enforcement-preset: standard
    token: ${{ secrets.GITHUB_TOKEN }}
    # Optional: Custom DEO directory
    deo-path: .provenancecode/decisions
    # Optional: Fail on warnings
    fail-on-warnings: false
    # Optional: Required labels for blocking
    block-labels: |
      breaking-change
      architecture
      security
```

## Decision Evidence Objects (DEOs)

DEOs must be stored in your repository (default location: `.provenancecode/decisions/`).

### Required Fields

```yaml
id: DECISION-001
title: "Brief decision description"
status: approved
date: 2026-02-12
author: developer-name
approver: reviewer-name
ai-assisted: true
decision: |
  Clear description of what was decided
rationale: |
  Why this decision was made
alternatives: |
  What other options were considered
risks: |
  Known risks and mitigation strategies
```

## Integration with Pull Requests

The action will:
1. Check for DEO files linked to the PR
2. Validate DEO structure and required fields
3. Verify approval status
4. Post validation results as PR comments
5. Set check status (pass/fail/warning)

## Status Checks

The action provides clear feedback through GitHub's status checks:

- ✅ **Pass**: All required DEOs present and approved
- ⚠️ **Warning**: Missing DEOs (light preset) or optional validations
- ❌ **Fail**: Required DEOs missing or unapproved (standard/regulated presets)

## Best Practices

1. **Create DEOs Early**: Write decision records as you design, not just before merge
2. **Link in PR Description**: Reference DEO IDs in pull request descriptions
3. **Use Labels**: Apply appropriate labels (`breaking-change`, `architecture`, etc.)
4. **Review DEOs**: Treat DEO approval as seriously as code review
5. **Iterate on Decisions**: Update DEOs as decisions evolve during implementation

## Troubleshooting

### Action Failing: "No DEO found"

Ensure your DEO file:
- Is in the correct directory (`.provenancecode/decisions/` by default)
- Has valid YAML front matter
- Is referenced in your PR description

### Action Failing: "DEO not approved"

Check that:
- The `status` field is set to `approved`
- The `approver` field is filled in
- The approver has proper permissions

### Action Not Running

Verify:
- The workflow file is in `.github/workflows/`
- The workflow is enabled in repository settings
- You have the correct branch protections configured

## Example DEO

```yaml
---
id: DECISION-001
title: "Adopt ProvenanceCode Standard"
status: approved
date: 2026-02-12
author: kieran-desmond
approver: tech-lead
ai-assisted: true
decision: |
  Adopt ProvenanceCode as our decision-driven development standard
  for all projects involving AI-assisted development.
rationale: |
  Need to improve traceability and accountability as we increase
  AI tooling usage. ProvenanceCode provides structured approach
  without adding significant overhead.
alternatives: |
  1. Continue with informal documentation
  2. Build custom decision tracking system
  3. Use ADRs without enforcement
risks: |
  Initial learning curve for team. Mitigated by starting with
  'light' preset and gradually moving to 'standard'.
---

# Decision Details

Additional context and implementation notes can go here...
```

## Support

For issues and feature requests:
- GitHub Issues: [github.com/ProvenanceCode/action](https://github.com/ProvenanceCode/action)
- Documentation: [provenancecode.github.io](https://provenancecode.github.io)

---

*ProvenanceCode is developed and maintained by EmbankAI.*

