# ProvenanceCode v2.0 Migration Guide

## Overview

This guide helps you migrate from ProvenanceCode v1.0 naming convention to v2.0, which introduces project and subproject codes for better monorepo support and Jira integration.

## Quick Reference

### Format Comparison

**v1.0 (Legacy):**
```
DEC-000001
SPEC-000045
RA-000001
MR-000001
```

**v2.0 (New):**
```
DEC-SDO-FND-000001
SPEC-PQS-API-000042
RA-AUTH-SEC-000007
MR-PQS-FE-000003
```

### Breaking Changes

**None!** v2.0 is fully backward compatible. You can:
- Continue using v1.0 format indefinitely
- Mix v1.0 and v2.0 artifacts in the same repository
- Reference v1.0 artifacts from v2.0 artifacts and vice versa

## Migration Strategies

### Strategy 1: Gradual Migration (Recommended)

**Best for:** Most projects, especially those with existing artifacts

**Approach:**
1. Keep all existing v1.0 artifacts as-is
2. Create all new artifacts using v2.0 format
3. Update v1.0 artifacts only when they need changes

**Advantages:**
- Zero immediate work required
- No risk of breaking existing references
- Natural transition over time

**Steps:**
1. Define your project and subproject codes
2. Create `/provenance/codes.json`
3. Update documentation and templates
4. Train team on new format
5. Start using v2.0 for new artifacts

### Strategy 2: Bulk Migration

**Best for:** Small projects or greenfield migrations

**Approach:**
1. Convert all existing artifacts to v2.0 format
2. Update all references throughout the codebase
3. Create redirect mapping (optional)

**Advantages:**
- Clean, consistent naming across all artifacts
- Easier to understand for new team members
- Better organization from day one

**Disadvantages:**
- Requires upfront work
- Risk of breaking external references
- Need to update documentation

**Steps:**
1. Audit all existing artifacts
2. Define project/subproject codes
3. Run migration script
4. Update all references
5. Test thoroughly
6. Deploy all at once

### Strategy 3: Hybrid Approach

**Best for:** Active projects with some legacy content

**Approach:**
1. Keep closed/archived v1.0 artifacts unchanged
2. Migrate active artifacts to v2.0
3. Use v2.0 for all new artifacts

**Advantages:**
- Preserves historical records
- Improves active artifact organization
- Balances work and benefits

## Pre-Migration Checklist

Before starting migration, ensure you have:

- [ ] Read and understood SPEC-000046 specification
- [ ] Defined your project codes (2-4 uppercase letters)
- [ ] Defined your subproject codes (2-4 uppercase letters/numbers)
- [ ] Mapped subprojects to workspaces (if monorepo)
- [ ] Documented your naming conventions
- [ ] Backed up your repository
- [ ] Informed your team about the change
- [ ] Updated CI/CD to support v2.0 format

## Step-by-Step Migration

### Step 1: Define Project Codes

Choose meaningful, memorable codes for your projects.

**Examples:**
```
SDO  = System Demo
PQS  = PlantQuest System
AUTH = Authentication Service
PAY  = Payment Gateway
```

**Best Practices:**
- Use acronyms when possible
- Keep it short (2-4 letters)
- Make it pronounceable
- Align with Jira project keys if possible

### Step 2: Define Subproject Codes

Map subprojects to workspaces or components.

**Examples:**
```
FE   = Frontend
BE   = Backend
API  = API Service
CLI  = CLI Tools
CORE = Core Library
```

**Best Practices:**
- Use component names for monorepos
- Use layer names for modular projects
- Keep consistent within project
- Document the mapping

### Step 3: Create Code Registry

Create `/provenance/codes.json`:

```json
{
  "schema": "provenancecode.codes@1.0",
  "monorepo": true,
  "projects": {
    "PQS": {
      "name": "PlantQuest System",
      "jiraProject": "PQS",
      "subprojects": {
        "FE": {
          "name": "Frontend",
          "workspace": "pqs-frontend",
          "paths": ["pqs-frontend/**"],
          "jiraComponent": "Frontend"
        },
        "BE": {
          "name": "Backend",
          "workspace": "pqs-backend",
          "paths": ["pqs-backend/**"],
          "jiraComponent": "Backend"
        }
      }
    }
  }
}
```

### Step 4: Initialize Sequence Registry

Create `/provenance/sequences.json`:

```json
{
  "schema": "provenancecode.sequences@1.0",
  "namespaces": {
    "DEC-PQS-FE": {
      "current": 0,
      "next": 1,
      "lastUpdated": "2026-02-16T10:00:00Z"
    },
    "DEC-PQS-BE": {
      "current": 0,
      "next": 1,
      "lastUpdated": "2026-02-16T10:00:00Z"
    }
  }
}
```

### Step 5: Update Configuration

Update `/provenance/config.json` to enable v2.0 features:

```json
{
  "namingConvention": "v2.0",
  "enforceCodeRegistry": true,
  "requireProjectMetadata": true,
  "jiraIntegration": {
    "enabled": true,
    "syncEnabled": false
  }
}
```

### Step 6: Create New Artifacts (Gradual Migration)

For gradual migration, just start creating new artifacts with v2.0 format:

**Example: New Decision**

Directory: `/provenance/decisions/DEC-PQS-FE-000001/`

File: `decision.json`
```json
{
  "schema": "provenancecode.decision.v2",
  "decision_id": "DEC-PQS-FE-000001",
  "repo": {
    "org": "plantquest",
    "name": "pqs-platform"
  },
  "ref": "pc://plantquest/pqs-platform/decision/DEC-PQS-FE-000001",
  "project": {
    "code": "PQS",
    "name": "PlantQuest",
    "jiraProject": "PQS"
  },
  "subproject": {
    "code": "FE",
    "name": "Frontend",
    "workspace": "pqs-frontend",
    "jiraComponent": "Frontend"
  },
  "title": "Your decision title",
  "status": "draft",
  "context": {
    "problem": "Description of the problem"
  },
  "decision": "What was decided",
  "consequences": "Impact of the decision",
  "links": {
    "pr": "https://github.com/org/repo/pull/123"
  },
  "risk": {
    "score": 2,
    "rationale": "Low risk"
  },
  "review": {
    "human": "@reviewer"
  }
}
```

### Step 7: Migrate Existing Artifacts (Bulk Migration)

For bulk migration, use the migration script:

```bash
# Migrate single artifact
npm run provenance:migrate DEC-000001 --project PQS --subproject FE

# Output:
# Migrating DEC-000001 to DEC-PQS-FE-000001
# - Moving directory
# - Updating decision.json
# - Creating redirect
# ✓ Migration complete

# Bulk migrate by type
npm run provenance:migrate-all --type decision --project PQS

# Interactive migration
npm run provenance:migrate-interactive
```

### Step 8: Update References

After migrating artifacts, update references in:

1. **Other Artifacts**
   - Decision records referencing the migrated artifact
   - Spec documents
   - Risk acceptances
   - Mistake records

2. **Documentation**
   - README files
   - Architecture docs
   - Runbooks

3. **Code Comments**
   - Source code comments
   - TODO items
   - Commit messages (historical, optional)

4. **CI/CD**
   - Workflow files
   - Scripts
   - Configuration

**Example Reference Update:**

Before:
```json
{
  "relatedDecisions": ["DEC-000001", "DEC-000042"]
}
```

After (v2.0 references, v1.0 still valid):
```json
{
  "relatedDecisions": [
    "DEC-000001",
    "DEC-PQS-FE-000042"
  ]
}
```

### Step 9: Update Tooling

Update any custom tooling to support v2.0 format:

**Validation Scripts:**
```javascript
// Update ID pattern matching
const v1Pattern = /^(DEC|SPEC|RA|MR)-\d{6}$/;
const v2Pattern = /^(DEC|SPEC|RA|MR)-[A-Z]{2,4}-[A-Z0-9]{2,4}-\d{6}$/;

function isValidArtifactId(id) {
  return v1Pattern.test(id) || v2Pattern.test(id);
}
```

**Directory Scanning:**
```javascript
// Support both formats when scanning
const artifactDirs = fs.readdirSync('/provenance/decisions')
  .filter(dir => isValidArtifactId(dir));
```

### Step 10: Test

Test the migration thoroughly:

- [ ] All artifact IDs validate correctly
- [ ] Directory names match artifact IDs
- [ ] References resolve correctly
- [ ] CI/CD pipelines pass
- [ ] Jira integration works (if enabled)
- [ ] Search and indexing work
- [ ] Documentation is accurate

## Migration Script Usage

### Basic Migration

```bash
# Single artifact migration
npm run provenance:migrate <artifact-id> --project <PROJECT> --subproject <SUBPROJECT>

# Examples
npm run provenance:migrate DEC-000001 --project PQS --subproject FE
npm run provenance:migrate SPEC-000045 --project PQS --subproject API
```

### Bulk Migration

```bash
# Migrate all decisions
npm run provenance:migrate-all --type decision --project PQS --prompt

# Migrate all artifacts
npm run provenance:migrate-all --project PQS --prompt

# Dry run (preview changes)
npm run provenance:migrate-all --type decision --project PQS --dry-run
```

### Interactive Migration

```bash
npm run provenance:migrate-interactive

# The script will:
# 1. Scan for v1.0 artifacts
# 2. Prompt for project/subproject for each
# 3. Show preview
# 4. Ask for confirmation
# 5. Migrate and update references
```

## Common Issues and Solutions

### Issue 1: Duplicate Sequence Numbers

**Problem:** After migration, sequence numbers collide

**Solution:**
```bash
# Renumber sequences
npm run provenance:renumber --namespace DEC-PQS-FE

# Or manually update sequences.json
```

### Issue 2: Broken References

**Problem:** References to migrated artifacts break

**Solution:**
- Create redirect mapping in `/provenance/redirects.json`
- Update validation to check redirects
- Eventually update all references

Example redirect:
```json
{
  "DEC-000001": "DEC-PQS-FE-000001"
}
```

### Issue 3: Jira Sync Issues

**Problem:** Jira custom fields not updating

**Solution:**
1. Verify Jira custom fields exist
2. Check project/component mapping
3. Verify API credentials
4. Test sync manually:
   ```bash
   npm run provenance:jira-sync --artifact DEC-PQS-FE-000001
   ```

### Issue 4: CI/CD Validation Failures

**Problem:** CI fails after migration

**Solution:**
1. Update schema validation to accept v2.0 format
2. Update regex patterns in scripts
3. Check artifact directory names match IDs
4. Verify all required fields are present

## Post-Migration Tasks

After migration is complete:

- [ ] Update team documentation
- [ ] Update onboarding materials
- [ ] Update PR templates
- [ ] Update AI assistant rules
- [ ] Archive migration scripts
- [ ] Document lessons learned
- [ ] Celebrate! 🎉

## Rollback Plan

If you need to rollback a bulk migration:

1. **Restore from Backup:**
   ```bash
   git checkout <pre-migration-commit>
   ```

2. **Selective Rollback:**
   ```bash
   npm run provenance:rollback --artifact DEC-PQS-FE-000001
   ```

3. **Keep Both:**
   - Keep v2.0 artifacts
   - Restore v1.0 artifacts
   - Update references to use v1.0

## Examples

### Example 1: Small Project Migration

**Before (v1.0):**
```
/provenance/
  /decisions/
    /DEC-000001/
    /DEC-000002/
  /specs/
    /SPEC-000001/
```

**After (v2.0):**
```
/provenance/
  /codes.json
  /sequences.json
  /decisions/
    /DEC-MYAPP-CORE-000001/
    /DEC-MYAPP-CORE-000002/
  /specs/
    /SPEC-MYAPP-CORE-000001/
```

### Example 2: Monorepo Migration

**Before (v1.0):**
```
/
├── frontend/
├── backend/
└── provenance/
    └── decisions/
        ├── DEC-000001/
        └── DEC-000002/
```

**After (v2.0):**
```
/
├── frontend/
├── backend/
└── provenance/
    ├── codes.json
    ├── sequences.json
    └── decisions/
        ├── DEC-SHOP-FE-000001/
        └── DEC-SHOP-BE-000001/
```

**codes.json:**
```json
{
  "schema": "provenancecode.codes@1.0",
  "monorepo": true,
  "projects": {
    "SHOP": {
      "name": "E-Commerce Shop",
      "subprojects": {
        "FE": {
          "name": "Frontend",
          "workspace": "frontend",
          "paths": ["frontend/**"]
        },
        "BE": {
          "name": "Backend",
          "workspace": "backend",
          "paths": ["backend/**"]
        }
      }
    }
  }
}
```

## FAQs

### Q: Do I have to migrate?

**A:** No. v1.0 format is supported indefinitely. Migration is optional.

### Q: Can I mix v1.0 and v2.0 artifacts?

**A:** Yes. Both formats can coexist in the same repository.

### Q: Will v1.0 artifacts stop working?

**A:** No. All tooling supports both formats.

### Q: How do I choose project codes?

**A:** Use meaningful acronyms, align with Jira project keys if possible, keep it 2-4 letters.

### Q: What if I don't use Jira?

**A:** You can still use v2.0 format. Jira integration is optional.

### Q: Can I change codes after migration?

**A:** Yes, but it requires renaming artifacts. Better to choose carefully upfront.

### Q: Do sequence numbers restart for each subproject?

**A:** Yes, in v2.0 format. Each `{TYPE}-{PROJECT}-{SUBPROJECT}` namespace has independent sequences.

### Q: How do I handle cross-project references?

**A:** Use the full artifact ID (e.g., `DEC-OTHER-API-000001`) or ProvenanceCode URI for cross-repo.

## Resources

- [SPEC-000046: ProvenanceCode v2.0 Specification](../provenance/specs/SPEC-000046/specification.md)
- [Code Registry Schema](../provenance/schema/codes.schema.json)
- [Sequence Registry Schema](../provenance/schema/sequences.schema.json)
- [Migration Scripts](../scripts/provenance/migrate.js)
- [Jira Integration Guide](./JIRA_INTEGRATION.md)

## Support

For help with migration:
- Open an issue on GitHub
- Contact ProvenanceCode support
- Join the community Discord
- Review the examples in `/provenance/examples/`

---

**Last Updated:** 2026-02-16  
**Version:** 2.0.0  
**Status:** Active
