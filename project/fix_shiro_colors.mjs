import fs from 'fs';
import path from 'path';

const dir = 'src/components/themes/shiro';
fs.readdirSync(dir).forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  content = content.replace(/#C0392B/gi, '#2D6A4F'); // Accent
  content = content.replace(/#1a1a1a/gi, '#333333'); // Main text
  content = content.replace(/#2D2D2D/gi, '#333333');
  
  // Also we want to ensure popular plan or important buttons have white text instead of #333333
  content = content.replace(/bg-\[#2D6A4F\] text-\[#333333\]/gi, 'bg-[#2D6A4F] text-white');
  
  // Revert back any button text that was corrupted
  content = content.replace(/className=\"([^\"]*)bg-\[#2D6A4F\]([^\"]*)text-\[#333333\]/gi, 'className=\"$1bg-[#2D6A4F]$2text-white');
  
  fs.writeFileSync(filePath, content);
});
