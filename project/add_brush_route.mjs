import fs from 'fs';

let content = fs.readFileSync('src/pages/stores/[subdomain]/[lang]/index.astro', 'utf8');

if (!content.includes('ThemeBrushStorePage')) {
  content = content.replace("import ThemePopStorePage from '../../../../components/ThemePopStorePage';", "import ThemePopStorePage from '../../../../components/ThemePopStorePage';\nimport ThemeBrushStorePage from '../../../../components/ThemeBrushStorePage';");
  
  content = content.replace("theme === 'pop' ? <ThemePopStorePage client:load initialData={pageData} initialLanguage={lang} /> :", "theme === 'pop' ? <ThemePopStorePage client:load initialData={pageData} initialLanguage={lang} /> :\n          theme === 'brush' ? <ThemeBrushStorePage client:load initialData={pageData} initialLanguage={lang} /> :");
  
  fs.writeFileSync('src/pages/stores/[subdomain]/[lang]/index.astro', content);
  console.log('Updated index.astro');
}
