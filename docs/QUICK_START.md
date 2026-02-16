# ProvenanceCode Migrations - Quick Start

## Overview

The ProvenanceCode migration system allows you to automatically update artifacts as the standard evolves.

## Basic Usage

### Update to Latest Version

```bash
# Update all artifacts to latest version (with preview)
prvc update-version --dry-run

# Apply the migration
prvc update-version

# Update with specific strategy
prvc update-version --strategy full-v2 --project MYAPP
```

### Rollback if Needed

```bash
# Rollback last migration
prvc rollback

# List available backups
prvc backups list

# Restore from specific backup
prvc backups restore --backup .backups/2026-02-16-100000
```

## Common Scenarios

### Scenario 1: Keep v1.0 Format (No Changes)

Just continue using ProvenanceCode as you have been. No migration needed!

```bash
# Your artifacts stay as-is
DEC-000001
SPEC-000045
```

### Scenario 2: Add v2.0 Metadata Only

Add new metadata fields without changing IDs:

```bash
# Preview changes
prvc update-version --strategy metadata-only --dry-run

# Apply migration
prvc update-version --strategy metadata-only
```

**Result:**
- IDs remain: `DEC-000001`, `SPEC-000045`
- Added: `metadata` fields with version info

### Scenario 3: Full v2.0 Migration

Convert to project/subproject format:

```bash
# For single project
prvc update-version --strategy full-v2 \
  --project MYAPP \
  --subproject CORE \
  --dry-run

# For monorepo (interactive)
prvc update-version --strategy interactive
```

**Result:**
- `DEC-000001` → `DEC-MYAPP-CORE-000001`
- Added: `project` and `subproject` metadata
- Directory renamed

### Scenario 4: Migrate Specific Artifacts

```bash
# Migrate single decision
prvc update-version \
  --artifact DEC-000001 \
  --project MYAPP \
  --subproject FE

# Migrate all specs only
prvc update-version --type spec
```

## Migration from Spec URL

When a new ProvenanceCode version is released, you can migrate using the spec URL:

```bash
# Migrate to version specified in spec
prvc update-version https://provenancecode.org/specs/SPEC-000046

# This automatically:
# 1. Downloads the spec
# 2. Determines target version (e.g., 2.0)
# 3. Finds appropriate migration (1.0-to-2.0)
# 4. Runs the migration
```

## Safety Features

### Automatic Backups

Every migration creates a backup:

```bash
# Backups stored in .backups/
.backups/
  └── 2026-02-16-100000/
      └── provenance/
          └── [original artifacts]

# Rollback anytime
prvc rollback
```

### Dry-Run Mode

Always preview before applying:

```bash
# Preview changes
prvc update-version --dry-run

# Shows what will change without modifying files
```

### Validation

Automatic validation after migration:

```bash
# Migration automatically validates
prvc update-version

# Manual validation
prvc validate
```

## Example Workflow

### Simple Migration Workflow

```bash
# 1. Check current status
prvc validate

# 2. Preview migration
prvc update-version --dry-run

# 3. Create backup (automatic)
# 4. Apply migration
prvc update-version

# 5. Verify results
prvc validate

# 6. View history
prvc history
```

### Safe Production Migration

```bash
# 1. Test on development branch
git checkout -b migration-test
prvc update-version --dry-run

# 2. Review changes
git diff

# 3. Apply migration
prvc update-version

# 4. Run tests
npm test

# 5. Commit if successful
git add .
git commit -m "chore: Migrate to ProvenanceCode v2.0"

# 6. Or rollback if issues
prvc rollback
git checkout main
```

## Managing Backups

```bash
# List all backups
prvc backups list

# Output:
# Available backups:
# 1. 2026-02-16-100000
#    Created: 2026-02-16T10:00:00Z
#    Size: 245678 bytes

# Clean old backups (keep last 5)
prvc backups clean --keep 5

# Restore from backup
prvc backups restore --backup .backups/2026-02-16-100000
```

## Configuration

### Create Configuration

```bash
# Initialize config
prvc config init

# Set values
prvc config set --key defaultProject --value MYAPP
prvc config set --key defaultSubproject --value CORE

# View config
prvc config show
```

### Migration Config File

Create `migration-config.json`:

```json
{
  "strategy": "metadata-only",
  "defaultProject": {
    "code": "MYAPP",
    "name": "My Application"
  },
  "pathMapping": {
    "frontend/**": { "subproject": "FE" },
    "backend/**": { "subproject": "BE" }
  }
}
```

Then run:

```bash
prvc update-version --config migration-config.json
```

## Troubleshooting

### Issue: Migration Fails

```bash
# Check validation
prvc validate

# View detailed errors
prvc validate --verbose

# Attempt auto-fix
prvc validate --fix
```

### Issue: Wrong Subproject Assigned

```bash
# Rollback
prvc rollback

# Try with explicit mapping
prvc update-version \
  --strategy full-v2 \
  --project MYAPP \
  --config custom-mapping.json
```

### Issue: References Broken

```bash
# Migration should auto-update references
# If not, check migration log

# Manual validation
prvc validate

# Re-run with reference update
prvc update-version --force
```

## Advanced Usage

### Creating New Artifacts

```bash
# Create v2.0 decision
prvc create decision \
  --project MYAPP \
  --subproject FE \
  --title "Adopt React 18"

# Output: Created DEC-MYAPP-FE-000001

# Create v1.0 decision
prvc create decision --title "Legacy Format"

# Output: Created DEC-000002
```

### Migration History

```bash
# View all migrations
prvc history

# Output:
# 1. 1.0-to-2.0
#    Applied: 2026-02-16T10:00:00Z
#    By: user@example.com
#    Artifacts: 42
#    Status: completed

# Export as JSON
prvc history --json > migration-history.json
```

## Getting Help

```bash
# General help
prvc --help

# Command-specific help
prvc update-version --help
prvc rollback --help
prvc validate --help
```

## Next Steps

1. **Read Full Documentation:** See [migrations/README.md](./README.md)
2. **Review Migration Guide:** See [docs/MIGRATION_GUIDE_V2.md](../docs/MIGRATION_GUIDE_V2.md)
3. **Check Specific Migration:** See [migrations/versions/1.0-to-2.0/README.md](./versions/1.0-to-2.0/README.md)
4. **Try Dry-Run:** `prvc update-version --dry-run`

---

**Remember:** Always use `--dry-run` first to preview changes!
