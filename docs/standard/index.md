# ProvenanceCode Open Standard Specification

**Version:** 1.0.0  
**Status:** Draft  
**Last Updated:** February 2026

## Abstract

ProvenanceCode is an open standard for creating auditable trails of technical decisions, risk acceptances, mistake records, and specifications in software development projects. This standard defines file formats, directory structures, enforcement policies, and integration patterns that enable teams to maintain institutional knowledge and governance without heavy process overhead.

## Table of Contents

1. [Introduction](#introduction)
2. [Core Principles](#core-principles)
3. [Scope](#scope)
4. [Specification Documents](#specification-documents)
5. [Conformance Levels](#conformance-levels)
6. [Terminology](#terminology)
7. [References](#references)

## Introduction

### Problem Statement

Software projects accumulate technical decisions, accepted risks, and learned mistakes, but this knowledge is often:
- Scattered across PR comments, Slack messages, and tribal knowledge
- Lost when team members leave
- Inaccessible to new team members and AI assistants
- Unauditable for compliance purposes
- Difficult to link between requirements, decisions, and implementation

### Solution

ProvenanceCode provides a structured, version-controlled format for capturing:
- **Decision Evidence Objects (DEOs)** - Why technical choices were made
- **Risk Acceptances** - Formal acknowledgment of known risks with mitigation plans
- **Mistake Records** - Post-mortems that create prevention rules
- **Specifications** - Requirements linked to implementing decisions

## Core Principles

### 1. Git-Native
All provenance artifacts live in the same repository as the code they describe, versioned together.

### 2. Human and Machine Readable
JSON for structured data, Markdown for human narrative. Both are first-class citizens.

### 3. Non-Invasive
Adoption is incremental. Start with decisions only, add specs and risks as needed.

### 4. AI-Friendly
Clear rules guide AI assistants to create drafts before implementing changes, but humans always approve.

### 5. Enforcement Flexibility
Three presets (Light, Standard, Regulated) allow teams to choose appropriate governance levels.

### 6. Auditable
Timestamps, actors, and optional cryptographic receipts create tamper-evident trails.

## Scope

### In Scope

- File formats for decisions, risks, mistakes, and specs
- Directory structure conventions
- Enforcement policy configuration
- Lifecycle state management
- Linking and traceability patterns
- AI assistant integration guidelines

### Out of Scope

- Specific CI/CD implementation details (examples provided)
- Git hosting platform requirements (works with GitHub, GitLab, Bitbucket)
- Programming language or framework restrictions
- Team size or organizational structure
- Cryptographic signature implementations (optional extensions)

## Specification Documents

This standard consists of the following normative documents:

### Core Specifications

1. **[Repository Layout](repo-layout.md)** - Directory structure and file organization
2. **[Decision Evidence Objects (DEO)](deo.md)** - Decision record format and lifecycle
3. **[Enforcement Policies](enforcement.md)** - Validation rules and presets
4. **[Versioning and Lifecycle](versioning.md)** - State management and supersession

### Extended Specifications

5. **Risk Acceptance Format** - Risk record structure (see schemas)
6. **Mistake Record Format** - Post-mortem and prevention rules (see schemas)
7. **Specification Format** - Requirements and acceptance criteria (see schemas)
8. **Indexes and Linking** - Cross-reference patterns (see schemas)

### Non-Normative Documents

- Implementation guides (in `/guides/`)
- Examples (in `/examples/`)
- Integration patterns
- Best practices

## Conformance Levels

### Level 1: Decision Records Only

**Requirements:**
- Directory structure: `/provenance/decisions/`
- Config file: `provenance/config.json`
- At least one decision record in valid format
- Decision IDs follow format: `DEC-XXXXXX` (6 digits)

**Suitable for:** Teams starting with lightweight decision tracking

### Level 2: Standard Compliance

**Requirements:**
- All Level 1 requirements
- Enforcement policy: `provenance/policies/enforcement.yml`
- Support for risks and specs (directories created)
- PR template integration
- Decision lifecycle management (draft → accepted → superseded)

**Suitable for:** Production teams requiring governance

### Level 3: Full Provenance

**Requirements:**
- All Level 2 requirements
- Mistake records with prevention rules
- Acceptance receipts with cryptographic verification
- Learnings indexes
- Cross-linking between decisions, risks, specs, and mistakes
- AI assistant rules: `.provenancecode/ai-rules.md`

**Suitable for:** Regulated industries, safety-critical systems

## Terminology

**MUST**, **MUST NOT**, **REQUIRED**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **RECOMMENDED**, **MAY**, and **OPTIONAL** in this document are to be interpreted as described in RFC 2119.

### Key Terms

- **Decision Evidence Object (DEO)** - A structured record of a technical decision including context, options, outcome, and rationale
- **Decision ID** - Unique identifier following format `DEC-XXXXXX` where X is a digit
- **Risk Acceptance (RA)** - Formal acknowledgment of a known risk with severity, mitigations, and expiration
- **Mistake Record (MR)** - Post-mortem documenting an error, root cause, and prevention rule
- **Specification (SPEC)** - Requirements document with acceptance criteria
- **Lifecycle State** - Current status of a record (draft, proposed, accepted, rejected, superseded)
- **Enforcement Preset** - Pre-configured policy level (light, standard, regulated)
- **Provenance Path** - Root directory containing all provenance artifacts (`/provenance/`)
- **Acceptance Receipt** - Cryptographic proof of decision approval (optional)
- **Guardrail** - Prevention rule derived from a mistake record

## References

### Normative References

- RFC 2119: Key words for use in RFCs to Indicate Requirement Levels
- JSON Schema Draft 2020-12
- YAML 1.2.2
- ISO 8601: Date and time format
- Semantic Versioning 2.0.0

### Informative References

- Architecture Decision Records (ADR) by Michael Nygard
- C2PA Content Credentials (optional extension)
- W3C PROV Data Model (optional extension)
- Git commit conventions (Conventional Commits)

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-02-12 | Initial draft specification |

## Contributing

ProvenanceCode is an **open standard**. We welcome:

- **Specification improvements** - Suggest changes via GitHub Issues
- **Implementation feedback** - Share what works and what doesn't
- **New implementations** - Build tools, plugins, and services
- **Documentation** - Help clarify and expand the standard

All contributions to the specification are reviewed by the core team with community input.

### How to Contribute

1. **Discuss:** Open an issue describing your proposal
2. **Draft:** Fork the repo and make changes
3. **Submit:** Create a pull request with clear rationale
4. **Collaborate:** Iterate based on feedback
5. **Adopt:** Once accepted, changes are incorporated

## License & Intellectual Property

### Standard Specification

The ProvenanceCode specification (this documentation) is licensed under **Apache License 2.0**.

This means you can:
- ✅ Use it commercially
- ✅ Modify it for your needs
- ✅ Distribute it
- ✅ Use it privately
- ✅ Use patent claims in the specification

### Why Apache 2.0?

Apache 2.0 provides:
- **Maximum permissiveness** for adoption
- **Patent protection** for implementers
- **Commercial-friendly** licensing
- **Clear liability** limitations
- **Industry standard** recognition

### Implementation Freedom

You are **free to build** commercial or open-source implementations without restriction. The standard itself remains open; implementations can be any license.

## Governance

### Stewardship

ProvenanceCode is currently stewarded by **[EmbankAI](https://embank.ai)** as the initial developer and maintainer.

### Decision Process

- **Specification changes** require consensus from core maintainers
- **Breaking changes** trigger new major version
- **Community input** is considered for all changes
- **Transparency** - all decisions documented in this repository

### Future Governance

As the standard matures, we may transition to a foundation model or community governance structure to ensure long-term independence and neutrality.

---

**Next:** Read the [Repository Layout](repo-layout.md) specification to understand the required directory structure.

