import fs from 'fs';
import path from 'path';
const dir = 'src/components/themes/brush';
['Access.tsx', 'News.tsx', 'Company.tsx', 'FAQ.tsx', 'Contact.tsx', 'StoreInfo.tsx'].forEach(file => {
  const filePath = path.join(dir, file);
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(/<section([^>]+)className="bg-\[#1a1a1a\] text-white py-24 md:py-32 px-4 sm:px-6[^"]*"/g, '<section$1className="bg-[#1a1a1a] text-white py-24 md:py-32 px-4 sm:px-6"');
  content = content.replace(/<section([^>]+)className="bg-\[#F5F0E8\] text-\[#1a1a1a\] py-24 md:py-32 px-4 sm:px-6[^"]*"/g, '<section$1className="bg-[#F5F0E8] text-[#1a1a1a] py-24 md:py-32 px-4 sm:px-6"');
  fs.writeFileSync(filePath, content);
});
