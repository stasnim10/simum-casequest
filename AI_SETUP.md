# AI CaseQuest Setup Guide

## Overview
Your CaseQuest app now includes AI-powered case interview functionality with voice and text interaction.

## Features Added
- ✅ AI Case Interviewer using OpenAI GPT-3.5
- ✅ Voice recognition for speech input
- ✅ Text-to-speech for AI responses
- ✅ Real-time conversation interface
- ✅ Multiple case types (Market Sizing, Profitability, Market Entry, Operations)

## Setup Instructions

### 1. Get OpenAI API Key
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Create an account or sign in
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key (starts with `sk-`)

### 2. Configure Environment Variables
1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Add your OpenAI API key to `.env`:
   ```
   REACT_APP_OPENAI_API_KEY=sk-your-actual-api-key-here
   ```

### 3. Browser Permissions
The app requires microphone access for voice input:
- Chrome/Edge: Click the microphone icon in the address bar
- Firefox: Click the shield icon and allow microphone access
- Safari: Go to Settings > Websites > Microphone

### 4. Start the App
```bash
npm start
```

## How to Use

### Starting an AI Interview
1. Log into your account
2. Click "AI Interview" in the sidebar
3. Choose a case type (Market Sizing, Profitability, etc.)
4. The AI interviewer will introduce the case

### Interaction Methods
- **Voice**: Click the microphone button and speak
- **Text**: Type your response and press Enter or click Send
- **Mixed**: Use both voice and text as needed

### Voice Controls
- 🎤 **Microphone button**: Start/stop voice input
- 🔊 **Speaker button**: Enable/disable AI voice responses
- The AI will speak responses automatically when voice is enabled

### Tips for Best Experience
- Speak clearly and pause between thoughts
- Use structured thinking (e.g., "Let me break this into three parts...")
- Ask for clarification if needed
- The AI provides hints and guidance throughout

## Technical Details

### Components Added
- `AICaseInterview.js`: Main interview interface
- `aiService.js`: OpenAI integration
- `voiceService.js`: Speech recognition and synthesis

### API Usage
- Uses GPT-3.5-turbo for cost efficiency
- Responses limited to 150 tokens for conciseness
- System prompts guide the AI to act as a case interviewer

### Browser Compatibility
- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Limited voice features on iOS
- Mobile: Text input works, voice may be limited

## Troubleshooting

### Common Issues
1. **"Speech recognition not supported"**: Use Chrome or Edge
2. **API errors**: Check your OpenAI API key and billing
3. **No voice output**: Check browser audio permissions
4. **Microphone not working**: Allow microphone access in browser settings

### Cost Management
- Each conversation costs ~$0.01-0.05 depending on length
- Monitor usage in OpenAI dashboard
- Set usage limits in OpenAI account settings

## Next Steps
- Add more case types and scenarios
- Implement performance scoring
- Add conversation history and replay
- Create practice mode with feedback
