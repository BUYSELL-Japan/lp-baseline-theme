import fs from 'fs';
import path from 'path';

const dir = 'src/components/themes/brush';
const files = fs.readdirSync(dir);

const darkSections = ['Company.tsx', 'Access.tsx', 'News.tsx', 'CTA.tsx', 'Pricing.tsx'];
const lightSections = ['Staff.tsx', 'StoreInfo.tsx', 'FAQ.tsx', 'Contact.tsx', 'Gallery.tsx'];
const skipFiles = ['Header.tsx', 'Hero.tsx', 'Menu.tsx', 'Footer.tsx', 'About.tsx'];

files.forEach(file => {
  if (skipFiles.includes(file)) return;
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Common: remove duplicate bg classes on section
  content = content.replace(/className="bg-\[#[a-zA-Z0-9]+\](.*?)bg-\[#[a-zA-Z0-9]+\]"/, 'className="bg-[$1]"');
  
  if (darkSections.includes(file)) {
    // Dark mode forces
    content = content.replace(/bg-\[#FFFFFF\]/g, 'bg-transparent border border-white/20');
    content = content.replace(/bg-white/g, 'bg-transparent border border-white/20');
    content = content.replace(/bg-\[#FAFAF7\]/g, 'bg-transparent');
    content = content.replace(/text-\[#2D2D2D\]/g, 'text-white');
    content = content.replace(/text-\[#1a1a1a\]/g, 'text-white');
    content = content.replace(/bg-\[#2a2a2a\]/g, 'bg-transparent');
  } else if (lightSections.includes(file)) {
    // Light mode forces
    content = content.replace(/bg-\[#1a1a1a\]/g, 'bg-[#F5F0E8]');
    content = content.replace(/bg-\[#2a2a2a\]/g, 'bg-[#F5F0E8]');
    content = content.replace(/bg-\[#FFFFFF\]/g, 'bg-transparent border border-[#1a1a1a]/20');
    content = content.replace(/bg-white/g, 'bg-transparent border border-[#1a1a1a]/20');
    content = content.replace(/text-white/g, 'text-[#1a1a1a]');
    content = content.replace(/text-\[#2D2D2D\]/g, 'text-[#1a1a1a]');
    // Restore button specific colors if accidentally replaced
    content = content.replace(/className="([^"]*)bg-\[#F5F0E8\]([^"]*)hover:bg-\[#F5F0E8\]([^"]*)"/g, 'className="$1bg-[#C0392B] text-white hover:bg-[#A93226]$3"');
  }

  // Ensure headings are serif
  content = content.replace(/font-sans/g, 'font-serif');

  fs.writeFileSync(filePath, content);
});

// Fix Contact.tsx Submit Button specifically since it might have been messed up
let contactPath = path.join(dir, 'Contact.tsx');
if (fs.existsSync(contactPath)) {
  let contactContent = fs.readFileSync(contactPath, 'utf8');
  contactContent = contactContent.replace(/<button([^>]+)type="submit"([^>]*)>/, '<button type="submit" className="w-full bg-[#C0392B] text-white hover:bg-[#A93226] py-5 rounded-none font-serif tracking-widest text-lg transition-colors">');
  fs.writeFileSync(contactPath, contactContent);
}

// Fix CTA button
let ctaPath = path.join(dir, 'CTA.tsx');
if (fs.existsSync(ctaPath)) {
  let ctaContent = fs.readFileSync(ctaPath, 'utf8');
  ctaContent = ctaContent.replace(/<a([^>]+)href="#contact"([^>]*)>/, '<a href="#contact" className="inline-block bg-[#C0392B] text-white hover:bg-[#A93226] px-12 py-5 font-serif font-black tracking-widest text-xl transition-colors">');
  fs.writeFileSync(ctaPath, ctaContent);
}

console.log('Fixed Brush theme colors');
