const fs = require('fs');
const path = require('path');
const dir = 'src/components/themes/ember';

const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Background colors
  content = content.replace(/bg-white/g, 'bg-[#141414]');
  content = content.replace(/bg-slate-50\b/g, 'bg-[#141414]');
  content = content.replace(/bg-slate-100/g, 'bg-[#1a1a1a]');
  content = content.replace(/bg-slate-200/g, 'bg-[#222222]');
  content = content.replace(/bg-slate-300/g, 'bg-[#2a2a2a]');
  content = content.replace(/bg-slate-400/g, 'bg-[#333333]');
  content = content.replace(/bg-slate-700/g, 'bg-[#222222]');
  content = content.replace(/bg-blue-50\b/g, 'bg-[#1a1a1a]');
  content = content.replace(/bg-blue-100/g, 'bg-[#1a1a1a]');
  
  // Accents (Buttons, badges)
  content = content.replace(/bg-blue-500/g, 'bg-[#8B0000]');
  content = content.replace(/bg-blue-600/g, 'bg-[#8B0000]');
  content = content.replace(/bg-blue-700/g, 'bg-[#C0392B]');
  content = content.replace(/hover:bg-blue-600/g, 'hover:bg-[#C0392B]');
  content = content.replace(/hover:bg-blue-700/g, 'hover:bg-[#C0392B]');
  
  // Text colors
  content = content.replace(/text-slate-900/g, 'text-gray-100');
  content = content.replace(/text-slate-800/g, 'text-gray-100');
  content = content.replace(/text-slate-700/g, 'text-gray-200');
  content = content.replace(/text-slate-600/g, 'text-gray-300');
  content = content.replace(/text-gray-900/g, 'text-gray-100');
  content = content.replace(/text-gray-800/g, 'text-gray-200');
  content = content.replace(/text-gray-700/g, 'text-gray-300');
  content = content.replace(/text-gray-600/g, 'text-gray-400');
  content = content.replace(/text-gray-1000/g, 'text-gray-200'); // Some weird tailwind class that was mentioned
  content = content.replace(/text-blue-500/g, 'text-[#D4AF37]');
  content = content.replace(/text-blue-600/g, 'text-[#D4AF37]');
  content = content.replace(/text-blue-700/g, 'text-[#D4AF37]');
  content = content.replace(/text-blue-400/g, 'text-[#D4AF37]');
  content = content.replace(/text-blue-100/g, 'text-gray-100');
  content = content.replace(/text-blue-200/g, 'text-gray-200');
  
  // Borders and Rings
  content = content.replace(/border-slate-100/g, 'border-[#D4AF37]/30');
  content = content.replace(/border-slate-200/g, 'border-[#D4AF37]/30');
  content = content.replace(/border-slate-300/g, 'border-[#D4AF37]/30');
  content = content.replace(/border-gray-200/g, 'border-[#D4AF37]/30');
  content = content.replace(/border-gray-300/g, 'border-[#D4AF37]/30');
  content = content.replace(/border-blue-500/g, 'border-[#D4AF37]');
  content = content.replace(/border-blue-600/g, 'border-[#D4AF37]');
  content = content.replace(/border-blue-100/g, 'border-[#D4AF37]/20');
  content = content.replace(/ring-slate-200/g, 'ring-[#D4AF37]/30');
  content = content.replace(/ring-blue-500/g, 'ring-[#D4AF37]');
  
  // Fonts and Headings
  // Ensure font-serif font-bold on heading tags
  // Many headings are text-5xl md:text-7xl font-serif font-bold tracking-wide. Let's make sure they are big.
  content = content.replace(/text-3xl/g, 'text-4xl');
  content = content.replace(/text-4xl(.*?)md:text-5xl/g, 'text-5xl md:text-6xl');
  content = content.replace(/text-5xl(.*?)md:text-6xl/g, 'text-6xl md:text-7xl');
  
  // Force serif on headings if missing
  content = content.replace(/<h2([^>]*)className="([^"]*)"/g, (match, p1, p2) => {
    let classes = p2;
    if (!classes.includes('font-serif')) classes += ' font-serif';
    if (!classes.includes('font-bold')) classes += ' font-bold';
    return `<h2${p1}className="${classes}"`;
  });
  
  content = content.replace(/<h3([^>]*)className="([^"]*)"/g, (match, p1, p2) => {
    let classes = p2;
    if (!classes.includes('font-serif')) classes += ' font-serif';
    if (!classes.includes('font-bold')) classes += ' font-bold';
    return `<h3${p1}className="${classes}"`;
  });

  // Adding Gold bottom border to h2 to satisfy "見出し下のアンダーライン" (Underline below headings)
  content = content.replace(/<h2([^>]*)className="([^"]*)"([^>]*)>/g, (match, p1, p2, p3) => {
    // skip if it already has border-b
    let classes = p2;
    if (!classes.includes('border-b')) {
      classes += ' border-b-2 border-[#D4AF37] pb-4 inline-block mb-4';
    }
    return `<h2${p1}className="${classes}"${p3}>`;
  });

  // Remove duplicate font-serif if any
  content = content.replace(/font-serif font-serif/g, 'font-serif');
  content = content.replace(/font-bold font-bold/g, 'font-bold');
  
  fs.writeFileSync(filePath, content, 'utf8');
}
console.log('Ember theme comprehensive style update done.');
