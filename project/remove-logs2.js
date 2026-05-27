import fs from 'fs';
import path from 'path';

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = dir + '/' + file;
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.ts') || file.endsWith('.tsx')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('./src');
let changedCount = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('console.log')) {
    // Replace console.log with a no-op function to avoid breaking syntax
    const newContent = content.replace(/console\.log/g, '(()=>{})');
    if (content !== newContent) {
      fs.writeFileSync(file, newContent, 'utf8');
      changedCount++;
    }
  }
}

console.log(`Replaced console.log in ${changedCount} files.`);
