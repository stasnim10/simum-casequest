#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const apiKey = process.argv[2];

if (!apiKey) {
  console.log('Usage: node setup-api-key.js YOUR_OPENAI_API_KEY');
  process.exit(1);
}

const aiServicePath = path.join(__dirname, 'src/services/aiService.js');
let content = fs.readFileSync(aiServicePath, 'utf8');

content = content.replace(
  'YOUR_OPENAI_API_KEY_HERE',
  apiKey
);

fs.writeFileSync(aiServicePath, content);
console.log('✅ API key configured successfully!');
console.log('Run: npm run deploy');
