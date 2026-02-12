# Building ProvenanceCode Implementations

**Want to build a ProvenanceCode validator?** This guide helps you create compliant implementations.

## Quick Start

### Minimum Requirements

A compliant ProvenanceCode implementation MUST:

1. **Validate JSON structure** against official schemas
2. **Check decision ID format** (`DEC-XXXXXX`)
3. **Verify required fields** (see spec)
4. **Support enforcement presets** (light, standard, regulated)
5. **Provide clear feedback** to users

### Recommended Features

Your implementation SHOULD:

1. **Post-validation results** as comments (if on PR platforms)
2. **Create status checks** (pass/fail indicators)
3. **Link to decision files** for easy access
4. **Suggest fixes** when validation fails
5. **Support all file types** (decisions, specs, risks, mistakes)

### Optional Enhancements

Consider adding:

- Auto-draft creation for missing decisions
- Web UI for browsing decisions
- Analytics and reporting
- Cross-repository validation
- Integration with issue trackers
- IDE plugins

## Architecture Patterns

### Pattern 1: CI/CD Validator

**Use Case:** Validate on pull requests in CI/CD pipelines

**Flow:**
```
1. PR opened/updated
2. CI job triggered
3. Validator fetches changed files
4. Check enforcement rules
5. Validate required artifacts
6. Post results & status
```

**Examples:** GitHub Actions, GitLab CI, CircleCI

**Pros:** Simple, no hosting, free  
**Cons:** Limited features, runs after push

---

### Pattern 2: Webhook-Based App

**Use Case:** Real-time validation with advanced features

**Flow:**
```
1. PR opened/updated → Webhook sent
2. Server receives webhook
3. Fetch repo contents via API
4. Run validation
5. Post results via API
6. Store state (optional)
```

**Examples:** GitHub Apps, GitLab Apps, Bitbucket Apps

**Pros:** Real-time, advanced features, proactive  
**Cons:** Requires hosting, more complex

---

### Pattern 3: CLI Tool

**Use Case:** Local validation, pre-commit hooks

**Flow:**
```
1. Developer runs command
2. Tool scans local files
3. Validates structure
4. Prints results
5. Exit code (0 = pass)
```

**Examples:** `provenancecode-validate`, pre-commit hooks

**Pros:** Fast feedback, no network  
**Cons:** Requires local install, no enforcement

---

### Pattern 4: IDE Extension

**Use Case:** Real-time feedback while writing

**Flow:**
```
1. Developer edits decision file
2. Extension watches file
3. Validates on save
4. Shows inline errors
5. Offers quick fixes
```

**Examples:** VS Code extensions, JetBrains plugins

**Pros:** Best DX, immediate feedback  
**Cons:** Per-IDE development, limited scope

## Core Validation Logic

### 1. Load Configuration

```javascript
async function loadConfig(repoPath) {
  const configPath = `${repoPath}/provenance/config.json`;
  const config = JSON.parse(await readFile(configPath));
  
  // Merge with defaults
  return {
    enforcement: config.enforcement || 'standard',
    requireDecisionOnPaths: config.requireDecisionOnPaths || [],
    requireDecisionOnLabels: config.requireDecisionOnLabels || [],
    ...config
  };
}
```

### 2. Scan for Artifacts

```javascript
async function scanDecisions(repoPath) {
  const decisionsPath = `${repoPath}/provenance/decisions`;
  const dirs = await listDirectories(decisionsPath);
  
  const decisions = [];
  
  for (const dir of dirs) {
    if (!/^DEC-\d{6}$/.test(dir)) continue;
    
    const jsonPath = `${decisionsPath}/${dir}/decision.json`;
    if (await fileExists(jsonPath)) {
      const data = JSON.parse(await readFile(jsonPath));
      decisions.push({ id: dir, path: jsonPath, data });
    }
  }
  
  return decisions;
}
```

### 3. Validate Structure

```javascript
function validateDecision(decision) {
  const errors = [];
  const warnings = [];
  
  // Required fields
  const required = [
    'schema', 'id', 'title', 'version',
    'lifecycle', 'timestamps', 'actors',
    'outcome', 'rationale', 'risk'
  ];
  
  for (const field of required) {
    if (!decision[field]) {
      errors.push(`Missing required field: ${field}`);
    }
  }
  
  // ID format
  if (!/^DEC-\d{6}$/.test(decision.id)) {
    errors.push('Invalid ID format (must be DEC-XXXXXX)');
  }
  
  // Schema version
  if (decision.schema !== 'provenancecode.decision.v1') {
    errors.push('Invalid schema version');
  }
  
  // Lifecycle state
  const validStates = ['draft', 'proposed', 'accepted', 'rejected', 'superseded'];
  if (!validStates.includes(decision.lifecycle?.state)) {
    errors.push('Invalid lifecycle state');
  }
  
  // Timestamps
  if (!isValidISO8601(decision.timestamps?.created_at)) {
    errors.push('Invalid created_at timestamp');
  }
  
  // Risk level
  const validRiskLevels = ['low', 'medium', 'high', 'critical'];
  if (!validRiskLevels.includes(decision.risk?.level)) {
    errors.push('Invalid risk level');
  }
  
  // Warnings
  if (!decision.options || decision.options.length === 0) {
    warnings.push('No alternatives listed in options');
  }
  
  if (!decision.problem) {
    warnings.push('No problem statement provided');
  }
  
  return { valid: errors.length === 0, errors, warnings };
}
```

### 4. Apply Enforcement Rules

```javascript
function checkEnforcement(config, changedFiles, prLabels, decisions) {
  const enforcement = config.enforcement;
  let required = false;
  
  // Check paths
  for (const file of changedFiles) {
    for (const pattern of config.requireDecisionOnPaths) {
      if (file.startsWith(pattern)) {
        required = true;
        break;
      }
    }
  }
  
  // Check labels
  for (const label of prLabels) {
    if (config.requireDecisionOnLabels.includes(label)) {
      required = true;
      break;
    }
  }
  
  if (!required) {
    return { required: false, blocking: false };
  }
  
  // Apply preset rules
  if (enforcement === 'light') {
    return { required: true, blocking: false };
  }
  
  if (enforcement === 'standard') {
    // Block on specific labels only
    const blockingLabels = ['breaking-change', 'architecture', 'security'];
    const hasBlockingLabel = prLabels.some(l => blockingLabels.includes(l));
    return { required: true, blocking: hasBlockingLabel };
  }
  
  if (enforcement === 'regulated') {
    return { required: true, blocking: true };
  }
  
  return { required: false, blocking: false };
}
```

### 5. Generate Results

```javascript
function generateResults(decisions, enforcement, validations) {
  const passed = validations.every(v => v.valid);
  
  let status = 'success';
  let message = 'All checks passed';
  
  if (!passed) {
    if (enforcement.blocking) {
      status = 'failure';
      message = 'Validation failed';
    } else {
      status = 'warning';
      message = 'Validation issues found';
    }
  }
  
  return {
    status,
    message,
    summary: {
      decisions_found: decisions.length,
      decisions_required: enforcement.required ? 1 : 0,
      errors: validations.flatMap(v => v.errors),
      warnings: validations.flatMap(v => v.warnings)
    },
    details: validations
  };
}
```

## JSON Schemas

Use these schemas for validation:

**Decision Schema:** `provenancecode.decision.v1`

Available at: `https://schemas.provenancecode.org/v1/decision.json`

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": [
    "schema", "id", "title", "version", "lifecycle",
    "timestamps", "actors", "outcome", "rationale", "risk"
  ],
  "properties": {
    "schema": {
      "type": "string",
      "const": "provenancecode.decision.v1"
    },
    "id": {
      "type": "string",
      "pattern": "^DEC-\\d{6}$"
    },
    "title": {
      "type": "string",
      "maxLength": 120
    },
    "version": {
      "type": "integer",
      "minimum": 1
    },
    "lifecycle": {
      "type": "object",
      "required": ["state"],
      "properties": {
        "state": {
          "enum": ["draft", "proposed", "accepted", "rejected", "superseded"]
        },
        "supersedes": { "type": "string" },
        "superseded_by": { "type": "string" }
      }
    },
    "timestamps": {
      "type": "object",
      "required": ["created_at"],
      "properties": {
        "created_at": { "type": "string", "format": "date-time" },
        "accepted_at": { "type": "string", "format": "date-time" },
        "updated_at": { "type": "string", "format": "date-time" },
        "expires_at": { "type": "string", "format": "date-time" }
      }
    },
    "actors": {
      "type": "object",
      "required": ["author"],
      "properties": {
        "author": { "type": "string" },
        "approver": { "type": "string" },
        "bot": { "type": "string" },
        "reviewers": { "type": "array", "items": { "type": "string" } }
      }
    },
    "outcome": { "type": "string" },
    "rationale": { "type": "string" },
    "risk": {
      "type": "object",
      "required": ["level"],
      "properties": {
        "level": { "enum": ["low", "medium", "high", "critical"] },
        "description": { "type": "string" },
        "acceptance": { "type": "string" },
        "mitigations": { "type": "array", "items": { "type": "string" } }
      }
    }
  }
}
```

## Testing Your Implementation

### Test Cases

Create test repositories with these scenarios:

**✅ Valid Cases:**
1. Minimal valid decision
2. Complete decision with all fields
3. Multiple decisions in PR
4. Decision with links and references

**❌ Invalid Cases:**
1. Missing required fields
2. Invalid ID format
3. Invalid lifecycle state
4. Invalid timestamp format
5. Missing decision when required

**⚠️ Edge Cases:**
1. Empty decisions directory
2. Superseded decisions
3. Multiple versions of same decision
4. Circular supersession links

### Compliance Checklist

Before releasing, verify:

- [ ] Validates against official JSON schema
- [ ] Checks all required fields
- [ ] Validates ID format (DEC-XXXXXX)
- [ ] Supports all enforcement presets
- [ ] Handles missing files gracefully
- [ ] Provides clear error messages
- [ ] Links back to ProvenanceCode standard
- [ ] Has documentation for users
- [ ] Handles superseded decisions
- [ ] Validates timestamp formats
- [ ] Checks lifecycle states

## Platform-Specific Guides

### GitHub Actions

See [GitHub Actions implementation guide](implementation/github-action.md)

### GitLab CI

```yaml
provenancecode-validation:
  stage: test
  script:
    - npm install -g @provenancecode/validator
    - provenancecode-validate
  only:
    - merge_requests
```

### CircleCI

```yaml
version: 2.1
jobs:
  validate:
    docker:
      - image: node:18
    steps:
      - checkout
      - run: npm install -g @provenancecode/validator
      - run: provenancecode-validate
workflows:
  pr-validation:
    jobs:
      - validate
```

### Bitbucket Pipelines

```yaml
pipelines:
  pull-requests:
    '**':
      - step:
          name: ProvenanceCode Validation
          script:
            - npm install -g @provenancecode/validator
            - provenancecode-validate
```

## Publishing Your Implementation

### 1. Document It

Create clear documentation:
- Installation instructions
- Configuration options
- Usage examples
- Troubleshooting guide

### 2. License It

Choose an appropriate license:
- **Open source:** Apache 2.0, MIT, GPL, etc.
- **Commercial:** Your choice
- **Dual license:** Offer both

### 3. Respect the Trademark

**ProvenanceCode™** is a trademark of EmbankAI (KDDLC AI Solutions SL).

When naming your implementation:
- ✅ **Good:** "GitLab ProvenanceCode Validator", "ProvenanceCode Tools for Jenkins"
- ❌ **Avoid:** "ProvenanceCode Enterprise", "Official ProvenanceCode"

You MAY use "ProvenanceCode" to describe compatibility.
You MUST NOT imply official endorsement.

See [Trademark Policy](../TRADEMARK.md) for full guidelines.

### 4. Share It

- Submit PR to add it to [Implementations](implementations.md)
- Tag it: `provenancecode-implementation`
- Tweet with #ProvenanceCode
- Post on relevant forums

### 4. Get Feedback

- Enable GitHub Issues
- Join community discussions
- Iterate based on user feedback

## Support

### Questions?

- **Spec questions:** [GitHub Issues](https://github.com/ProvenanceCode/ProvenanceCode/issues)
- **Implementation help:** [Discussions](https://github.com/ProvenanceCode/ProvenanceCode/discussions)
- **Community:** Join our community channels

### Found an Ambiguity?

If the specification is unclear, please:
1. Open an issue describing the ambiguity
2. Propose clarification
3. We'll update the spec for everyone

---

**Ready to build?** Start with the [Standard Overview](standard/index.md) and [DEO Specification](standard/deo.md).

