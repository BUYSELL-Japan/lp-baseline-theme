import fs from 'fs';
let content = fs.readFileSync('src/pages/demo/shiro.astro', 'utf8');
content = content.replace(/basePath="\/demo\/kura"/, 'basePath="/demo/shiro"');
fs.writeFileSync('src/pages/demo/shiro.astro', content);
