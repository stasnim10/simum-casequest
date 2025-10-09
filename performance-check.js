#!/usr/bin/env node

// Simple performance check for CaseQuest
const fs = require('fs');
const path = require('path');

console.log('🚀 CaseQuest Performance Check\n');

// Check build size
const buildPath = path.join(__dirname, 'build', 'static', 'js');
if (fs.existsSync(buildPath)) {
  const jsFiles = fs.readdirSync(buildPath).filter(f => f.endsWith('.js'));
  const totalSize = jsFiles.reduce((sum, file) => {
    const stats = fs.statSync(path.join(buildPath, file));
    return sum + stats.size;
  }, 0);
  
  const sizeMB = (totalSize / 1024 / 1024).toFixed(2);
  console.log(`📦 Bundle Size: ${sizeMB}MB`);
  
  if (totalSize > 5 * 1024 * 1024) {
    console.log('⚠️  Bundle size is large (>5MB). Consider code splitting.');
  } else {
    console.log('✅ Bundle size looks good!');
  }
} else {
  console.log('❌ Build folder not found. Run `npm run build` first.');
}

// Check for common performance issues
const srcPath = path.join(__dirname, 'src');
let issueCount = 0;

// Check for large images in public folder
const publicPath = path.join(__dirname, 'public');
if (fs.existsSync(publicPath)) {
  const images = fs.readdirSync(publicPath).filter(f => 
    f.match(/\.(jpg|jpeg|png|gif|svg)$/i)
  );
  
  images.forEach(img => {
    const stats = fs.statSync(path.join(publicPath, img));
    if (stats.size > 500 * 1024) { // 500KB
      console.log(`⚠️  Large image: ${img} (${(stats.size/1024).toFixed(0)}KB)`);
      issueCount++;
    }
  });
}

console.log(`\n📊 Performance Summary:`);
console.log(`- Issues found: ${issueCount}`);
console.log(`- Status: ${issueCount === 0 ? '✅ Ready for production!' : '⚠️  Consider optimizations'}`);

console.log('\n🔍 Recommended next steps:');
console.log('1. Run Lighthouse audit in Chrome DevTools');
console.log('2. Test on mobile devices');
console.log('3. Check Core Web Vitals in production');
