Implementations

ProvenanceCode is an open, vendor-neutral standard.
Multiple implementations exist. You may build your own.

Official Reference Implementations
GitHub Actions Validator (Open Source)

Type: Self-hosted CI/CD implementation
License: Apache 2.0
Cost: Free

This implementation validates compliance with the ProvenanceCode Standard at pull request time.

Capabilities:

Decision presence validation

Spec alignment checks

Risk & enforcement preset evaluation

Status checks compatible with branch protection

Suitable for teams seeking a minimal, transparent enforcement layer.

➡ See: GitHub Actions Guide

ProvenanceCode App (Managed)

Provider: EmbankAI
Type: Managed SaaS implementation

The ProvenanceCode App is an official managed implementation of the standard.

It includes:

Automated decision draft generation

Centralized decision browsing

Cross-repository validation

Team-based controls

Enterprise-grade hosting & support

Designed for organizations requiring managed infrastructure and operational guarantees.

➡ See: GitHub App Documentation

Community Implementations

The ProvenanceCode Standard is intentionally portable.

Possible integrations include:

GitLab CI

Azure DevOps

Jenkins

Bitbucket

IDE extensions

CLI validators

Compliance dashboards

If you have built an implementation, submit a pull request to list it here.

Implementation Requirements

To be considered compliant with the ProvenanceCode Standard, an implementation should:

Validate against the published schemas

Support enforcement presets (Light, Standard, Regulated)

Provide clear validation feedback

Link back to the standard

Document its behavior transparently

Vendor Neutrality

The ProvenanceCode Standard is vendor-neutral.

EmbankAI (KDDLC AI Solutions SL) acts as the initial steward and maintains official implementations.
The specification remains open and portable.

No implementation receives preferential treatment in the specification.

Concerns regarding neutrality should be raised via GitHub Issues.

---

<small>ProvenanceCode™ is a trademark of KDDLC AI Solutions SL.</small>