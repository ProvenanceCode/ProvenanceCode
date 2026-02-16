# ProvenanceCode v2.0 Migration Guide

This guide helps you migrate from ProvenanceCode v1.0 to v2.0 naming convention.

## Overview

ProvenanceCode v2.0 introduces an enhanced naming convention that supports:

- **Monorepo organization** - Map artifacts to specific workspaces
- **Jira integration** - Direct mapping to Jira projects and components
- **Hierarchical structure** - Organize by project and subproject
- **Backward compatibility** - v1.0 format continues to work

**Key Point:** Migration is **optional**. You can continue using v1.0, adopt v2.0, or mix both formats.

## Should You Migrate?

### Use v2.0 If You Have:

- ✅ **Monorepo structure** - Multiple apps/services in one repo
- ✅ **Jira integration needs** - Want automatic Jira ticket linking
- ✅ **Multiple teams** - Need to organize artifacts by team/project
- ✅ **Complex organization** - Want hierarchical artifact organization

### Stay with v1.0 If You Have:

- ✅ **Single application** - One app per repository
- ✅ **Simple structure** - Don't need hierarchical organization
- ✅ **No Jira** - Not using Jira or similar project tracking
- ✅ **Working fine** - Current setup meets your needs

## Migration Paths

### Option 1: Gradual Migration (Recommended)

Start using v2.0 for new artifacts while keeping existing v1.0 artifacts:

```
/provenance/
  /decisions/
    /DEC-000001/              ← Existing v1.0 (keep as-is)
    /DEC-000002/              ← Existing v1.0 (keep as-is)
    /DEC-PROJ-CORE-000001/    ← New v2.0 artifacts
    /DEC-PROJ-API-000002/     ← New v2.0 artifacts
```

**Advantages:**
- No disruption to existing artifacts
- Test v2.0 with new decisions
- Both formats work together
- Links remain valid

### Option 2: Full Migration

Convert all existing artifacts to v2.0 format.

**Advantages:**
- Consistent naming across all artifacts
- Full v2.0 benefits immediately
- Cleaner organization

**Disadvantages:**
- Need to update all references
- More upfront work
- May break external links

### Option 3: Stay on v1.0

Continue using v1.0 format indefinitely.

**Advantages:**
- No migration effort
- Existing setup continues working
- No learning curve

**Note:** v1.0 will be supported indefinitely.

## Step-by-Step Migration

### Step 1: Create Codes Registry

Create `/provenance/codes.json`:

```json
{
  "schema": "provenancecode.codes@1.0",
  "monorepo": false,
  "projects": {
    "MYAPP": {
      "name": "My Application",
      "jiraProject": "MYAPP",
      "subprojects": {
        "CORE": {
          "name": "Core",
          "workspace": ".",
          "jiraComponent": "Core"
        }
      }
    }
  }
}
```

**For monorepos:**

```json
{
  "schema": "provenancecode.codes@1.0",
  "monorepo": true,
  "projects": {
    "SHOP": {
      "name": "E-Commerce Shop",
      "jiraProject": "SHOP",
      "subprojects": {
        "FE": {
          "name": "Frontend",
          "workspace": "frontend",
          "paths": ["frontend/**"],
          "jiraComponent": "Frontend"
        },
        "BE": {
          "name": "Backend",
          "workspace": "backend",
          "paths": ["backend/**"],
          "jiraComponent": "Backend"
        },
        "API": {
          "name": "API Gateway",
          "workspace": "api",
          "paths": ["api/**"],
          "jiraComponent": "API"
        }
      }
    }
  }
}
```

### Step 2: Create Sequences File

Create `/provenance/sequences.json`:

```json
{
  "schema": "provenancecode.sequences@1.0",
  "sequences": {
    "MYAPP-CORE": {
      "DEC": 1,
      "SPEC": 1,
      "RA": 1,
      "MR": 1
    }
  }
}
```

**For monorepos:**

```json
{
  "schema": "provenancecode.sequences@1.0",
  "sequences": {
    "SHOP-FE": {
      "DEC": 1,
      "SPEC": 1,
      "RA": 1,
      "MR": 1
    },
    "SHOP-BE": {
      "DEC": 1,
      "SPEC": 1,
      "RA": 1,
      "MR": 1
    },
    "SHOP-API": {
      "DEC": 1,
      "SPEC": 1,
      "RA": 1,
      "MR": 1
    }
  }
}
```

### Step 3: Update Configuration

Update `/provenance/.provenancecode.json`:

```json
{
  "schema": "provenancecode.config@1.0",
  "version": "2.0",
  "enforcement": {
    "preset": "standard"
  },
  "codes": {
    "version": "2.0",
    "registry": "codes.json",
    "sequences": "sequences.json"
  }
}
```

### Step 4: Create Your First v2.0 Artifact

Create `/provenance/decisions/DEC-MYAPP-CORE-000001/decision.json`:

```json
{
  "schema": "provenancecode.decision.v2",
  "decision_id": "DEC-MYAPP-CORE-000001",
  "project": {
    "code": "MYAPP",
    "name": "My Application",
    "jiraProject": "MYAPP"
  },
  "subproject": {
    "code": "CORE",
    "name": "Core",
    "workspace": ".",
    "jiraComponent": "Core"
  },
  "title": "Adopt v2.0 Naming Convention",
  "status": "accepted",
  "context": {
    "problem": "Need better organization for growing codebase",
    "constraints": ["Must maintain backward compatibility"]
  },
  "decision": "Adopt ProvenanceCode v2.0 naming convention for new artifacts",
  "consequences": "Better organization and Jira integration",
  "links": {
    "pr": "https://github.com/org/repo/pull/123"
  },
  "timestamps": {
    "created_at": "2026-02-16T00:00:00Z",
    "updated_at": "2026-02-16T00:00:00Z"
  }
}
```

### Step 5: Test Validation

Ensure your ProvenanceCode validator recognizes v2.0 format:

```bash
# Run validation
provenancecode validate

# Should see:
# ✅ DEC-MYAPP-CORE-000001: Valid
```

## Migrating Existing Artifacts (Optional)

If you choose full migration, here's how to convert existing v1.0 artifacts:

### Example: Converting a Decision

**Before (v1.0):**
```
/provenance/decisions/DEC-000001/decision.json
```

```json
{
  "schema": "provenancecode.decision.v2",
  "decision_id": "DEC-000001",
  "title": "Use PostgreSQL",
  "status": "accepted"
}
```

**After (v2.0):**
```
/provenance/decisions/DEC-MYAPP-CORE-000001/decision.json
```

```json
{
  "schema": "provenancecode.decision.v2",
  "decision_id": "DEC-MYAPP-CORE-000001",
  "project": {
    "code": "MYAPP",
    "name": "My Application"
  },
  "subproject": {
    "code": "CORE",
    "name": "Core"
  },
  "title": "Use PostgreSQL",
  "status": "accepted"
}
```

### Migration Checklist

- [ ] Create `codes.json` registry
- [ ] Create `sequences.json` file
- [ ] Update `.provenancecode.json` config
- [ ] Choose migration path (gradual vs. full)
- [ ] Create first v2.0 artifact
- [ ] Test validation
- [ ] Update team documentation
- [ ] (Optional) Convert existing artifacts
- [ ] (Optional) Update PR templates

## Common Patterns

### Pattern 1: Monorepo with Multiple Apps

```
/provenance/
  codes.json
  sequences.json
  /decisions/
    /DEC-SHOP-FE-000001/     ← Frontend decisions
    /DEC-SHOP-BE-000001/     ← Backend decisions
    /DEC-SHOP-MOBILE-000001/ ← Mobile app decisions
```

### Pattern 2: Microservices

```
/provenance/
  codes.json
  sequences.json
  /decisions/
    /DEC-AUTH-API-000001/    ← Auth service
    /DEC-PAY-API-000001/     ← Payment service
    /DEC-USER-API-000001/    ← User service
```

### Pattern 3: Team-Based Organization

```
/provenance/
  codes.json
  sequences.json
  /decisions/
    /DEC-PROJ-FE-000001/     ← Frontend team
    /DEC-PROJ-BE-000001/     ← Backend team
    /DEC-PROJ-INFRA-000001/  ← Infrastructure team
```

## Updating Enforcement Rules

If you have custom enforcement rules, update them to support v2.0:

```json
{
  "enforcement": {
    "preset": "standard",
    "decision_id_pattern": {
      "v1": "^(DEC|SPEC|RA|MR)-\\d{6}$",
      "v2": "^(DEC|SPEC|RA|MR)-[A-Z0-9]{2,4}-[A-Z0-9]{2,4}-\\d{6}$"
    }
  }
}
```

## Jira Integration Setup

To enable Jira integration with v2.0:

1. **Map Projects:**
```json
{
  "projects": {
    "SHOP": {
      "jiraProject": "SHOP",
      "jiraUrl": "https://yourcompany.atlassian.net"
    }
  }
}
```

2. **Map Components:**
```json
{
  "subprojects": {
    "FE": {
      "jiraComponent": "Frontend"
    }
  }
}
```

3. **Auto-Link Decisions:**
```
DEC-SHOP-FE-000001 automatically links to:
- Jira Project: SHOP
- Jira Component: Frontend
```

## Troubleshooting

### Validation Fails

**Error:** "Invalid decision_id format"

**Solution:** Ensure your validator supports v2.0. Update to the latest version.

### Sequences Not Incrementing

**Error:** Duplicate decision IDs

**Solution:** Check `sequences.json` is correctly configured and writable.

### Jira Links Not Working

**Error:** Jira integration not creating links

**Solution:** Verify `jiraProject` and `jiraComponent` match your Jira setup.

## FAQ

**Q: Can I switch back to v1.0?**  
A: Yes, both formats are always supported.

**Q: Do I need to migrate all at once?**  
A: No, gradual migration is recommended and fully supported.

**Q: Will old links break?**  
A: No, if you keep existing artifacts. New v2.0 artifacts have new IDs.

**Q: Can I use both formats permanently?**  
A: Yes, both formats can coexist indefinitely.

**Q: Is there a tool to auto-migrate?**  
A: Check the ProvenanceCode repository for migration tools.

## Next Steps

After migration:

1. **Document your setup** - Add migration notes to your team wiki
2. **Update templates** - Create v2.0 templates for new artifacts
3. **Train team** - Share v2.0 naming convention with team
4. **Monitor adoption** - Track usage of v2.0 format
5. **Gather feedback** - Collect team feedback on v2.0 benefits

## Support

Need help with migration?

- **Issues:** [GitHub Issues](https://github.com/ProvenanceCode/ProvenanceCode/issues)
- **Discussions:** [GitHub Discussions](https://github.com/ProvenanceCode/ProvenanceCode/discussions)
- **Documentation:** [ProvenanceCode Docs](https://provenancecode.github.io/ProvenanceCode/)

---

**ProvenanceCode™** is a trademark of **KDDLC AI Solutions SL**.

The ProvenanceCode standard specification is licensed under [Apache License 2.0](../LICENSE).
