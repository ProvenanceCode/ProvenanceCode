# ProvenanceCode Documentation

Decision-Driven Development for the AI Era - Official Documentation Site

## 🚀 Deployment to GitHub Pages

This documentation site is automatically deployed to GitHub Pages using GitHub Actions.

### Prerequisites

- A GitHub repository
- GitHub Pages enabled in repository settings
- Write access to the repository

### Automated Deployment Setup

1. **Enable GitHub Pages** in your repository:
   - Go to **Settings** → **Pages**
   - Under "Build and deployment", select **Deploy from a branch**
   - Choose the `gh-pages` branch
   - Click **Save**

2. **Push your changes** to the `main` branch:
   ```bash
   git add .
   git commit -m "Setup GitHub Pages deployment"
   git push origin main
   ```

3. **The workflow will automatically**:
   - Install Python and dependencies
   - Build the MkDocs site
   - Deploy to the `gh-pages` branch
   - Your site will be live at: `https://<username>.github.io/<repository>/`

### Manual Deployment Trigger

You can manually trigger a deployment:
- Go to **Actions** tab
- Select "Deploy Documentation to GitHub Pages"
- Click **Run workflow**

## 🔧 Local Development

### Installation

1. **Install Python 3.x** (if not already installed)

2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

   Or install directly:
   ```bash
   pip install mkdocs-material
   ```

### Local Server

Start a local development server with live reload:

```bash
mkdocs serve
```

The site will be available at `http://127.0.0.1:8000/`

### Build Locally

Build the static site:

```bash
mkdocs build
```

The built site will be in the `site/` directory.

### Preview Before Deploy

Test the production build:

```bash
mkdocs build --clean
cd site
python -m http.server 8000
```

## 📁 Documentation Structure

```
.
├── docs/
│   ├── index.md                    # Homepage
│   ├── standard/
│   │   ├── index.md               # Standard Overview
│   │   ├── deo.md                 # Decision Evidence Objects
│   │   ├── enforcement.md         # Enforcement Presets
│   │   ├── repo-layout.md         # Repository Layout
│   │   └── versioning.md          # Versioning Guide
│   └── implementation/
│       ├── github-action.md       # GitHub Action docs
│       └── github-app.md          # GitHub App docs
├── mkdocs.yml                      # MkDocs configuration
├── requirements.txt                # Python dependencies
└── .github/
    └── workflows/
        └── docs.yml                # Deployment workflow
```

## ✏️ Adding Content

### Create a New Page

1. Add a markdown file to the `docs/` directory:
   ```bash
   touch docs/new-page.md
   ```

2. Update `mkdocs.yml` navigation:
   ```yaml
   nav:
     - Home: index.md
     - New Page: new-page.md
   ```

3. Write content using [MkDocs Material features](https://squidfunk.github.io/mkdocs-material/reference/)

### Markdown Extensions

The site supports:
- **Admonitions**: Note boxes and warnings
- **Code blocks**: Syntax highlighting
- **Tables**: GitHub-style tables
- **Footnotes**: Reference notes
- **Table of contents**: Auto-generated

Example admonition:
```markdown
!!! note "Important"
    This is an important note.
```

## 🔍 Configuration

### Site Settings

Edit `mkdocs.yml` to customize:
- Site name and description
- Repository URL
- Theme settings
- Navigation structure
- Extensions and plugins

### Theme Customization

The site uses [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/). Available features:
- Dark/light mode toggle
- Search functionality
- Code copy buttons
- Navigation sections

## 🐛 Troubleshooting

### Build Fails

Check the GitHub Actions logs:
1. Go to **Actions** tab
2. Click on the failed workflow run
3. Review the error messages

Common issues:
- **Missing file**: Ensure all files referenced in `mkdocs.yml` exist
- **Invalid YAML**: Validate your `mkdocs.yml` syntax
- **Broken links**: Check internal links point to existing pages

### Page Not Found (404)

- Ensure `gh-pages` branch exists
- Check GitHub Pages settings point to `gh-pages` branch
- Verify the site has been deployed (check Actions tab)
- Wait a few minutes for deployment to complete

### Local Server Issues

If `mkdocs serve` fails:
```bash
pip install --upgrade mkdocs-material
```

## 📝 Contributing

To contribute to the documentation:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally with `mkdocs serve`
5. Submit a pull request

## 🔗 Resources

- [MkDocs Documentation](https://www.mkdocs.org/)
- [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [ProvenanceCode Website](https://provenancecode.github.io/ProvenanceCode/)

## 📄 License

The ProvenanceCode standard specification is licensed under [Apache License 2.0](LICENSE).

See [LICENSE](LICENSE) file for details.

## ™ Trademark

**ProvenanceCode™** is a trademark of **KDDLC AI Solutions SL**.

The standard is open (Apache 2.0), but the name is protected to ensure quality and prevent confusion.

See [TRADEMARK.md](TRADEMARK.md) for usage guidelines.

---

**ProvenanceCode** is stewarded by **EmbankAI (KDDLC AI Solutions SL)**.

