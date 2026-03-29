# d�?� GitHub Pages Deployment - Implementation Guide

## TA�m Tắt Vấn Đề

Bạn gặp lỗi liA�n tục do:
1. **Xung đột 2 workflow deployment** (deploy-gh-pages.yml + build-deploy.yml)
2. **Actions versions lỗi thời** (@v5 out of date)
3. **Node.js 24 quA� mới** (gA�y xung đột packages)
4. **Build script quA� phức tạp** (hash naming issues)
5. **Artifact naming dynamics** gA�y mất kết nối giữa build & deploy jobs

---

## d��� IMPLEMENTATION STEPS

### **STEP 1**: XA�a Workflow Lỗi Thời

```bash
# XA�a deploy-gh-pages.yml vA� build-deploy.yml tốt hơn
rm .github/workflows/deploy-gh-pages.yml
```

**LA� do**: Giữ lại `build-deploy.yml` vA� nA� cA�:
- ✅ TA�ch build & deploy jobs
- ✅ Điều kiện rA� rA�ng cho main branch
- ✅ Environment configuration
- ✅ Artifact versioning

---

### **STEP 2**: Cập Nhật Actions Versions

**File**: `.github/workflows/build-deploy.yml`

```yaml
# Change ALL these lines:
FROM:
  - uses: actions/checkout@v5
  - uses: actions/setup-node@v5
  - uses: actions/upload-artifact@v5
  - uses: actions/download-artifact@v5
  - uses: actions/deploy-pages@v4

TO:
  - uses: actions/checkout@v4
  - uses: actions/setup-node@v4
  - uses: actions/upload-artifact@v4
  - uses: actions/download-artifact@v4
  - uses: actions/deploy-pages@v5
```

**Why?**
- v4 = Current stable (v5 deprecated soon)
- v4 has better npm caching
- Better compatibility with Node 20

---

### **STEP 3**: Change Node Version

**File**: `.github/workflows/build-deploy.yml`

```yaml
# Before:
node-version: 24

# After:
node-version: '20'
```

**Why?**
- Node 20 = LTS (Long Term Support)
- 24 = bleeding edge, can have package conflicts
- All dependencies tested on Node 20

---

### **STEP 4**: Simplify Build Script

**File**: `package.json` → Update scripts section:

```json
{
  "scripts": {
    "dev": "vite --mode backend",
    "dev:backend": "vite --mode backend",
    "dev:mock": "vite --mode mock",
    "build": "tsc -b && vite build",
    "build:pages": "npm run build && node scripts/setup-pages.js",
    "lint": "eslint .",
    "preview": "vite preview"
  }
}
```

**Changes**:
- ❌ Removed: Complex inline Node command
- ✅ Added: Separate setup-pages.js script
- ✅ More maintainable & cross-platform compatible

---

### **STEP 5**: Create Setup Pages Script

**File**: `scripts/setup-pages.js`

```javascript
#!/usr/bin/env node
import { copyFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = resolve(fileURLToPath(import.meta.url), '..');
const distDir = resolve(__dirname, '../dist');

try {
  copyFileSync(
    resolve(distDir, 'index.html'),
    resolve(distDir, '404.html')
  );
  console.log('✅ Created 404.html');

  writeFileSync(resolve(distDir, '.nojekyll'), '');
  console.log('✅ Created .nojekyll');

  console.log('d�?� Setup complete');
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
```

---

### **STEP 6**: Update Workflow - Fix Artifact Naming

**File**: `.github/workflows/build-deploy.yml`

**In BUILD JOB - Remove these lines**:
```yaml
# ❌ Remove this entire step:
- name: Set artifact name
  id: set-artifact
  run: echo "name=dist-${{ github.run_number }}" >> $GITHUB_OUTPUT

- name: Generate build info
  run: |
    echo "Build Info:" > build-info.txt
    ...

- name: Upload build info
  uses: actions/upload-artifact@v5
  ...

# ❌ Remove this line from Upload artifact step:
- name: Disable Jekyll processing
  run: touch ./dist/.nojekyll
```

**Replace with**:
```yaml
- name: Upload Pages artifact
  uses: actions/upload-artifact@v4
  with:
    name: pages-build    # ← Simple name (not dynamic)
    path: ./dist
    retention-days: 7
```

**In DEPLOY JOB - Update**:
```yaml
# Before:
- name: Download artifact
  uses: actions/download-artifact@v5
  with:
    name: ${{ needs.build.outputs.artifact-name }}
    path: ./dist

# After:
- name: Download artifact
  uses: actions/download-artifact@v4
  with:
    name: pages-build    # ← Same name as build job
    path: ./dist
```

---

### **STEP 7**: Full Updated Workflow File

**Use this complete file**: `.github/workflows/build-deploy.yml`

```yaml
name: Build & Deploy

on:
  push:
    branches:
      - main
      - develop
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: deploy-${{ github.ref }}
  cancel-in-progress: false

jobs:
  build:
    name: Build for Deployment
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Build application for GitHub Pages
        run: npm run build:pages

      - name: Upload Pages artifact
        uses: actions/upload-artifact@v4
        with:
          name: pages-build
          path: ./dist
          retention-days: 7

  deploy-pages:
    name: Deploy to GitHub Pages
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    runs-on: ubuntu-latest
    needs: build
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Pages
        uses: actions/configure-pages@v5

      - name: Download artifact
        uses: actions/download-artifact@v4
        with:
          name: pages-build
          path: ./dist

      - name: Upload Pages artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v5

      - name: Deployment Status
        if: always()
        run: |
          if [ "${{ job.status }}" = "success" ]; then
            echo "✅ Deployment Successful - ${{ steps.deployment.outputs.page_url }}"
          else
            echo "❌ Deployment Failed"
            exit 1
          fi
```

---

## d��� Test Locally First

```bash
cd e:\Workspace\project\pronaflow\apps\frontend

# 1. Build for pages
npm run build:pages

# 2. Verify files
dir dist\
dir dist\404.html          # Must exist
dir dist\.nojekyll         # Must exist
dir dist\index.html        # Must exist

# 3. Preview
npm run preview

# 4. Open in browser: http://localhost:4173
```

**Expected output**:
```
✅ Created 404.html
✅ Created .nojekyll
d�?� Setup complete
```

---

## d��� Quick Deployment Checklist

```
Apply Changes:
[ ] Delete .github/workflows/deploy-gh-pages.yml
[ ] Update .github/workflows/build-deploy.yml (use fixed version)
[ ] Update package.json (simplify build:pages)
[ ] Create scripts/setup-pages.js
[ ] Test locally: npm run build:pages
[ ] Verify dist/ folder has 404.html & .nojekyll

Commit & Push:
[ ] git add -A
[ ] git commit -m "fix: GitHub Pages deployment workflow"
[ ] git push origin main

Monitor:
[ ] Go to GitHub repo → Actions tab
[ ] Watch "Build & Deploy" workflow run
[ ] Check GitHub Pages deployment status in Settings → Pages
```

---

## ✅ How to Apply These Changes

### Option A: Manual (Recommended - understand each change)
1. Edit `.github/workflows/build-deploy.yml` manually
2. Apply each STEP from above
3. Test locally
4. Commit & push

### Option B: Automated (Quick)
```bash
# Use the fixed files provided in WORKFLOW_ERRORS_DIAGNOSIS.md
# Replace your current workflow files with them
```

---

## d��� Verification After Deploy

After pushing to main:

1. **GitHub Actions Tab**:
   - ✅ Workflow should complete in ~2-3 minutes
   - ✅ Both "Build for Deployment" & "Deploy to GitHub Pages" jobs succeed

2. **GitHub Pages Settings**:
   - Go to: Settings → Pages
   - Should show: "Your site is live at https://username.github.io/pronaflow"

3. **Test Site**:
   - Visit your GitHub Pages URL
   - Test navigation (SPA routing should work thanks to 404.html)

---

## d�?� Common Errors & Fixes

| Error | Cause | Solution |
|-------|-------|----------|
| `npm ERR! ci can only install exact versions` | Package-lock.json mismatch | Run `npm ci --force` or delete lock file |
| `tsc: command not found` | TypeScript not installed | Run `npm install` |
| `Could not find dist` | Build failed | Check build output for errors |
| `Artifact not found` | Name mismatch | Verify artifact names match (pages-build) |
| `GitHub Pages not enabled` | Settings issue | Enable in repo Settings → Pages |

---

## d��? Debug Logs

To see detailed error logs:

1. Go to repo GitHub → **Actions** tab
2. Click the failed workflow run
3. Expand each failed step
4. Look for error messages

---

## d�?� Next Steps

1. **Backup current workflow**: `cp build-deploy.yml build-deploy.yml.backup`
2. **Apply changes** from STEP 1-7
3. **Test locally**: `npm run build:pages`
4. **Commit & Push**
5. **Monitor** GitHub Actions
6. **Verify** deployment

---

**Done!** Your GitHub Pages deployment should now work smoothly. d�?�