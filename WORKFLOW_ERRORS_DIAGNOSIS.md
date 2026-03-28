# 🔴 GitHub Pages Deployment - Workflow Issues & Solutions

## 🎯 Vấn Đề Chính

### 1. **Conflict giữa 2 Workflow Deployment** ⚠️
- **Vị trí**: `deploy-gh-pages.yml` và `build-deploy.yml`
- **Lỗi**: Cả hai workflow đều chạy trên branch `main`, gây xung đột
- **Triệu chứng**: Deployment liên tục lỗi hoặc không hoàn thành

```
deploy-gh-pages.yml  → Triển khai trực tiếp
build-deploy.yml     → Triển khai với artifact naming động
❌ Xung đột!
```

**Giải pháp**: Giữ 1 workflow, xóa cái kia.

---

### 2. **Phiên bản GitHub Actions Lỗi thời** 🚨
- **Vấn đề**: Sử dụng `@v5` khi có `@v6` hoặc `@v7` mới hơn
- **Ảnh hưởng**:
  - `actions/checkout@v5` → Lỗi tương thích
  - `actions/setup-node@v5` → Cache NPM không hoạt động tốt
  - `actions/deploy-pages@v4` → Deprecated

**Cần cập nhật**:
```yaml
# ❌ Cũ
actions/checkout@v5
actions/setup-node@v5
actions/deploy-pages@v4

# ✅ Mới
actions/checkout@v4
actions/setup-node@v4
actions/deploy-pages@v5
```

---

### 3. **Node.js Phiên bản 24 - Quá Mới** 🔧
- **Vấn đề**: Node 24 có thể gây xung đột với các package cũ
- **Khuyên dùng**: Node 20 LTS

```yaml
# ❌ Hiện tại
node-version: 24

# ✅ Khuyên dùng
node-version: '20'  # LTS - ổn định nhất
```

---

### 4. **Sự Không Khớp Artifact Naming** 📦
**Trong `build-deploy.yml`**:
```yaml
# Build job
- name: Set artifact name
  id: set-artifact
  run: echo "name=dist-${{ github.run_number }}" >> $GITHUB_OUTPUT

# Upload artifact với tên động
name: ${{ steps.set-artifact.outputs.name }}  # dist-12345

# Deploy job (cố gắng download)
- name: Download artifact
  with:
    name: ${{ needs.build.outputs.artifact-name }}  # Tên là dist-12345
```

**Vấn đề**: Artifact được đặt tên `dist-12345` nhưng `upload-pages-artifact` cần content trong `./dist`

---

### 5. **Build Script Có Vấn Đề** 🛠️
```bash
npm run build:pages": "tsc -b && vite build && node --input-type=module -e \"...\"
```

**Vấn đề tiềm ẩn**:
- TypeScript compilation có thể lỗi (`tsc -b`)
- Command Node.js quá dài, dễ lỗi trên Windows/Linux khác nhau
- `.nojekyll` được tạo 2 lần (trong build script + workflow)

---

## ✅ GIẢI PHÁP TỪNG BƯỚC

### **BƯỚC 1**: Xóa Workflow Trùng Lặp
```bash
# Giữ: build-deploy.yml (có tính năng tốt hơn)
# Xóa: deploy-gh-pages.yml
rm .github/workflows/deploy-gh-pages.yml
```

### **BƯỚC 2**: Cập Nhật Actions Versions

**File**: `.github/workflows/build-deploy.yml`

Thay thế:
```yaml
# ❌ Cũ
- uses: actions/checkout@v5
- uses: actions/setup-node@v5
- uses: actions/configure-pages@v5
- uses: actions/upload-artifact@v5
- uses: actions/download-artifact@v5
- uses: actions/upload-pages-artifact@v3
- uses: actions/deploy-pages@v4

# ✅ Mới
- uses: actions/checkout@v4
- uses: actions/setup-node@v4
- uses: actions/configure-pages@v5  # (v5 OK)
- uses: actions/upload-artifact@v4
- uses: actions/download-artifact@v4
- uses: actions/upload-pages-artifact@v3  # (v3 OK)
- uses: actions/deploy-pages@v5
```

### **BƯỚC 3**: Đổi Node Version
```yaml
# ❌ Cũ
node-version: 24

# ✅ Mới
node-version: '20'
```

### **BƯỚC 4**: Sửa Artifact Naming Issue

**Vấn đề**: Deploy job không tìm thấy artifact

**Giải pháp**: Sử dụng tên đơn giản
```yaml
# Trong build job - sửa
- name: Upload artifact
  uses: actions/upload-artifact@v4
  with:
    name: dist  # ← Tên đơn giản, không có số run
    path: ./dist

# Trong deploy job - sửa
- name: Download artifact
  uses: actions/download-artifact@v4
  with:
    name: dist  # ← Tên khớp
    path: ./dist
```

### **BƯỚC 5**: Sửa Build Script

**File**: `package.json`

Thay thế:
```json
// ❌ Cũ
"build:pages": "tsc -b && vite build && node --input-type=module -e \"import { copyFileSync, writeFileSync } from 'node:fs'; copyFileSync('dist/index.html', 'dist/404.html'); writeFileSync('dist/.nojekyll', '');\"",

// ✅ Mới (sạch & an toàn)
"build:pages": "npm run build && npm run setup:pages",
"setup:pages": "node scripts/setup-pages.js",

// Hoặc đơn giản hơn:
"build:pages": "tsc -b && vite build && node -e \"const fs=require('fs');fs.copyFileSync('dist/index.html','dist/404.html');fs.writeFileSync('dist/.nojekyll','');\"",
```

**Tạo file**: `scripts/setup-pages.js`
```javascript
import { copyFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const distDir = resolve('dist');
copyFileSync(resolve(distDir, 'index.html'), resolve(distDir, '404.html'));
writeFileSync(resolve(distDir, '.nojekyll'), '');
console.log('✅ Pages setup completed');
```

### **BƯỚC 6**: Xóa `.nojekyll` Duplicate

**Trong workflow** `build-deploy.yml`, xóa:
```yaml
# ❌ Xóa dòng này (vì build script đã tạo)
- name: Disable Jekyll processing
  run: touch ./dist/.nojekyll
```

---

## 📋 Checklist Deployment Workflow

```
[ ] Xóa deploy-gh-pages.yml
[ ] Cập nhật actions versions (v4 -> v5)
[ ] Đổi Node từ 24 → 20
[ ] Gọi build:pages script đơn giản
[ ] Fix artifact naming (không động)
[ ] Xóa .nojekyll duplicate
[ ] Test locally: npm run build:pages
[ ] Commit & Push → GitHub
[ ] Kiểm tra workflow runs
```

---

## 🧪 Test Trước Deploy

```bash
# 1. Test build locally
npm run build:pages

# 2. Kiểm tra dist folder
ls -la dist/
ls -la dist/404.html  # Phải tồn tại
ls -la dist/.nojekyll # Phải tồn tại

# 3. Preview build
npm run preview

# 4. Commit changes
git add -A
git commit -m "fix: GitHub Pages deployment workflow"
git push origin main
```

---

## 🚨 Nếu Vẫn Lỗi

### Kiểm tra GitHub Actions Logs:
1. Vào **Settings** → **Pages**
2. Xem **"Deployments"** → Kiểm tra lỗi cụ thể
3. Xem chi tiết từng step trong workflow

### Lỗi Phổ Biến:
```
❌ "Could not find dist" 
→ Build bị lỗi, kiểm tra npm run build:pages locally

❌ "Artifact not found"
→ Tên artifact không khớp (xem artifact-name vs name)

❌ "GitHub Pages not enabled"
→ Vào Settings → Pages, chọn "Deploy from a branch"

❌ "No files were uploaded"
→ dist folder rỗng, check build output
```

---

## 📞 Liên Hệ Hỗ Trợ

Nếu vấn đề vẫn thấy lỗi sau khi áp dụng, cần kiểm tra:
- [ ] GitHub Pages settings
- [ ] Permissions của token
- [ ] Build dependencies (package-lock.json)
- [ ] TypeScript config errors (`tsc -b`)
