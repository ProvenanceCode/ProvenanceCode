# Changelog: Hierarchical ID Format Enhancement

**Date:** 2026-02-16  
**Version:** 1.1.0  
**Type:** Enhancement

## Summary

Enhanced ProvenanceCode ID format to support hierarchical naming for better monorepo organization and cross-system integration (dashboards, JIRA). The subproject component is **optional by default**, and the format is **fully configurable** via `provenance/config.json`.

## Changes Made

### New ID Format

**Previous (Legacy only):**
```
DEC-000042
```

**New (Flexible):**
```
DEC-{PROJECT}-{SUBPROJECT}-{NUMBER}  # Full hierarchical
DEC-{PROJECT}-{NUMBER}                # Hierarchical without subproject
DEC-{NUMBER}                          # Legacy (still supported)
```

### Key Features

1. **Optional Subproject**: By default, subproject is optional in hierarchical format
2. **Configurable**: Format style controlled via `provenance/config.json`
3. **Backward Compatible**: Legacy format still fully supported
4. **Flexible**: Works for monorepos, simple projects, and everything in between

### Configuration Format

**New config section in `provenance/config.json`:**

```json
{
  "version": "1.0",
  "id_format": {
    "style": "hierarchical",           // or "legacy"
    "project": "SDM",                  // required if hierarchical
    "subproject": "FRD",               // optional default
    "require_subproject": false        // optional, default: false
  }
}
```

### Updated Files

#### Documentation
- ✅ `docs/standard/repo-layout.md` - Updated ID format section with hierarchical patterns
- ✅ `docs/standard/deo.md` - Updated Decision ID specification with examples
- ✅ `docs/standard/index.md` - Updated terminology with new format definitions
- ✅ `docs/standard/enforcement.md` - Updated validation rules for configurable formats
- ✅ `docs/standard/versioning.md` - Updated all examples to use hierarchical format
- ✅ `docs/building-implementations.md` - Updated validator requirements and examples
- ✅ `docs/implementation/github-action.md` - Updated validation references
- ✅ `docs/implementation/github-app.md` - Updated validation code examples
- ✅ `docs/hierarchical-ids.md` - **NEW** Comprehensive guide to hierarchical IDs

#### Code Examples
- Updated all ID validation regex patterns
- Added `validateIdFormat()` helper function
- Updated scanner functions to read config

### Examples

#### Example 1: Monorepo with Subprojects

**Config:**
```json
{
  "id_format": {
    "style": "hierarchical",
    "project": "SDM",
    "require_subproject": true
  }
}
```

**IDs:**
- `DEC-SDM-FRD-0000019` (frontend decisions)
- `DEC-SDM-API-0000042` (API decisions)
- `DEC-SDM-MOB-0000007` (mobile decisions)

#### Example 2: Simple Project with Optional Modules

**Config:**
```json
{
  "id_format": {
    "style": "hierarchical",
    "project": "CORE",
    "require_subproject": false
  }
}
```

**IDs:**
- `DEC-CORE-AUTH-0000001` (auth-specific)
- `DEC-CORE-0000042` (general decisions)

#### Example 3: Simple Project (Legacy)

**Config:**
```json
{
  "id_format": {
    "style": "legacy"
  }
}
```

**IDs:**
- `DEC-000001`
- `DEC-000042`

### Validation Rules

#### Hierarchical Format

**With subproject (when required):**
```regex
^(DEC|RA|MR|SPEC)-[A-Z0-9]{2,6}-[A-Z0-9]{2,6}-\d{7}$
```

**With optional subproject:**
```regex
^(DEC|RA|MR|SPEC)-[A-Z0-9]{2,6}-([A-Z0-9]{2,6}-)?(\d{7})$
```

#### Legacy Format

```regex
^(DEC|RA|MR|SPEC)-\d{6}$
```

### Use Cases

1. **Monorepo Organization**: `DEC-SDM-FRD-0000019` clearly identifies system-demo/frontend
2. **JIRA Integration**: Maps naturally to JIRA keys and custom fields
3. **Dashboard Filtering**: Easy queries like "show all frontend decisions" or "all auth-related specs"
4. **Cross-Repository References**: Project identifiers enable clear references across repos
5. **Simple Projects**: Legacy format remains available for projects that don't need hierarchy

### Migration Path

**From Legacy to Hierarchical:**

1. Update `provenance/config.json` with new format
2. Choose migration strategy:
   - **Gradual**: New decisions use hierarchical, old ones stay legacy
   - **Full**: Rename all directories and update references
3. Validators support both formats during transition

**No breaking changes** - legacy format continues to work indefinitely.

### Benefits

✅ **Better Organization**: Clear project/module structure  
✅ **JIRA Integration**: Natural mapping to issue tracking systems  
✅ **Dashboard Friendly**: Easy filtering and querying  
✅ **Monorepo Support**: Multiple projects in single repository  
✅ **Flexible**: Optional subproject for varying complexity  
✅ **Configurable**: Choose format that fits your needs  
✅ **Backward Compatible**: Legacy format still fully supported  

### Breaking Changes

**None.** This is a backward-compatible enhancement. Legacy format remains fully supported.

### Validator Updates Required

Implementations MUST:
1. Read `provenance/config.json` to determine format style
2. Validate IDs according to configured style
3. Support both hierarchical and legacy formats
4. Handle optional subproject in hierarchical mode

### Testing Checklist

- [ ] Legacy format still validates correctly
- [ ] Hierarchical format with subproject validates
- [ ] Hierarchical format without subproject validates
- [ ] Config parsing handles missing `id_format` section
- [ ] Mixed formats work during migration
- [ ] Error messages reference config file

### Resources

- [Hierarchical IDs Guide](hierarchical-ids.md) - Complete reference
- [Repository Layout Spec](standard/repo-layout.md) - Updated format rules
- [Decision Spec](standard/deo.md) - Updated ID format section
- [Building Implementations](building-implementations.md) - Updated validation code

## Timeline

- **2026-02-16**: Enhancement proposed and documented
- **TBD**: Community feedback period
- **TBD**: Official release as v1.1.0

## Feedback

Questions or suggestions? Open an issue on the ProvenanceCode GitHub repository.

---

<small>ProvenanceCode™ is a trademark of KDDLC AI Solutions SL.</small>

