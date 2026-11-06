/**
 * Development Watcher for Ring Pop Website
 * Automatically recompiles index.html whenever any file in sections/ changes.
 * Usage: node watch.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const sectionsDir = path.join(__dirname, 'sections');

console.log('Watching sections/ for changes... (Press Ctrl+C to stop)');

let debounceTimeout;
fs.watch(sectionsDir, (eventType, filename) => {
  if (filename && filename.endsWith('.html')) {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      console.log(`[${new Date().toLocaleTimeString()}] Detected change in sections/${filename}. Recompiling...`);
      try {
        require('./build.js');
      } catch (err) {
        console.error('Build error:', err.message);
      }
    }, 100);
  }
});

