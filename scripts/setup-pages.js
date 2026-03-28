#!/usr/bin/env node
/**
 * Setup script for GitHub Pages deployment
 * Creates 404.html for SPA routing and .nojekyll to skip Jekyll processing
 */

import { copyFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = resolve(fileURLToPath(import.meta.url), '..');
const distDir = resolve(__dirname, '../dist');

try {
  // Copy index.html to 404.html for Single Page App (SPA) routing
  copyFileSync(
    resolve(distDir, 'index.html'),
    resolve(distDir, '404.html')
  );
  console.log('✅ Created 404.html for SPA routing');

  // Create .nojekyll to skip Jekyll processing
  writeFileSync(resolve(distDir, '.nojekyll'), '');
  console.log('✅ Created .nojekyll file');

  console.log('🎉 GitHub Pages setup completed successfully');
} catch (error) {
  console.error('❌ Error during GitHub Pages setup:', error.message);
  process.exit(1);
}
