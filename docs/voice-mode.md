# Voice AI Interviewer

## Overview
Voice mode enables users to complete case interviews by speaking instead of typing. Uses browser's native SpeechRecognition API (Web Speech API) for privacy-first, client-side processing.

## Features
- **Push-to-talk**: Click to start/stop recording
- **Live transcript**: Real-time display of speech-to-text
- **Smart mapping**: Automatically maps transcript to step fields
- **Follow-up hints**: Context-aware prompts per step
- **Privacy consent**: One-time checkbox, stored in localStorage
- **Graceful fallback**: Textarea for browsers without SR support

## Browser Support
- ✅ Chrome/Edge (desktop & mobile)
- ✅ Safari (desktop & mobile, requires mic permission)
- ⚠️ Firefox (limited support, fallback to textarea)
- ⚠️ Safari Private Mode (no SR, fallback to textarea)

## Architecture

### Components
- `src/components/VoiceBar.jsx` - Push-to-talk UI with transcript display
- `src/lib/voiceFollowups.js` - Rule-based prompt suggestions per step

### Integration Points
- `src/pages/CaseSimulator.jsx` - Voice mode toggle and transcript processing
- Existing `/api/feedback` endpoint - No changes needed

### Transcript Mapping
| Step | Field | Processing |
|------|-------|------------|
| 0 - Clarifying | `answers.clarifying[]` | Split on sentence boundaries |
| 1 - Hypothesis | `answers.hypothesis` | Direct assignment |
| 2 - Framework | `answers.structure` | Keyword matching (profit→Profitability) |
| 3 - Quant | `answers.quant{}` | Regex parse "revenue 120 cost 90" |
| 4 - Recommendation | `answers.recommendation` | Direct assignment |

## Configuration

### Environment Variables
```bash
VITE_ENABLE_VOICE=1  # Default on, set to 0 to disable
```

### Privacy & Consent
- Consent stored in `localStorage.cq_voice_consent`
- No audio uploaded to servers
- All processing happens in browser via Web Speech API

## Analytics Events
```javascript
track('voice_mode_enabled', { caseId })
track('voice_transcript_captured', { step, lengthChars })
track('ai_feedback_received', { caseId, cached })  // existing
```

## Error Handling
- **NotAllowedError**: Alert user to enable mic in browser settings
- **No SR support**: Show textarea fallback with paste instructions
- **Parse failures**: Safe defaults, never block flow

## Testing
- `tests/ui.spec.ts` - Voice mode toggle visibility check
- `tests/visual.spec.ts` - Voice UI layout snapshot (no mic required in CI)

## Usage Flow
1. User navigates to `/#/case`
2. Toggles "Voice Mode" checkbox (top-right)
3. Accepts consent prompt (first time only)
4. Clicks "Push to talk" button
5. Speaks answer for current step
6. Clicks "Use transcript" to populate fields
7. Reviews follow-up hints
8. Proceeds through 5 steps as normal
9. Gets AI feedback via existing endpoint

## Future Enhancements
- Backend `/api/followups` endpoint with LLM-generated prompts
- Voice playback of interviewer questions
- Multi-language support (change `r.lang` in VoiceBar)
- Transcript editing before submission
- Voice activity detection (auto-stop on silence)
