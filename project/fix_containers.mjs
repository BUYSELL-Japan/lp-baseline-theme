import fs from 'fs';
import path from 'path';

const dir = 'src/components/themes/brush';
const darkSections = ['Company.tsx', 'Access.tsx', 'News.tsx', 'CTA.tsx', 'Pricing.tsx'];
const lightSections = ['Staff.tsx', 'StoreInfo.tsx', 'FAQ.tsx', 'Contact.tsx', 'Gallery.tsx'];

fs.readdirSync(dir).forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Find something like: className="bg-[ text-white  py-24 ... ]"
  if (darkSections.includes(file)) {
    content = content.replace(/className="bg-\[\s*(text-[^"]*)\]"/, 'className="bg-[#1a1a1a] $1"');
    // Also clean up multiple border-whites
    content = content.replace(/border border-white\/20 border border-\[#C0392B\]\/20/g, 'border border-white/20');
  } else if (lightSections.includes(file)) {
    content = content.replace(/className="bg-\[\s*(text-[^"]*)\]"/, 'className="bg-[#F5F0E8] $1"');
  }

  // Also remove redundant py-24 md:py-32 duplicates
  content = content.replace(/(py-24 md:py-32\s*)+/g, 'py-24 md:py-32 ');
  
  fs.writeFileSync(filePath, content);
});
console.log('Fixed broken container classes');
