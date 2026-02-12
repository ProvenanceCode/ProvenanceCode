# Implementations

**ProvenanceCode is an open standard.** Multiple implementations exist, and you can build your own.

## Official Implementations

### 1. GitHub Actions Validator (Open Source)

**Status:** ✅ Available  
**License:** Apache 2.0  
**Cost:** Free  
**Type:** Self-hosted CI/CD

**Features:**
- Validates decisions, specs, and risks on pull requests
- Posts validation results as PR comments
- Creates status checks for branch protection
- Configurable enforcement presets
- No external dependencies

**Best for:** Teams wanting a simple, free, open-source solution

**Get Started:** [GitHub Actions Guide](implementation/github-action.md)

---

### 2. ProvenanceCode App (Commercial)

**Status:** 🚧 In Development  
**Provider:** [EmbankAI](https://embank.ai)  
**License:** Proprietary  
**Cost:** Free for open source, paid for private repos  
**Type:** Managed SaaS

**Features:**
- Everything in GitHub Actions, plus:
- ✨ Auto-create decision drafts
- ✨ Web UI for decision management
- ✨ Cross-repository validation
- ✨ Team-based access controls
- ✨ Real-time validation feedback
- ✨ Enterprise support & SLA
- ✨ SOC 2 compliant hosting

**Best for:** Teams wanting zero-setup managed solution with advanced features

**Get Started:** [ProvenanceCode App](implementation/github-app.md)

---

## Community Implementations

We encourage the community to build implementations. If you've built one, please submit a PR to add it here!

### Build Your Own

ProvenanceCode is designed to be implementable by any team or vendor. Possible implementations:

**CI/CD Integrations:**
- GitLab CI validator
- CircleCI orb
- Jenkins plugin
- Azure DevOps extension
- Bitbucket Pipes

**IDE Extensions:**
- VS Code extension for decision drafts
- JetBrains plugin
- Cursor rules integration

**CLI Tools:**
- Standalone validator CLI
- Pre-commit hooks
- Git extensions

**Web Services:**
- Decision browsing UI
- Analytics dashboards
- Compliance reporting

**Want to build an implementation?** See our [Building Implementations Guide](building-implementations.md)

## Implementation Compliance

All implementations should:

1. **Validate against the spec** - Use the official JSON schemas
2. **Support enforcement presets** - Light, Standard, Regulated
3. **Provide clear feedback** - Help users understand validation results
4. **Link to the standard** - Reference ProvenanceCode.org in output
5. **Be documented** - Help users get started

### Certification (Future)

We may introduce an optional compliance certification program to help users identify fully-compliant implementations.

## License Compatibility

The **ProvenanceCode standard** is licensed under **Apache 2.0**, which permits:

- ✅ Open source implementations (any OSI-approved license)
- ✅ Proprietary/commercial implementations
- ✅ SaaS offerings
- ✅ Embedded in other products
- ✅ Modifications and derivatives

You do NOT need permission to build an implementation. You SHOULD link back to the standard for clarity.

## Contributing

### Report Implementation Issues

If you encounter issues implementing the standard, please:
1. Open an issue in the [ProvenanceCode repository](https://github.com/ProvenanceCode/ProvenanceCode)
2. Describe the ambiguity or difficulty
3. Suggest clarifications

Your feedback helps improve the standard for everyone.

### Share Your Implementation

Built an implementation? Let us know!
- Submit a PR adding it to this page
- Tag it with `provenancecode-implementation`
- Share on social media with #ProvenanceCode

## Vendor Neutrality

The ProvenanceCode standard is **vendor-neutral**. All implementations are equal in the eyes of the spec.

EmbankAI, as the initial steward, may offer commercial services, but:
- ✅ The standard remains open
- ✅ Community implementations are welcomed
- ✅ No preferential treatment in the spec

If you believe there's bias in the standard, please raise it via GitHub Issues.

---

**Ready to adopt ProvenanceCode?** Start with [GitHub Actions](implementation/github-action.md) for a free, open-source implementation.

