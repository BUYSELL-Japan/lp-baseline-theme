import fs from 'fs';
import path from 'path';

function walkDir(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walkDir(filePath));
    } else {
      if (filePath.endsWith('.ts') || filePath.endsWith('.tsx') || filePath.endsWith('.astro')) {
        results.push(filePath);
      }
    }
  });
  return results;
}

const files = walkDir('src');
for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('(()=>{})')) {
    content = content.replace(/\(\(\)=>\{\}\)/g, '((...args: any[]) => {})');
    fs.writeFileSync(file, content, 'utf8');
  }
}
console.log('Done');
