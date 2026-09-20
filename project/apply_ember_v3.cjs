const fs = require('fs');
const path = require('path');
const dir = 'src/components/themes/ember';

const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Fix remaining tailwind classes
  content = content.replace(/shadow-blue-[a-zA-Z0-9-\/]+/g, 'shadow-[#8B0000]/30');
  content = content.replace(/border-blue-[a-zA-Z0-9-\/]+/g, 'border-[#D4AF37]');
  content = content.replace(/text-blue-[a-zA-Z0-9-\/]+/g, 'text-[#D4AF37]');
  content = content.replace(/from-slate-950\/[0-9]+/g, 'from-[#0a0a0a]/90');
  content = content.replace(/via-slate-950\/[0-9]+/g, 'via-[#0a0a0a]/50');
  content = content.replace(/from-slate-900\/[0-9]+/g, 'from-[#1a1a1a]/90');
  
  // Make headings even bigger to ensure visual impact
  content = content.replace(/text-4xl(.*?)md:text-5xl/g, 'text-5xl md:text-6xl');
  content = content.replace(/text-5xl(.*?)md:text-6xl/g, 'text-6xl md:text-7xl');

  fs.writeFileSync(filePath, content, 'utf8');
}
console.log('Ember theme cleanup done.');
