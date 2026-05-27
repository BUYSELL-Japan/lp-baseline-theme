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
      if (file.endsWith('.tsx') && !file.includes('themes/theme')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('./src/components');
for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let newContent = content.replace(/bg-theme-primary mx-auto/g, 'bg-theme-divider mx-auto');
  newContent = newContent.replace(/mx-auto bg-theme-primary/g, 'mx-auto bg-theme-divider');
  if (content !== newContent) {
    fs.writeFileSync(file, newContent, 'utf8');
    console.log('Updated ' + file);
  }
}
