import fs from 'fs';
import path from 'path';

const dir = 'src/components/themes/pop';

const configs = [
  { file: 'Staff.tsx', bg: 'bg-[#FFF9C4]', underline: 'border-[#FB5607]', textColors: { bgClass: 'bg-white' } },
  { file: 'Company.tsx', bg: 'bg-white', underline: 'border-[#7B2FBE]', textColors: {} },
  { file: 'StoreInfo.tsx', bg: 'bg-[#FFE4E6]', underline: 'border-[#FF006E]', textColors: {} },
  { file: 'Access.tsx', bg: 'bg-white', underline: 'border-[#FB5607]', textColors: {} },
  { file: 'FAQ.tsx', bg: 'bg-[#FFF9C4]', underline: 'border-[#7B2FBE]', textColors: { bgClass: 'bg-white' } },
  { file: 'News.tsx', bg: 'bg-white', underline: 'border-[#FF006E]', textColors: {} },
  { file: 'Contact.tsx', bg: 'bg-gradient-to-br from-[#FF006E] to-[#FB5607]', underline: 'border-white', textColors: { textClass: 'text-white' } },
  { file: 'CTA.tsx', bg: 'bg-gradient-to-br from-[#FF006E] to-[#FB5607]', underline: 'border-white', textColors: { textClass: 'text-white' } }
];

configs.forEach(c => {
  const filePath = path.join(dir, c.file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace section background
    content = content.replace(/className=\"([^"]*?py-[0-9]+[^"]*?)\"/, (match, p1) => {
      let newClasses = p1.replace(/bg-\[#[a-zA-Z0-9]+\]/g, '');
      newClasses = newClasses.replace(/bg-white/g, '');
      newClasses = newClasses.replace(/bg-transparent/g, '');
      return 'className="' + c.bg + ' ' + newClasses.trim() + '"';
    });

    // Replace header underline
    content = content.replace(/<h2 className=\"([^"]*?)\">/g, (match, p1) => {
      let newClasses = p1.replace(/border-b-2/g, 'border-b-8');
      newClasses = newClasses.replace(/border-\[#[a-zA-Z0-9]+\]/g, c.underline);
      if (!newClasses.includes('border-b-8')) {
        newClasses += ' border-b-8 ' + c.underline + ' pb-2 px-2 inline-block';
      }
      if (c.textColors.textClass && newClasses.includes('text-[#2D2D2D]')) {
        newClasses = newClasses.replace(/text-\[#2D2D2D\]/g, c.textColors.textClass);
      }
      return '<h2 className="' + newClasses + '">';
    });

    // Subtitle text color if gradient background
    if (c.bg.includes('gradient')) {
      content = content.replace(/text-\[#2D2D2D\]/g, 'text-white');
      content = content.replace(/text-\[#1a1a1a\]/g, 'text-white');
      content = content.replace(/text-amber-900\/80/g, 'text-white/80');
    }

    // Replace buttons (mostly in Contact, CTA)
    if (c.file === 'Contact.tsx' || c.file === 'CTA.tsx') {
      if (c.file === 'CTA.tsx') {
        content = content.replace(/className=\"inline-flex[^"]*?\"/g, 'className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl text-lg font-sans font-black tracking-tight transition-transform duration-300 shadow-[4px_4px_0_0_#1a1a1a] bg-white text-[#FF006E] hover:translate-y-1 hover:shadow-[0px_0px_0_0_#1a1a1a] border-2 border-[#1a1a1a]"');
      }
    }

    fs.writeFileSync(filePath, content);
  }
});
console.log('Processed sections');
