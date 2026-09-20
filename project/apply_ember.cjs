const fs = require('fs');
const path = require('path');

const dir = 'src/components/themes/ember';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Theme1-4 references to Ember
  content = content.replace(/theme2/g, 'ember');
  content = content.replace(/Theme2/g, 'ThemeEmber');

  // Replace colors
  content = content.replace(/bg-slate-950/g, 'bg-[#0a0a0a]');
  content = content.replace(/bg-slate-900/g, 'bg-[#1a1a1a]');
  content = content.replace(/bg-slate-800/g, 'bg-[#2a2a2a]');
  content = content.replace(/bg-slate-50\/5/g, 'bg-white/5');
  
  // Replace text colors
  content = content.replace(/text-slate-50/g, 'text-gray-100');
  content = content.replace(/text-slate-200/g, 'text-gray-200');
  content = content.replace(/text-slate-300/g, 'text-gray-300');
  content = content.replace(/text-slate-400/g, 'text-gray-400');
  content = content.replace(/text-slate-950/g, 'text-[#0a0a0a]');
  
  // Accents and buttons
  content = content.replace(/bg-blue-600/g, 'bg-[#8B0000]'); // deep red buttons
  content = content.replace(/hover:bg-blue-700/g, 'hover:bg-[#C0392B]');
  content = content.replace(/text-blue-500/g, 'text-[#D4AF37]'); // gold text for highlights
  content = content.replace(/text-blue-400/g, 'text-[#D4AF37]'); 
  content = content.replace(/border-blue-500\/30/g, 'border-[#D4AF37]/30');
  content = content.replace(/border-slate-800/g, 'border-[#D4AF37]/20');
  content = content.replace(/ring-blue-500/g, 'ring-[#D4AF37]');
  
  // Fonts
  content = content.replace(/font-black/g, 'font-serif font-bold tracking-wide');
  content = content.replace(/font-bold/g, 'font-serif font-bold');
  content = content.replace(/font-serif font-serif/g, 'font-serif');
  
  // Add gold borders to sections
  if (file !== 'Header.tsx' && file !== 'Footer.tsx' && file !== 'Hero.tsx') {
    content = content.replace(/<section className="py-24/g, '<section className="py-24 border-t border-[#D4AF37]/20');
  }

  fs.writeFileSync(filePath, content, 'utf8');
}
console.log('Ember theme base replacement done.');
