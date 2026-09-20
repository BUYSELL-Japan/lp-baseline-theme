const fs = require('fs');
const path = require('path');

const dir = 'src/components/themes/char';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf-8');

  // 1. H2のフォントサイズを text-[2rem] md:text-[3rem] に統一
  // className="... text-2xl md:text-3xl" や "text-4xl md:text-5xl" などを置換
  content = content.replace(/text-(?:2xl|3xl|4xl|5xl)\s+md:text-(?:3xl|4xl|5xl)/g, 'text-[2rem] md:text-[3rem]');
  
  // 2. アンダーラインを 2px に統一
  // mt-3 w-12 h-px を mt-6 w-24 h-[2px] に置換
  content = content.replace(/<div className="mt-3 w-12 h-px" style=\{\{ backgroundColor: '#D4541A' \}\}\><\/div>/g, '<div className="mt-6 w-24 h-[2px]" style={{ backgroundColor: '#D4541A' }}></div>');
  
  // 3. テキストサイズと色を統一 (Company, Access, Contact, StoreInfo)
  if (file === 'Company.tsx' || file === 'StoreInfo.tsx' || file === 'Access.tsx' || file === 'Contact.tsx') {
    // text-sm -> text-base (1rem) に変更（Company, StoreInfo, Access のラベルなど）
    content = content.replace(/text-sm/g, 'text-base');
    // text-xs -> text-base (1rem) に変更（一部のラベル）
    // 慎重に置換する
    content = content.replace(/text-xs(?!\s+tracking-\[)/g, 'text-base'); 
  }
  
  if (file === 'Contact.tsx') {
    // フォームの入力欄のテキストを大きくする
    content = content.replace(/text-sm text-\[\#444444\]/g, 'text-base text-[#BBBBBB]');
    // フォームのラベルのテキスト色
    content = content.replace(/text-\[\#444444\]/g, 'text-[#BBBBBB]');
  }

  fs.writeFileSync(filePath, content, 'utf-8');
}
console.log('Script completed.');
