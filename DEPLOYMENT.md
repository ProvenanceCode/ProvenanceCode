# GitHub Pages Deployment Checklist

Follow this checklist to deploy your ProvenanceCode documentation to GitHub Pages.

## ✅ Pre-Deployment Checklist

### 1. Repository Setup
- [ ] Repository exists on GitHub
- [ ] You have admin/write access to the repository
- [ ] Repository is public (or you have GitHub Pro for private pages)

### 2. File Verification
- [ ] `mkdocs.yml` exists and is properly configured
- [ ] All documentation files in `docs/` directory exist
- [ ] `.github/workflows/docs.yml` workflow file exists
- [ ] `requirements.txt` exists with dependencies
- [ ] `.gitignore` includes `site/` directory

### 3. Configuration Check

Open `mkdocs.yml` and verify:
```yaml
site_name: ProvenanceCode
site_url: https://<your-username>.github.io/<your-repo>/
repo_url: https://github.com/<your-username>/<your-repo>
```

**Update these URLs** to match your GitHub username and repository name!

## 🚀 Deployment Steps

### Step 1: Update Configuration

1. Edit `mkdocs.yml`:
   ```bash
   nano mkdocs.yml
   ```

2. Update these lines with your info:
   ```yaml
   site_url: https://yourusername.github.io/yourrepo/
   repo_url: https://github.com/yourusername/yourrepo
   repo_name: yourusername/yourrepo
   ```

### Step 2: Commit Changes

```bash
# Add all files
git add .

# Commit with a meaningful message
git commit -m "Configure GitHub Pages deployment"

# Push to GitHub
git push origin main
```

### Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** (top menu)
3. Click **Pages** (left sidebar)
4. Under "Build and deployment":
   - Source: **Deploy from a branch**
   - Branch: Select **gh-pages** and **/ (root)**
   - Click **Save**

### Step 4: Trigger Initial Deployment

**Option A: Automatic (Recommended)**
- The workflow will automatically trigger on push to `main`
- Wait 2-3 minutes for the action to complete

**Option B: Manual Trigger**
1. Go to **Actions** tab
2. Click "Deploy Documentation to GitHub Pages"
3. Click **Run workflow** → **Run workflow**

### Step 5: Verify Deployment

1. Go to **Actions** tab
2. Check that the workflow completed successfully (green checkmark ✅)
3. Visit your site: `https://<username>.github.io/<repository>/`

## 🔄 Ongoing Updates

After initial setup, deployments are automatic:

1. Make changes to documentation files
2. Commit and push to `main` branch:
   ```bash
   git add docs/
   git commit -m "Update documentation"
   git push origin main
   ```
3. GitHub Actions automatically rebuilds and deploys
4. Changes appear in 2-3 minutes

## 🐛 Troubleshooting

### Issue: Workflow Fails

**Check the logs:**
1. Go to **Actions** tab
2. Click on the failed workflow run
3. Click on the "deploy" job
4. Review error messages

**Common solutions:**
- Ensure all files referenced in `mkdocs.yml` nav exist
- Check YAML syntax is valid
- Verify Python dependencies are correct

### Issue: 404 Page Not Found

**Possible causes:**
- GitHub Pages not enabled → Go to Settings → Pages
- Wrong branch selected → Should be `gh-pages`
- Deployment not complete → Check Actions tab
- Incorrect site_url → Update `mkdocs.yml`

**Fix:**
1. Check repository Settings → Pages
2. Ensure "Source" is set to `gh-pages` branch
3. Wait 5 minutes and refresh
4. Clear browser cache

### Issue: Styles/Theme Not Loading

**Check:**
- `mkdocs-material` in requirements.txt
- Workflow installs dependencies correctly
- No errors in Actions logs

**Fix:**
```bash
# Update requirements.txt
echo "mkdocs-material>=9.5.3" > requirements.txt
git add requirements.txt
git commit -m "Update mkdocs-material version"
git push origin main
```

### Issue: Changes Not Appearing

**Wait time:** GitHub Pages can take 2-5 minutes to update

**Force refresh:**
- Chrome/Firefox: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
- Clear browser cache

**Verify deployment:**
```bash
# Check that workflow completed
# Check the gh-pages branch was updated
git fetch origin gh-pages
git log origin/gh-pages -1
```

## 📊 Monitoring

### Check Deployment Status

**Via GitHub UI:**
- Green checkmark ✅ = Deployed successfully
- Red X ❌ = Deployment failed
- Yellow dot 🟡 = Deployment in progress

**Via Command Line:**
```bash
# Check recent workflow runs
gh run list --workflow=docs.yml --limit 5

# Watch a specific run
gh run watch <run-id>
```

### View Build Logs

```bash
# Get latest workflow run
gh run view --log

# Or visit Actions tab on GitHub
```

## 🎯 Best Practices

1. **Test locally first:**
   ```bash
   mkdocs serve
   # Preview at http://127.0.0.1:8000
   ```

2. **Commit frequently:**
   - Small, focused commits
   - Clear commit messages
   - Reference issues/PRs

3. **Review before pushing:**
   - Check for broken links
   - Verify markdown formatting
   - Test code examples

4. **Monitor deployments:**
   - Watch Actions tab after pushing
   - Verify changes on live site
   - Keep an eye on build times

## 🔐 Security Notes

- GitHub Actions secrets are managed by repository settings
- The `GITHUB_TOKEN` is automatically provided
- Workflow has `contents: write` permission for deployment
- All builds run in isolated containers

## 📈 Performance Tips

1. **Image optimization:**
   - Use compressed images
   - Serve appropriate sizes
   - Consider using WebP format

2. **Caching:**
   - Workflow includes pip caching
   - GitHub Pages has built-in CDN
   - Enable browser caching headers

3. **Build optimization:**
   - Remove unused plugins
   - Minimize custom CSS/JS
   - Use Material theme efficiently

## 🎓 Next Steps

Once deployed:
- [ ] Share your documentation URL
- [ ] Set up custom domain (optional)
- [ ] Add analytics (optional)
- [ ] Configure SEO metadata
- [ ] Create a CNAME file for custom domain

## 📞 Support

- **MkDocs Issues:** https://github.com/mkdocs/mkdocs/issues
- **Material Theme:** https://github.com/squidfunk/mkdocs-material/issues
- **GitHub Pages:** https://docs.github.com/en/pages

---

**Ready to deploy?** Start with Step 1 above! 🚀

