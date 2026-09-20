import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcDir = path.join(__dirname, 'src', 'components', 'themes', 'shiro');
const destDir = path.join(__dirname, 'src', 'components', 'themes', 'mist');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// Copy from shiro since it's already quite clean
const files = fs.readdirSync(srcDir).filter(f => f.endsWith('.tsx'));
for (const file of files) {
  const srcFile = path.join(srcDir, file);
  const destFile = path.join(destDir, file);
  fs.copyFileSync(srcFile, destFile);
}
console.log('Copied base files to mist directory.');
