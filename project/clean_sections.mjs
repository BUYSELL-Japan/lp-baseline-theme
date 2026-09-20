import fs from 'fs';
import path from 'path';

const dir = 'src/components/themes/brush';

fs.readdirSync(dir).forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  content = content.replace(/<section([^>]+)className="([^"]*)"([^>]*)>/g, (match, p1, p2, p3) => {
    let newClass = p2.replace(/bg-transparent border border-\[#1a1a1a\]\/20/g, '');
    newClass = newClass.replace(/bg-transparent border border-white\/20/g, '');
    newClass = newClass.replace(/bg-\[#2a2a2a\] border border-\[#333\]/g, '');
    newClass = newClass.replace(/bg-white/g, '');
    newClass = newClass.replace(/bg-\[#FFFFFF\]/g, '');
    newClass = newClass.replace(/bg-\[#FAFAF7\]/g, '');
    newClass = newClass.replace(/\s+/g, ' ').trim();
    return `<section${p1}className="${newClass}"${p3}>`;
  });

  content = content.replace(/py-24 md:py-32 sm:py-32 md:py-48 md:py-28 lg:py-32 px-4 sm:px-6/g, 'py-24 md:py-32 px-4 sm:px-6');
  content = content.replace(/py-24 md:py-32 px-4 sm:px-6 \[\]/g, 'py-24 md:py-32 px-4 sm:px-6');
  
  fs.writeFileSync(filePath, content);
});

console.log('Cleaned up section containers');
