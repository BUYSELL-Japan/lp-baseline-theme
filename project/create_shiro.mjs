import fs from 'fs';
import path from 'path';

const sourceDir = 'src/components/themes/kura';
const targetDir = 'src/components/themes/shiro';

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const files = fs.readdirSync(sourceDir);

files.forEach(file => {
  const sourcePath = path.join(sourceDir, file);
  const targetPath = path.join(targetDir, file);
  
  if (fs.statSync(sourcePath).isFile()) {
    let content = fs.readFileSync(sourcePath, 'utf8');
    
    // Replace all basic colors
    content = content.replace(/bg-amber-900/g, 'bg-[#2D6A4F]'); // Main button/accent
    content = content.replace(/text-amber-900/g, 'text-[#2D6A4F]');
    content = content.replace(/border-amber-900/g, 'border-[#2D6A4F]');
    
    content = content.replace(/bg-amber-800/g, 'bg-[#1b4332]'); // Hover
    content = content.replace(/text-amber-800/g, 'text-[#1b4332]');
    
    content = content.replace(/bg-\[#2D2D2D\]/g, 'bg-[#333333]'); // Dark backgrounds
    content = content.replace(/text-\[#2D2D2D\]/g, 'text-[#333333]');
    
    content = content.replace(/bg-\[#FAFAF7\]/g, 'bg-[#F8F8F8]'); // Light gray bg
    content = content.replace(/bg-stone-50/g, 'bg-[#FFFFFF]'); // White bg
    
    // Change font to sans and remove rounded where heavily styled
    content = content.replace(/font-serif/g, 'font-sans');
    content = content.replace(/rounded-3xl/g, 'rounded-sm');
    content = content.replace(/rounded-2xl/g, 'rounded-sm');
    content = content.replace(/rounded-xl/g, 'rounded-sm');
    content = content.replace(/shadow-xl/g, 'shadow-none');
    content = content.replace(/shadow-lg/g, 'shadow-none');
    
    fs.writeFileSync(targetPath, content);
  }
});

console.log('Copied and scaffolded Shiro components.');
