# d??? GitHub Pages Deployment - Workflow Issues & Solutions

## d??? V?n �? ChA?nh

### 1. **Conflict gi?a 2 Workflow Deployment** ????
- **V? trA?**: `deploy-gh-pages.yml` vA? `build-deploy.yml`
- **L?i**: C? hai workflow d?u ch?y trA?n branch `main`, gA?y xung d?t
- **Tri?u ch?ng**: Deployment liA?n t?c l?i ho?c khA?ng hoA?n thA?nh

```
deploy-gh-pages.yml  ? Tri?n khai tr?c ti?p
build-deploy.yml     ? Tri?n khai v?i artifact naming d?ng
? Xung d?t!
```

**Gi?i phA?p**: Gi? 1 workflow, xA?a cA?i kia.

---

### 2. **PhiA?n b?n GitHub Actions L?i th?i** d???
- **V?n d?**: S? d?ng `@v5` khi cA? `@v6` ho?c `@v7` m?i hon
- **?nh hu?ng**:
  - `actions/checkout@v5` ? L?i tuong thA?ch
  - `actions/setup-node@v5` ? Cache NPM khA?ng ho?t d?ng t?t
  - `actions/deploy-pages@v4` ? Deprecated

**C?n c?p nh?t**:
```yaml
# ? Cu
actions/checkout@v5
actions/setup-node@v5
actions/deploy-pages@v4

# ? M?i
actions/checkout@v4
actions/setup-node@v4
actions/deploy-pages@v5
```

---

### 3. **Node.js PhiA?n b?n 24 - QuA? M?i** d???
- **V?n d?**: Node 24 cA? th? gA?y xung d?t v?i cA?c package cu
- **KhuyA?n dA?ng**: Node 20 LTS

```yaml
# ? Hi?n t?i
node-version: 24

# ? KhuyA?n dA?ng
node-version: '20'  # LTS - ?n d?nh nh?t
```

---

### 4. **S? KhA?ng Kh?p Artifact Naming** d???
**Trong `build-deploy.yml`**:
```yaml
# Build job
- name: Set artifact name
  id: set-artifact
  run: echo "name=dist-${{ github.run_number }}" >> $GITHUB_OUTPUT

# Upload artifact v?i tA?n d?ng
name: ${{ steps.set-artifact.outputs.name }}  # dist-12345

# Deploy job (c? g?ng download)
- name: Download artifact
  with:
    name: ${{ needs.build.outputs.artifact-name }}  # TA?n lA? dist-12345
```

**V?n d?**: Artifact du?c d?t tA?n `dist-12345` nhung `upload-pages-artifact` c?n content trong `./dist`

---

### 5. **Build Script CA? V?n �?** d????
```bash
npm run build:pages": "tsc -b && vite build && node --input-type=module -e \"...\"
```

**V?n d? ti?m ?n**:
- TypeScript compilation cA? th? l?i (`tsc -b`)
- Command Node.js quA? dA?i, d? l?i trA?n Windows/Linux khA?c nhau
- `.nojekyll` du?c t?o 2 l?n (trong build script + workflow)

---

## ? GI?I PHA?P T?NG BU??C

### **BU??C 1**: XA?a Workflow TrA?ng L?p
```bash
# Gi?: build-deploy.yml (cA? tA?nh nang t?t hon)
# XA?a: deploy-gh-pages.yml
rm .github/workflows/deploy-gh-pages.yml
```

### **BU??C 2**: C?p Nh?t Actions Versions

**File**: `.github/workflows/build-deploy.yml`

Thay th?:
```yaml
# ? Cu
- uses: actions/checkout@v5
- uses: actions/setup-node@v5
- uses: actions/configure-pages@v5
- uses: actions/upload-artifact@v5
- uses: actions/download-artifact@v5
- uses: actions/upload-pages-artifact@v3
- uses: actions/deploy-pages@v4

# ? M?i
- uses: actions/checkout@v4
- uses: actions/setup-node@v4
- uses: actions/configure-pages@v5  # (v5 OK)
- uses: actions/upload-artifact@v4
- uses: actions/download-artifact@v4
- uses: actions/upload-pages-artifact@v3  # (v3 OK)
- uses: actions/deploy-pages@v5
```

### **BU??C 3**: �?i Node Version
```yaml
# ? Cu
node-version: 24

# ? M?i
node-version: '20'
```

### **BU??C 4**: S?a Artifact Naming Issue

**V?n d?**: Deploy job khA?ng tA?m th?y artifact

**Gi?i phA?p**: S? d?ng tA?n don gi?n
```yaml
# Trong build job - s?a
- name: Upload artifact
  uses: actions/upload-artifact@v4
  with:
    name: dist  # ? TA?n don gi?n, khA?ng cA? s? run
    path: ./dist

# Trong deploy job - s?a
- name: Download artifact
  uses: actions/download-artifact@v4
  with:
    name: dist  # ? TA?n kh?p
    path: ./dist
```

### **BU??C 5**: S?a Build Script

**File**: `package.json`

Thay th?:
```json
// ? Cu
"build:pages": "tsc -b && vite build && node --input-type=module -e \"import { copyFileSync, writeFileSync } from 'node:fs'; copyFileSync('dist/index.html', 'dist/404.html'); writeFileSync('dist/.nojekyll', '');\"",

// ? M?i (s?ch & an toA?n)
"build:pages": "npm run build && npm run setup:pages",
"setup:pages": "node scripts/setup-pages.js",

// Ho?c don gi?n hon:
"build:pages": "tsc -b && vite build && node -e \"const fs=require('fs');fs.copyFileSync('dist/index.html','dist/404.html');fs.writeFileSync('dist/.nojekyll','');\"",
```

**T?o file**: `scripts/setup-pages.js`
```javascript
import { copyFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const distDir = resolve('dist');
copyFileSync(resolve(distDir, 'index.html'), resolve(distDir, '404.html'));
writeFileSync(resolve(distDir, '.nojekyll'), '');
console.log('? Pages setup completed');
```

### **BU??C 6**: XA?a `.nojekyll` Duplicate

**Trong workflow** `build-deploy.yml`, xA?a:
```yaml
# ? XA?a dA?ng nA?y (vA? build script dA? t?o)
- name: Disable Jekyll processing
  run: touch ./dist/.nojekyll
```

---

## d??? Checklist Deployment Workflow

```
[ ] XA?a deploy-gh-pages.yml
[ ] C?p nh?t actions versions (v4 -> v5)
[ ] �?i Node t? 24 ? 20
[ ] G?i build:pages script don gi?n
[ ] Fix artifact naming (khA?ng d?ng)
[ ] XA?a .nojekyll duplicate
[ ] Test locally: npm run build:pages
[ ] Commit & Push ? GitHub
[ ] Ki?m tra workflow runs
```

---

## d??? Test Tru?c Deploy

```bash
# 1. Test build locally
npm run build:pages

# 2. Ki?m tra dist folder
ls -la dist/
ls -la dist/404.html  # Ph?i t?n t?i
ls -la dist/.nojekyll # Ph?i t?n t?i

# 3. Preview build
npm run preview

# 4. Commit changes
git add -A
git commit -m "fix: GitHub Pages deployment workflow"
git push origin main
```

---

## d??? N?u V?n L?i

### Ki?m tra GitHub Actions Logs:
1. VA?o **Settings** ? **Pages**
2. Xem **"Deployments"** ? Ki?m tra l?i c? th?
3. Xem chi ti?t t?ng step trong workflow

### L?i Ph? Bi?n:
```
? "Could not find dist" 
? Build b? l?i, ki?m tra npm run build:pages locally

? "Artifact not found"
? TA?n artifact khA?ng kh?p (xem artifact-name vs name)

? "GitHub Pages not enabled"
? VA?o Settings ? Pages, ch?n "Deploy from a branch"

? "No files were uploaded"
? dist folder r?ng, check build output
```

---

## d??? LiA?n H? H? Tr?

N?u v?n d? v?n th?y l?i sau khi A?p d?ng, c?n ki?m tra:
- [ ] GitHub Pages settings
- [ ] Permissions c?a token
- [ ] Build dependencies (package-lock.json)
- [ ] TypeScript config errors (`tsc -b`)