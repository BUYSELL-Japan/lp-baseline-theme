import fs from 'fs';

const files = [
  'src/pages/stores/[subdomain]/[lang]/index.astro',
  'src/pages/stores/[subdomain]/index.astro'
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  if (!content.includes('import ThemeMistStorePage')) {
    content = content.replace(
      /import ThemeShiroStorePage from '(.*?)ThemeShiroStorePage';/,
      "import ThemeShiroStorePage from '$1ThemeShiroStorePage';\nimport ThemeMistStorePage from '$1ThemeMistStorePage';"
    );
    
    // Add to render branch
    content = content.replace(
      /\{theme === 'shiro' && <ThemeShiroStorePage (.*?) \/>\}/,
      "{theme === 'shiro' && <ThemeShiroStorePage $1 />}\n      {theme === 'mist' && <ThemeMistStorePage $1 />}"
    );
    
    fs.writeFileSync(file, content);
    console.log('Updated ' + file);
  }
}
