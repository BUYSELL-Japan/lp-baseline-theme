import fs from 'fs';
import path from 'path';

const dir = 'src/components/themes/brush';

const configs = [
  { file: 'Pricing.tsx', bg: 'bg-[#1a1a1a]', text: 'text-white' },
  { file: 'Staff.tsx', bg: 'bg-[#F5F0E8]', text: 'text-[#1a1a1a]' },
  { file: 'Company.tsx', bg: 'bg-[#1a1a1a]', text: 'text-white' },
  { file: 'StoreInfo.tsx', bg: 'bg-[#F5F0E8]', text: 'text-[#1a1a1a]' },
  { file: 'Access.tsx', bg: 'bg-[#1a1a1a]', text: 'text-white' },
  { file: 'FAQ.tsx', bg: 'bg-[#F5F0E8]', text: 'text-[#1a1a1a]' },
  { file: 'News.tsx', bg: 'bg-[#1a1a1a]', text: 'text-white' },
  { file: 'Contact.tsx', bg: 'bg-[#F5F0E8]', text: 'text-[#1a1a1a]' },
  { file: 'CTA.tsx', bg: 'bg-[#1a1a1a]', text: 'text-white' }
];

configs.forEach(c => {
  const filePath = path.join(dir, c.file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Headings to serif
    content = content.replace(/font-sans/g, 'font-serif');

    // Replace background
    content = content.replace(/className=\"([^"]*?)py-[0-9]+([^"]*?)\"/, (match, p1, p2) => {
      let newClasses = p1.replace(/bg-\[#[a-zA-Z0-9]+\]/g, '').replace(/bg-white/g, '').replace(/bg-transparent/g, '');
      let afterClasses = p2.replace(/text-\[#[a-zA-Z0-9]+\]/g, '').replace(/text-white/g, '');
      return 'className="' + c.bg + ' ' + c.text + ' ' + newClasses.trim() + ' py-24 md:py-32 ' + afterClasses.trim() + '"';
    });

    if (c.bg === 'bg-[#1a1a1a]') {
      content = content.replace(/text-\[#2D2D2D\]/g, 'text-white');
      content = content.replace(/text-\[#1a1a1a\]/g, 'text-white');
      content = content.replace(/text-amber-900\/80/g, 'text-white/80');
      content = content.replace(/bg-white/g, 'bg-[#2a2a2a] border border-[#333]');
    } else {
      content = content.replace(/text-white/g, 'text-[#1a1a1a]');
    }

    // Fix buttons
    content = content.replace(/bg-\[#2D2D2D\]/g, 'bg-[#C0392B]');
    content = content.replace(/text-\[#1a1a1a\] py-4/g, 'text-white py-4'); // Make sure text on button is white

    fs.writeFileSync(filePath, content);
  }
});
console.log('Styled brush components');
