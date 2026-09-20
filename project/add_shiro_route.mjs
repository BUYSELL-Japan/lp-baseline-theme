import fs from 'fs';

let content = fs.readFileSync('src/pages/stores/[subdomain]/[lang]/index.astro', 'utf8');
content = content.replace(/import ThemeBrushStorePage from '\.\.\/\.\.\/\.\.\/components\/ThemeBrushStorePage';/g, "import ThemeBrushStorePage from '../../../components/ThemeBrushStorePage';\nimport ThemeShiroStorePage from '../../../components/ThemeShiroStorePage';");
content = content.replace(/\{themeComponent === 'brush' && <ThemeBrushStorePage \/>\}/g, "{themeComponent === 'brush' && <ThemeBrushStorePage />}\n    {themeComponent === 'shiro' && <ThemeShiroStorePage />}");
fs.writeFileSync('src/pages/stores/[subdomain]/[lang]/index.astro', content);

let content2 = fs.readFileSync('src/pages/stores/[subdomain]/index.astro', 'utf8');
content2 = content2.replace(/import ThemeBrushStorePage from '\.\.\/\.\.\/components\/ThemeBrushStorePage';/g, "import ThemeBrushStorePage from '../../components/ThemeBrushStorePage';\nimport ThemeShiroStorePage from '../../components/ThemeShiroStorePage';");
content2 = content2.replace(/\{themeComponent === 'brush' && <ThemeBrushStorePage \/>\}/g, "{themeComponent === 'brush' && <ThemeBrushStorePage />}\n    {themeComponent === 'shiro' && <ThemeShiroStorePage />}");
fs.writeFileSync('src/pages/stores/[subdomain]/index.astro', content2);
