# ProvenanceCode

## Decision-Driven Development for the AI Era

Traceable AI-assisted decisions. Enforced at merge time.

---

## The Problem

AI coding agents have increased development velocity.

They have also increased:

- Untraceable architectural decisions
- Undocumented AI influence
- Review ambiguity
- Governance gaps
- Enterprise risk

Most organizations cannot answer:

> Why does this code exist?  
> Was AI involved?  
> Who approved the decision?  
> What risk was acknowledged?

Velocity without accountability is fragile.

---

## The Solution

**ProvenanceCode is a decision-driven development standard for AI-assisted software.**

It defines how teams:

- Capture structured decision records
- Link code to documented intent
- Enforce review checkpoints
- Surface risk and tradeoffs
- Maintain auditability without slowing delivery

ProvenanceCode operates at the pull request layer.

It does not replace tools.  
It governs them.

---

## How It Works

1. **Decision Records**
   - Structured decision artifacts (Decision Evidence Objects)
   - Stored in the repository
   - Linked to code changes

2. **Enforcement Presets**
   - Light
   - Standard
   - Regulated
   - Configurable governance depth

3. **Merge-Time Validation**
   - Pull request hooks
   - Missing decisions fail validation
   - Unapproved decisions block merge (configurable)

4. **Human-in-the-Loop Control**
   - AI may propose
   - Humans approve
   - Decisions are recorded

---

## Get Started

- Read the Standard: **Standard → Overview**
- Implement enforcement: **Implementation → GitHub Action**
- Product path: **Implementation → GitHub App**

---

ProvenanceCode is developed and maintained by **EmbankAI**.
