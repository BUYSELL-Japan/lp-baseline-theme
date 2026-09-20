const fs = require('fs');
const path = require('path');

const dir = 'src/components/themes/char';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf-8');

  // H2のフォントサイズを text-[2rem] md:text-[3rem] に統一
  content = content.replace(/text-2xl\s+md:text-3xl/g, 'text-[2rem] md:text-[3rem]');
  content = content.replace(/text-3xl\s+md:text-4xl/g, 'text-[2rem] md:text-[3rem]');
  content = content.replace(/text-4xl\s+md:text-5xl/g, 'text-[2rem] md:text-[3rem]');
  
  // アンダーラインを統一
  content = content.replace(/mt-3 w-12 h-px/g, 'mt-6 w-24 h-[2px]');
  
  // テキストサイズの統一
  if (['Company.tsx', 'StoreInfo.tsx', 'Access.tsx', 'Contact.tsx'].includes(file)) {
    content = content.replace(/text-sm/g, 'text-base');
  }
  
  // お問い合わせフォーム専用
  if (file === 'Contact.tsx') {
    content = content.replace(/text-\[\#444444\]/g, 'text-[#BBBBBB]');
    content = content.replace(/border-\[\#CCCCCC\]/g, 'border-[#333333]');
  }

  fs.writeFileSync(filePath, content, 'utf-8');
}
console.log('Update finished.');
