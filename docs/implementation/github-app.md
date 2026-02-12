# GitHub App Implementation

**Version:** 1.0.0  
**Status:** Draft  
**Part of:** ProvenanceCode Open Standard

## Abstract

This document describes how to build a GitHub App that implements ProvenanceCode validation. This is a **more advanced implementation path** compared to GitHub Actions, providing features like proactive decision draft creation, team-based access control, and cross-repository validation.

## Commercial Implementation Available

**[ProvenanceCode App by EmbankAI (KDDLC AI Solutions SL)](https://embank.ai/provenancecode)** is a fully-managed commercial GitHub App that implements this specification. It provides:

- ✅ Zero-setup installation
- ✅ Automatic decision draft creation
- ✅ Team-based access controls
- ✅ Cross-repository validation
- ✅ Web UI for decision management
- ✅ Enterprise support
- ✅ SOC 2 compliant hosting

**Pricing:** Free for open source, paid plans for private repos.

If you prefer to **build your own implementation**, this guide provides the technical details.

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Prerequisites](#prerequisites)
4. [GitHub App Setup](#github-app-setup)
5. [Server Implementation](#server-implementation)
6. [Webhook Handling](#webhook-handling)
7. [Validation Logic](#validation-logic)
8. [UI Integration](#ui-integration)
9. [Access Control](#access-control)
10. [Deployment](#deployment)
11. [Advanced Features](#advanced-features)

## Overview

A GitHub App provides a more integrated ProvenanceCode experience compared to GitHub Actions:

### GitHub App vs GitHub Actions

| Feature | GitHub Actions | GitHub App |
|---------|---------------|------------|
| **Validation on PR** | ✅ Yes | ✅ Yes |
| **PR Comments** | ✅ Yes | ✅ Yes |
| **Status Checks** | ✅ Yes | ✅ Yes |
| **Auto-draft Creation** | ⚠️ Limited | ✅ Yes |
| **Cross-repo Validation** | ❌ No | ✅ Yes |
| **Web UI for Decisions** | ❌ No | ✅ Yes |
| **Team-based Access** | ❌ No | ✅ Yes |
| **OAuth Integration** | ❌ No | ✅ Yes |
| **Real-time Notifications** | ❌ No | ✅ Yes |
| **Setup Complexity** | Low | Medium |
| **Hosting Required** | No | Yes |

### When to Use GitHub App

Choose a GitHub App when you need:
- **Proactive assistance** - Auto-create decision drafts
- **Cross-repository** - Validate decisions across multiple repos
- **Web UI** - Browse and edit decisions in a web interface
- **Advanced access control** - Team-based permissions
- **Real-time features** - Live validation feedback

## Architecture

### Components

```
┌─────────────────────────────────────────────────────────────┐
│                        GitHub                               │
│  ┌──────────────┐         ┌──────────────┐                │
│  │  Repository  │◄────────┤  GitHub App  │                │
│  │              │         │              │                │
│  │  - PRs       │         │  - Installed │                │
│  │  - Webhooks  │         │  - Permissions│               │
│  └──────┬───────┘         └──────────────┘                │
│         │                                                   │
└─────────┼───────────────────────────────────────────────────┘
          │ Webhooks
          ↓
┌─────────────────────────────────────────────────────────────┐
│                   ProvenanceCode Server                     │
│                                                             │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐ │
│  │   Webhook    │───→│  Validator   │───→│   GitHub     │ │
│  │   Handler    │    │   Engine     │    │   API        │ │
│  └──────────────┘    └──────────────┘    └──────────────┘ │
│                                                             │
│  ┌──────────────┐    ┌──────────────┐                     │
│  │   Web UI     │    │   Database   │                     │
│  │  (Optional)  │    │  (Optional)  │                     │
│  └──────────────┘    └──────────────┘                     │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **PR Created** → GitHub sends webhook to server
2. **Server receives** webhook → Extracts PR data
3. **Validator runs** → Checks for required decisions/specs/risks
4. **Results returned** → Posted as PR comment and status check
5. **User updates** PR → Process repeats

## Prerequisites

### Required

1. **Hosting Environment**
   - Node.js 18+ server
   - Public HTTPS endpoint
   - Port 443 or custom port

2. **GitHub Account**
   - Admin access to organization/repo
   - Ability to create GitHub Apps

3. **ProvenanceCode Setup**
   - Repository with provenance structure
   - Configuration files in place

### Recommended

- **Domain name** with SSL certificate
- **Monitoring** and logging system
- **Database** for caching (optional)
- **Redis** for session management (optional)

## GitHub App Setup

### Step 1: Create GitHub App

1. Go to **Settings** → **Developer settings** → **GitHub Apps** → **New GitHub App**

2. **Basic Information:**
   - **Name:** `ProvenanceCode Validator`
   - **Homepage URL:** `https://your-domain.com`
   - **Webhook URL:** `https://your-domain.com/webhooks`
   - **Webhook secret:** Generate a random secret (save it)

3. **Permissions:**

   **Repository permissions:**
   - Contents: `Read-only` (read decision files)
   - Pull requests: `Read & write` (comment and status)
   - Checks: `Read & write` (create check runs)
   - Metadata: `Read-only` (repo info)

   **Organization permissions (optional):**
   - Members: `Read-only` (for team-based access)

4. **Subscribe to events:**
   - ✅ Pull request
   - ✅ Pull request review
   - ✅ Push (for decision file changes)

5. **Where can this GitHub App be installed?**
   - Choose **Only on this account** or **Any account**

6. **Create GitHub App**

### Step 2: Generate Private Key

1. After creation, scroll to **Private keys**
2. Click **Generate a private key**
3. Download the `.pem` file (save securely)

### Step 3: Install App

1. Go to **Install App** tab
2. Select your organization/repository
3. Choose **All repositories** or **Select repositories**
4. Click **Install**

### Step 4: Note App Details

Save these values for server configuration:
- **App ID** (from General tab)
- **Installation ID** (from installation URL)
- **Webhook secret** (you generated earlier)
- **Private key** (the `.pem` file)

## Server Implementation

### Basic Server Setup

**File: `server.js`**

```javascript
const express = require('express');
const { App } = require('@octokit/app');
const { Octokit } = require('@octokit/rest');
const crypto = require('crypto');

const app = express();
const port = process.env.PORT || 3000;

// GitHub App configuration
const APP_ID = process.env.GITHUB_APP_ID;
const PRIVATE_KEY = process.env.GITHUB_PRIVATE_KEY;
const WEBHOOK_SECRET = process.env.GITHUB_WEBHOOK_SECRET;

// Initialize Octokit App
const githubApp = new App({
  appId: APP_ID,
  privateKey: PRIVATE_KEY,
});

// Middleware
app.use(express.json());

// Webhook verification middleware
function verifyWebhook(req, res, next) {
  const signature = req.headers['x-hub-signature-256'];
  const payload = JSON.stringify(req.body);
  
  const hmac = crypto.createHmac('sha256', WEBHOOK_SECRET);
  const digest = 'sha256=' + hmac.update(payload).digest('hex');
  
  if (signature === digest) {
    next();
  } else {
    res.status(401).send('Invalid signature');
  }
}

// Webhook endpoint
app.post('/webhooks', verifyWebhook, async (req, res) => {
  const event = req.headers['x-github-event'];
  const payload = req.body;
  
  console.log(`Received ${event} event`);
  
  try {
    if (event === 'pull_request') {
      await handlePullRequest(payload);
    }
    
    res.status(200).send('OK');
  } catch (error) {
    console.error('Error handling webhook:', error);
    res.status(500).send('Error');
  }
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.listen(port, () => {
  console.log(`ProvenanceCode server listening on port ${port}`);
});
```

### Installation

```bash
npm init -y
npm install express @octokit/app @octokit/rest dotenv
```

### Environment Variables

Create `.env`:

```bash
GITHUB_APP_ID=123456
GITHUB_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----"
GITHUB_WEBHOOK_SECRET=your-webhook-secret
PORT=3000
```

**Load in server:**

```javascript
require('dotenv').config();
```

## Webhook Handling

### Pull Request Handler

```javascript
async function handlePullRequest(payload) {
  const { action, pull_request, repository, installation } = payload;
  
  // Only process opened, synchronize, reopened
  if (!['opened', 'synchronize', 'reopened'].includes(action)) {
    return;
  }
  
  console.log(`Processing PR #${pull_request.number} in ${repository.full_name}`);
  
  // Get installation client
  const octokit = await githubApp.getInstallationOctokit(installation.id);
  
  // Fetch decision files from repo
  const decisions = await fetchDecisions(octokit, repository, pull_request);
  
  // Run validation
  const results = await validateProvenanceCode(
    octokit,
    repository,
    pull_request,
    decisions
  );
  
  // Post results
  await postValidationResults(octokit, repository, pull_request, results);
  
  // Create status check
  await createStatusCheck(octokit, repository, pull_request, results);
}
```

### Fetch Decision Files

```javascript
async function fetchDecisions(octokit, repository, pull_request) {
  const { owner, repo } = repository;
  const ref = pull_request.head.ref;
  
  try {
    // List decisions directory
    const { data: contents } = await octokit.rest.repos.getContent({
      owner: owner.login,
      repo: repo.name,
      path: 'provenance/decisions',
      ref: ref
    });
    
    const decisions = [];
    
    for (const item of contents) {
      if (item.type === 'dir' && /^DEC-\d{6}$/.test(item.name)) {
        // Fetch decision.json
        try {
          const { data: file } = await octokit.rest.repos.getContent({
            owner: owner.login,
            repo: repo.name,
            path: `${item.path}/decision.json`,
            ref: ref
          });
          
          const content = Buffer.from(file.content, 'base64').toString('utf8');
          const decision = JSON.parse(content);
          
          decisions.push({
            id: item.name,
            path: item.path,
            data: decision
          });
        } catch (err) {
          console.error(`Failed to fetch ${item.name}/decision.json:`, err.message);
        }
      }
    }
    
    return decisions;
  } catch (error) {
    console.error('Error fetching decisions:', error);
    return [];
  }
}
```

## Validation Logic

### Core Validator

```javascript
async function validateProvenanceCode(octokit, repository, pull_request, decisions) {
  const results = {
    valid: true,
    errors: [],
    warnings: [],
    decisions: {
      found: decisions.length,
      required: 0,
      list: decisions
    },
    specs: {
      found: 0,
      required: 0,
      list: []
    },
    risks: {
      found: 0,
      required: 0,
      list: []
    }
  };
  
  // Load config
  const config = await loadConfig(octokit, repository, pull_request);
  
  // Get changed files
  const changedFiles = await getChangedFiles(octokit, repository, pull_request);
  
  // Check if decision required
  const requiresDecision = checkDecisionRequired(config, changedFiles, pull_request);
  
  if (requiresDecision) {
    results.decisions.required = 1;
    
    if (decisions.length === 0) {
      results.valid = false;
      results.errors.push('Decision required but none found');
    } else {
      // Validate decision format
      for (const decision of decisions) {
        const validation = validateDecisionFormat(decision.data);
        if (!validation.valid) {
          results.valid = false;
          results.errors.push(`${decision.id}: ${validation.error}`);
        }
      }
      
      // Check PR link
      const hasValidPRLink = decisions.some(dec => 
        dec.data.links?.pr?.includes(String(pull_request.number)) ||
        dec.data.links?.pr?.includes(pull_request.html_url)
      );
      
      if (!hasValidPRLink) {
        results.warnings.push('Decision should reference this PR in links.pr');
      }
    }
  }
  
  // Similar checks for specs and risks...
  
  return results;
}

function checkDecisionRequired(config, changedFiles, pull_request) {
  // Check paths
  for (const file of changedFiles) {
    for (const path of config.requireDecisionOnPaths || []) {
      if (file.startsWith(path)) {
        return true;
      }
    }
  }
  
  // Check labels
  const labels = pull_request.labels.map(l => l.name);
  for (const label of labels) {
    if (config.requireDecisionOnLabels?.includes(label)) {
      return true;
    }
  }
  
  return false;
}

function validateDecisionFormat(decision) {
  const required = ['schema', 'id', 'title', 'version', 'lifecycle', 'timestamps', 'actors', 'outcome', 'rationale', 'risk'];
  
  for (const field of required) {
    if (!decision[field]) {
      return { valid: false, error: `Missing required field: ${field}` };
    }
  }
  
  // Validate ID format
  if (!/^DEC-\d{6}$/.test(decision.id)) {
    return { valid: false, error: 'Invalid ID format (must be DEC-XXXXXX)' };
  }
  
  return { valid: true };
}
```

### Get Changed Files

```javascript
async function getChangedFiles(octokit, repository, pull_request) {
  const { owner, repo } = repository;
  
  const { data: files } = await octokit.rest.pulls.listFiles({
    owner: owner.login,
    repo: repo.name,
    pull_number: pull_request.number
  });
  
  return files.map(f => f.filename);
}
```

## Post Results

### PR Comment

```javascript
async function postValidationResults(octokit, repository, pull_request, results) {
  const { owner, repo } = repository;
  
  let body = '## ProvenanceCode Validation Results\n\n';
  
  if (results.valid) {
    body += '✅ **All checks passed**\n\n';
  } else {
    body += '❌ **Validation failed**\n\n';
  }
  
  body += '### Summary\n\n';
  body += `- **Decisions:** ${results.decisions.found}/${results.decisions.required}\n`;
  body += `- **Specs:** ${results.specs.found}/${results.specs.required}\n`;
  body += `- **Risks:** ${results.risks.found}/${results.risks.required}\n\n`;
  
  if (results.decisions.list.length > 0) {
    body += '### Decisions Found\n\n';
    results.decisions.list.forEach(dec => {
      body += `- [${dec.id}](https://github.com/${owner.login}/${repo.name}/blob/${pull_request.head.ref}/${dec.path}/decision.json) - ${dec.data.title}\n`;
    });
    body += '\n';
  }
  
  if (results.errors.length > 0) {
    body += '### Errors\n\n';
    results.errors.forEach(err => body += `- ❌ ${err}\n`);
    body += '\n';
  }
  
  if (results.warnings.length > 0) {
    body += '### Warnings\n\n';
    results.warnings.forEach(warn => body += `- ⚠️ ${warn}\n`);
    body += '\n';
  }
  
  body += '---\n';
  body += '*Validated by [ProvenanceCode](https://provenancecode.org)*';
  
  // Find or create comment
  const { data: comments } = await octokit.rest.issues.listComments({
    owner: owner.login,
    repo: repo.name,
    issue_number: pull_request.number
  });
  
  const existingComment = comments.find(c => 
    c.user.type === 'Bot' && 
    c.body.includes('ProvenanceCode Validation Results')
  );
  
  if (existingComment) {
    await octokit.rest.issues.updateComment({
      owner: owner.login,
      repo: repo.name,
      comment_id: existingComment.id,
      body
    });
  } else {
    await octokit.rest.issues.createComment({
      owner: owner.login,
      repo: repo.name,
      issue_number: pull_request.number,
      body
    });
  }
}
```

### Status Check

```javascript
async function createStatusCheck(octokit, repository, pull_request, results) {
  const { owner, repo } = repository;
  
  await octokit.rest.repos.createCommitStatus({
    owner: owner.login,
    repo: repo.name,
    sha: pull_request.head.sha,
    state: results.valid ? 'success' : 'failure',
    context: 'ProvenanceCode',
    description: results.valid ? 'All checks passed' : 'Validation failed',
    target_url: 'https://your-domain.com/results'
  });
}
```

## UI Integration

### Decision Viewer (Optional)

Provide a web UI to browse decisions:

```javascript
app.get('/decisions/:owner/:repo', async (req, res) => {
  const { owner, repo } = req.params;
  
  // Fetch decisions from GitHub
  const decisions = await fetchAllDecisions(owner, repo);
  
  res.render('decisions', { decisions, owner, repo });
});
```

### OAuth Authentication

For secure access:

```javascript
const { createOAuthAppAuth } = require('@octokit/auth-oauth-app');

app.get('/auth/login', (req, res) => {
  const url = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${CALLBACK_URL}`;
  res.redirect(url);
});

app.get('/auth/callback', async (req, res) => {
  const { code } = req.query;
  
  // Exchange code for token
  const auth = createOAuthAppAuth({
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET
  });
  
  const { token } = await auth({
    type: 'oauth-user',
    code
  });
  
  // Store token in session
  req.session.token = token;
  res.redirect('/dashboard');
});
```

## Access Control

### Team-Based Permissions

```javascript
async function checkAccess(octokit, user, repository, action) {
  const config = await loadConfig(octokit, repository);
  
  if (action === 'edit') {
    // Check if user is in editorTeams
    for (const team of config.access.editorTeams) {
      const isMember = await checkTeamMembership(octokit, user, team);
      if (isMember) return true;
    }
  }
  
  if (action === 'view') {
    // Check if user is in viewerTeams
    for (const team of config.access.viewerTeams) {
      const isMember = await checkTeamMembership(octokit, user, team);
      if (isMember) return true;
    }
  }
  
  return false;
}
```

## Deployment

### Option 1: Heroku

```bash
heroku create provenance code-validator
heroku config:set GITHUB_APP_ID=123456
heroku config:set GITHUB_PRIVATE_KEY="$(cat private-key.pem)"
heroku config:set GITHUB_WEBHOOK_SECRET=your-secret
git push heroku main
```

### Option 2: Docker

**Dockerfile:**

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
```

**Deploy:**

```bash
docker build -t provenancecode-validator .
docker run -p 3000:3000 --env-file .env provenancecode-validator
```

### Option 3: Cloud Run (GCP)

```bash
gcloud run deploy provenancecode-validator \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

## Advanced Features

### Auto-Create Decision Drafts

When validation fails, automatically create a draft:

```javascript
async function createDecisionDraft(octokit, repository, pull_request) {
  const nextId = await getNextDecisionId(octokit, repository);
  
  const draft = {
    schema: 'provenancecode.decision.v1',
    id: nextId,
    title: pull_request.title,
    version: 1,
    lifecycle: { state: 'draft' },
    timestamps: { created_at: new Date().toISOString() },
    actors: { author: pull_request.user.login },
    outcome: 'TODO: Document decision',
    rationale: 'TODO: Explain rationale',
    risk: { level: 'low' },
    links: { pr: [String(pull_request.number)] }
  };
  
  // Create PR with draft
  await octokit.rest.pulls.create({
    owner: repository.owner.login,
    repo: repository.name,
    title: `Add decision draft ${nextId}`,
    head: `decision-draft-${nextId}`,
    base: repository.default_branch,
    body: `Auto-generated decision draft for PR #${pull_request.number}`
  });
}
```

## Next Steps

1. **Set up GitHub App** following the setup section
2. **Deploy server** to your hosting environment
3. **Install app** on your repositories
4. **Test with PR** that requires decisions
5. **Monitor logs** and iterate

## Related Documentation

- [GitHub Actions Implementation](github-action.md) - Simpler alternative
- [Enforcement Policies](../standard/enforcement.md) - Configure validation
- [Getting Started](../guides/01-Getting-Started.md) - Initial setup

---

**References:**
- [GitHub Apps Documentation](https://docs.github.com/en/apps)
- [Octokit.js](https://octokit.github.io/rest.js/)
- [Probot Framework](https://probot.github.io/) - Alternative app framework

