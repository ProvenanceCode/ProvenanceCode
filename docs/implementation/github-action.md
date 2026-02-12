# GitHub Actions Implementation

**Version:** 1.0.0  
**Status:** Draft  
**Part of:** ProvenanceCode Open Standard  
**Implementation Type:** Open Source / Self-Hosted

## Abstract

This guide shows how to implement ProvenanceCode validation using **GitHub Actions** - a free, open-source approach. This is the **recommended starting point** for most teams adopting ProvenanceCode.

### Why Start Here?

- ✅ **100% Free** for public and private repos
- ✅ **No external dependencies** - runs entirely in GitHub
- ✅ **Simple setup** - add one workflow file
- ✅ **Full standard compliance** - validates all ProvenanceCode requirements
- ✅ **No vendor lock-in** - you control everything

### When to Consider Alternatives

If you need advanced features like auto-draft creation, cross-repo validation, or a web UI, see the [GitHub App implementation](github-app.md) or build your own custom validator.

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Basic Workflow Setup](#basic-workflow-setup)
4. [Workflow Configuration](#workflow-configuration)
5. [Validation Triggers](#validation-triggers)
6. [Environment Variables](#environment-variables)
7. [PR Comment Integration](#pr-comment-integration)
8. [Status Checks](#status-checks)
9. [Advanced Patterns](#advanced-patterns)
10. [Troubleshooting](#troubleshooting)

## Overview

GitHub Actions provides a native way to validate ProvenanceCode compliance on every pull request. The validator runs in CI/CD, checks for required decisions, specs, and risks, and reports results directly in the PR.

### Benefits

- **Automated Validation** - Every PR is checked automatically
- **Clear Feedback** - Results appear as PR comments and status checks
- **Branch Protection** - Block merges that don't meet requirements
- **No External Services** - Runs entirely within GitHub
- **Free for Public Repos** - Included in GitHub's free tier

## Prerequisites

### Required

1. **GitHub Repository** with Actions enabled
2. **ProvenanceCode Structure** installed (see [Getting Started](../guides/01-Getting-Started.md))
3. **Configuration Files:**
   - `provenance/config.json`
   - `provenance/policies/enforcement.yml`

### Optional

1. **Branch Protection** rules for enforcement
2. **CODEOWNERS** file for decision approval
3. **PR Template** for decision references

## Basic Workflow Setup

### Step 1: Create Workflow File

Create `.github/workflows/provenance-check.yml`:

```yaml
name: ProvenanceCode Validation

on:
  pull_request:
    types: [opened, synchronize, reopened]
    branches:
      - main
      - develop

jobs:
  validate:
    name: Validate Decision Evidence
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0  # Full history for diff analysis
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
      
      - name: Install ProvenanceCode Validator
        run: npm install -g @provenancecode/validator
      
      - name: Validate ProvenanceCode
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: provenancecode-validate
```

### Step 2: Commit and Push

```bash
git add .github/workflows/provenance-check.yml
git commit -m "Add ProvenanceCode validation workflow"
git push origin main
```

### Step 3: Test

Create a test PR that modifies a file in a path requiring a decision (e.g., `src/`) and verify the workflow runs.

## Workflow Configuration

### Complete Workflow Example

```yaml
name: ProvenanceCode Validation

on:
  pull_request:
    types: [opened, synchronize, reopened, edited]
    branches:
      - main
      - develop
      - 'release/**'

permissions:
  contents: read
  pull-requests: write  # For posting comments
  checks: write         # For status checks

jobs:
  validate:
    name: Validate Decision Evidence
    runs-on: ubuntu-latest
    timeout-minutes: 10
    
    steps:
      - name: Checkout PR head
        uses: actions/checkout@v4
        with:
          ref: ${{ github.event.pull_request.head.sha }}
          fetch-depth: 0
      
      - name: Checkout base branch
        run: |
          git fetch origin ${{ github.event.pull_request.base.ref }}
          git checkout ${{ github.event.pull_request.base.sha }}
          git checkout -
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install validator
        run: npm install -g @provenancecode/validator
      
      - name: Run validation
        id: validate
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          PROVENANCE_PR_NUMBER: ${{ github.event.pull_request.number }}
          PROVENANCE_PR_TITLE: ${{ github.event.pull_request.title }}
          PROVENANCE_PR_BODY: ${{ github.event.pull_request.body }}
          PROVENANCE_PR_URL: ${{ github.event.pull_request.html_url }}
          PROVENANCE_BASE_REF: ${{ github.event.pull_request.base.sha }}
          PROVENANCE_HEAD_REF: ${{ github.event.pull_request.head.sha }}
          PROVENANCE_LABELS: ${{ join(github.event.pull_request.labels.*.name, ',') }}
        run: |
          provenancecode-validate \
            --format json \
            --output validation-results.json
      
      - name: Post PR comment
        if: always()
        uses: actions/github-script@v7
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          script: |
            const fs = require('fs');
            const results = JSON.parse(fs.readFileSync('validation-results.json', 'utf8'));
            
            let comment = '## ProvenanceCode Validation Results\n\n';
            
            if (results.valid) {
              comment += '✅ **All checks passed**\n\n';
            } else {
              comment += '❌ **Validation failed**\n\n';
            }
            
            comment += '### Summary\n\n';
            comment += `- **Decisions:** ${results.decisions.found}/${results.decisions.required}\n`;
            comment += `- **Specs:** ${results.specs.found}/${results.specs.required}\n`;
            comment += `- **Risks:** ${results.risks.found}/${results.risks.required}\n\n`;
            
            if (results.errors.length > 0) {
              comment += '### Errors\n\n';
              results.errors.forEach(err => {
                comment += `- ❌ ${err}\n`;
              });
              comment += '\n';
            }
            
            if (results.warnings.length > 0) {
              comment += '### Warnings\n\n';
              results.warnings.forEach(warn => {
                comment += `- ⚠️ ${warn}\n`;
              });
              comment += '\n';
            }
            
            comment += '---\n';
            comment += `[Documentation](https://provenancecode.org/docs) | [Guide](https://provenancecode.org/guides/getting-started)`;
            
            // Find existing comment
            const { data: comments } = await github.rest.issues.listComments({
              owner: context.repo.owner,
              repo: context.repo.repo,
              issue_number: context.issue.number,
            });
            
            const botComment = comments.find(c => 
              c.user.type === 'Bot' && 
              c.body.includes('ProvenanceCode Validation Results')
            );
            
            if (botComment) {
              // Update existing comment
              await github.rest.issues.updateComment({
                owner: context.repo.owner,
                repo: context.repo.repo,
                comment_id: botComment.id,
                body: comment
              });
            } else {
              // Create new comment
              await github.rest.issues.createComment({
                owner: context.repo.owner,
                repo: context.repo.repo,
                issue_number: context.issue.number,
                body: comment
              });
            }
      
      - name: Upload validation results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: provenance-validation-results
          path: validation-results.json
          retention-days: 30
      
      - name: Set status
        if: failure()
        run: exit 1
```

## Validation Triggers

### When to Run Validation

#### Pull Request Events

```yaml
on:
  pull_request:
    types:
      - opened        # New PR created
      - synchronize   # New commits pushed
      - reopened      # PR reopened
      - edited        # PR title/body edited (important for decision IDs)
```

#### Branch Filters

```yaml
on:
  pull_request:
    branches:
      - main
      - develop
      - 'release/**'
    # Optionally exclude certain branches
    branches-ignore:
      - 'docs/**'
      - 'dependabot/**'
```

#### Path Filters

Skip validation for non-code changes:

```yaml
on:
  pull_request:
    paths-ignore:
      - '**.md'
      - 'docs/**'
      - '.github/**'
      - 'LICENSE'
```

**Note:** Path filters are optional. ProvenanceCode's own config handles docs-only detection.

## Environment Variables

### Required Variables

| Variable | Source | Purpose |
|----------|--------|---------|
| `GITHUB_TOKEN` | `${{ secrets.GITHUB_TOKEN }}` | API access for PR data |

### Optional Variables

| Variable | Source | Purpose |
|----------|--------|---------|
| `PROVENANCE_PR_NUMBER` | `${{ github.event.pull_request.number }}` | PR number for validation |
| `PROVENANCE_PR_TITLE` | `${{ github.event.pull_request.title }}` | Extract decision IDs from title |
| `PROVENANCE_PR_BODY` | `${{ github.event.pull_request.body }}` | Extract decision IDs from description |
| `PROVENANCE_PR_URL` | `${{ github.event.pull_request.html_url }}` | Validate PR link in decision |
| `PROVENANCE_BASE_REF` | `${{ github.event.pull_request.base.sha }}` | Base commit for diff |
| `PROVENANCE_HEAD_REF` | `${{ github.event.pull_request.head.sha }}` | Head commit for diff |
| `PROVENANCE_LABELS` | `${{ join(github.event.pull_request.labels.*.name, ',') }}` | PR labels for triggers |

### Configuration Override

Override config paths if needed:

```yaml
env:
  PROVENANCE_CONFIG_PATH: provenance/config.json
  PROVENANCE_ENFORCEMENT_PATH: provenance/policies/enforcement.yml
```

## PR Comment Integration

### Basic Comment

Simple validation result:

```yaml
- name: Post result comment
  uses: actions/github-script@v7
  with:
    script: |
      const comment = `
      ## ✅ ProvenanceCode Validation Passed
      
      All required decision evidence is present.
      `;
      
      github.rest.issues.createComment({
        issue_number: context.issue.number,
        owner: context.repo.owner,
        repo: context.repo.repo,
        body: comment
      });
```

### Detailed Comment with Results

```yaml
- name: Post detailed results
  uses: actions/github-script@v7
  with:
    script: |
      const fs = require('fs');
      const results = JSON.parse(fs.readFileSync('validation-results.json'));
      
      let comment = '## ProvenanceCode Validation\n\n';
      
      // Decision section
      comment += '### Decisions\n';
      if (results.decisions.found > 0) {
        results.decisions.list.forEach(dec => {
          comment += `- ✅ [${dec.id}](${dec.path}) - ${dec.title}\n`;
        });
      } else if (results.decisions.required > 0) {
        comment += '- ❌ No decisions found (required)\n';
      } else {
        comment += '- ℹ️ No decisions required\n';
      }
      
      // Specs section
      comment += '\n### Specifications\n';
      if (results.specs.found > 0) {
        results.specs.list.forEach(spec => {
          comment += `- ✅ [${spec.id}](${spec.path}) - ${spec.title}\n`;
        });
      } else {
        comment += '- ℹ️ No specs found\n';
      }
      
      // Errors and warnings
      if (results.errors.length > 0) {
        comment += '\n### ❌ Errors\n';
        results.errors.forEach(err => {
          comment += `- ${err}\n`;
        });
      }
      
      if (results.warnings.length > 0) {
        comment += '\n### ⚠️ Warnings\n';
        results.warnings.forEach(warn => {
          comment += `- ${warn}\n`;
        });
      }
      
      github.rest.issues.createComment({
        issue_number: context.issue.number,
        owner: context.repo.owner,
        repo: context.repo.repo,
        body: comment
      });
```

## Status Checks

### Enable Status Check

Add to your workflow:

```yaml
- name: Report status
  if: always()
  uses: actions/github-script@v7
  with:
    script: |
      const fs = require('fs');
      const results = JSON.parse(fs.readFileSync('validation-results.json'));
      
      await github.rest.repos.createCommitStatus({
        owner: context.repo.owner,
        repo: context.repo.repo,
        sha: context.payload.pull_request.head.sha,
        state: results.valid ? 'success' : 'failure',
        context: 'ProvenanceCode Validation',
        description: results.valid ? 'All checks passed' : 'Validation failed',
        target_url: `${context.serverUrl}/${context.repo.owner}/${context.repo.repo}/actions/runs/${context.runId}`
      });
```

### Branch Protection

Configure branch protection to require the status check:

1. Go to **Settings** → **Branches**
2. Add rule for `main` branch
3. Enable **Require status checks to pass before merging**
4. Select **ProvenanceCode Validation**
5. Save changes

Now PRs cannot merge until validation passes.

## Advanced Patterns

### Pattern 1: Forked PR Support

Use `pull_request_target` for forks (careful - security implications):

```yaml
name: ProvenanceCode Validation (Forks)

on:
  pull_request_target:
    types: [opened, synchronize]

jobs:
  validate:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout base (safe)
        uses: actions/checkout@v4
        with:
          ref: ${{ github.event.pull_request.base.ref }}
      
      - name: Fetch PR files via API (no code execution)
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: |
          # Fetch changed files via API
          # Validate without checking out untrusted code
          provenancecode-validate --remote-only
```

### Pattern 2: Decision Draft Creation

Automatically create decision drafts for PRs:

```yaml
- name: Create decision draft if missing
  if: failure()
  uses: actions/github-script@v7
  with:
    script: |
      const fs = require('fs');
      const path = require('path');
      
      // Find next decision ID
      const decisions = fs.readdirSync('provenance/decisions');
      const maxId = Math.max(...decisions.map(d => 
        parseInt(d.replace('DEC-', ''))
      ));
      const nextId = `DEC-${String(maxId + 1).padStart(6, '0')}`;
      
      // Create draft
      const draft = {
        schema: 'provenancecode.decision.v1',
        id: nextId,
        title: context.payload.pull_request.title,
        version: 1,
        lifecycle: { state: 'draft' },
        timestamps: { created_at: new Date().toISOString() },
        actors: { author: context.payload.pull_request.user.login },
        outcome: 'TODO: Document what was decided',
        rationale: 'TODO: Explain why',
        risk: { level: 'low' }
      };
      
      const draftContent = `
      # ${nextId}: ${draft.title}
      
      **Status:** Draft (auto-created)
      **Author:** ${draft.actors.author}
      **PR:** #${context.issue.number}
      
      ## Context
      
      TODO: Why is this change needed?
      
      ## Decision
      
      TODO: What did we decide?
      
      ## Rationale
      
      TODO: Why this approach?
      `;
      
      // Post comment with draft
      await github.rest.issues.createComment({
        issue_number: context.issue.number,
        owner: context.repo.owner,
        repo: context.repo.repo,
        body: `
        ## 📝 Decision Draft Created
        
        A decision is required for this PR. Here's a draft to get you started:
        
        **Decision ID:** ${nextId}
        
        \`\`\`json
        ${JSON.stringify(draft, null, 2)}
        \`\`\`
        
        ### Next Steps
        
        1. Copy the draft to \`provenance/drafts/${nextId}-draft.md\`
        2. Fill in the TODO sections
        3. Commit and push
        4. Update PR title to include ${nextId}
        `
      });
```

### Pattern 3: Multiple Environments

Different validation for different branches:

```yaml
jobs:
  validate-dev:
    if: github.event.pull_request.base.ref == 'develop'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: provenancecode-validate --preset light
  
  validate-prod:
    if: github.event.pull_request.base.ref == 'main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: provenancecode-validate --preset standard
```

### Pattern 4: Parallel Validation

Run validation in parallel with tests:

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm test
  
  provenance:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: provenancecode-validate
  
  required:
    needs: [test, provenance]
    runs-on: ubuntu-latest
    steps:
      - run: echo "All checks passed"
```

## Troubleshooting

### Issue: Workflow doesn't run

**Check:**
- Workflow file is in `.github/workflows/`
- File has `.yml` or `.yaml` extension
- Actions are enabled in repository settings
- Branch is included in `on.pull_request.branches`

### Issue: Permission denied errors

**Solution:**
Add permissions to workflow:

```yaml
permissions:
  contents: read
  pull-requests: write
  checks: write
```

### Issue: Can't find decision files

**Check:**
- Decision folders match ID format: `DEC-XXXXXX`
- `decision.json` file exists in each folder
- Checkout includes `fetch-depth: 0` for full history
- Base branch is checked out for diff comparison

### Issue: Validation always passes/fails

**Debug:**
```yaml
- name: Debug validation
  run: |
    echo "PR Number: ${{ github.event.pull_request.number }}"
    echo "Base: ${{ github.event.pull_request.base.ref }}"
    echo "Head: ${{ github.event.pull_request.head.ref }}"
    echo "Labels: ${{ join(github.event.pull_request.labels.*.name, ',') }}"
    echo "Changed files:"
    git diff --name-only ${{ github.event.pull_request.base.sha }} ${{ github.event.pull_request.head.sha }}
    echo "Config:"
    cat provenance/config.json
```

### Issue: Comment not posted

**Check:**
- `pull-requests: write` permission is set
- PR is not from a fork (use `pull_request_target` for forks)
- GitHub token is valid
- No rate limiting issues

## Examples

See complete working examples:
- [Basic validation workflow](../examples/github-action-basic.yml)
- [Advanced validation with comments](../examples/github-action-advanced.yml)
- [Forked PR support](../examples/github-action-forks.yml)

## Next Steps

1. **Create workflow file** in `.github/workflows/`
2. **Test with a PR** that modifies enforced paths
3. **Add branch protection** to require passing checks
4. **Customize comments** to match your team's needs
5. **Set up notifications** for validation failures

## Related Documentation

- [GitHub App Implementation](github-app.md) - Alternative implementation using GitHub Apps
- [Enforcement Policies](../standard/enforcement.md) - Configure validation rules
- [Getting Started](../guides/01-Getting-Started.md) - Initial setup

---

**See Also:**
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [ProvenanceCode Validator](https://www.npmjs.com/package/@provenancecode/validator)

