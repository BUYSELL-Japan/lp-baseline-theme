import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import React, { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Make React available globally for JSX
global.React = React;

async function prerender() {
  try {
    // Import the App component
    const { default: App } = await import('../src/App.tsx');

    // Render the app to HTML string
    const appHtml = renderToString(createElement(App));

    // Read the built index.html
    const distPath = join(__dirname, '..', 'dist');
    const indexPath = join(distPath, 'index.html');
    let html = readFileSync(indexPath, 'utf-8');

    // Replace the empty div with the pre-rendered content
    html = html.replace(
      '<div id="root"></div>',
      `<div id="root">${appHtml}</div>`
    );

    // Write the updated HTML back
    writeFileSync(indexPath, html);

    console.log('✓ Pre-rendering complete');
  } catch (error) {
    console.error('Pre-rendering failed:', error);
    process.exit(1);
  }
}

prerender();
