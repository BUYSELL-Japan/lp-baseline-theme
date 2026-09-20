import fs from 'fs';
import path from 'path';

const dir = 'src/components/themes/shiro';
fs.readdirSync(dir).forEach(file => {
  if (['Hero.tsx', 'Menu.tsx', 'About.tsx', 'Gallery.tsx', 'Header.tsx'].includes(file)) return; // Already custom written
  
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace dark backgrounds with white or light gray
  content = content.replace(/bg-\[#333333\]/g, 'bg-[#F8F8F8]'); // Make dark sections light gray
  // Then fix any text that was meant to be white on dark bg
  content = content.replace(/text-white/g, 'text-[#333333]');
  
  // Clean up any double borders
  content = content.replace(/border-white\/20/g, 'border-[#E5E5E5]');
  
  fs.writeFileSync(filePath, content);
});
