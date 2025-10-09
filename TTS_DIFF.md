# CaseSimulator.jsx - TTS Integration Diff

## Imports Added
```javascript
import { Volume2, VolumeX } from 'lucide-react';
import { speak, cancelSpeech, pauseSpeech, resumeSpeech, hasTTSSupport } from '../lib/voiceTTS';
```

## State Added
```javascript
// TTS detection & state
const ttsEnabled = import.meta.env.VITE_ENABLE_TTS !== '0';
const hasTTS = hasTTSSupport();
const [ttsMode, setTtsMode] = useState(false);
const [currentSpokenText, setCurrentSpokenText] = useState('');
```

## Handlers Added
```javascript
const handleTtsToggle = (checked) => {
  setTtsMode(checked);
  if (checked) {
    track('tts_enabled', { caseId: currentCase.id });
  } else {
    cancelSpeech();
    setCurrentSpokenText('');
  }
};

const speakFollowups = async () => {
  if (!ttsMode || !hasTTS) return;
  const followups = suggestFollowups({ step: activeStep, answers, caseData: currentCase });
  for (let i = 0; i < followups.length; i++) {
    setCurrentSpokenText(followups[i]);
    speak(followups[i]);
    await new Promise(resolve => setTimeout(resolve, followups[i].length * 50 + 1000));
  }
  setCurrentSpokenText('');
};
```

## Effects Added
```javascript
// Keyboard shortcuts for pause/resume
useEffect(() => {
  const handleKeyDown = (e) => {
    if (e.code === 'Space' && e.shiftKey) {
      e.preventDefault();
      pauseSpeech();
    }
    if (e.code === 'Enter' && e.shiftKey) {
      e.preventDefault();
      resumeSpeech();
    }
  };
  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, []);

// Auto-speak on step change
useEffect(() => {
  if (ttsMode && activeStep < steps.length) {
    speakFollowups();
  }
  return () => cancelSpeech();
}, [activeStep, ttsMode]);
```

## UI Changes

### Header Section (added Voice Output toggle)
```jsx
<div className="flex gap-4">
  {voiceEnabled && (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        checked={voiceMode}
        onChange={(e) => handleVoiceToggle(e.target.checked)}
        className="w-4 h-4"
      />
      <span className="text-sm font-medium">Voice Input</span>
    </label>
  )}
  {ttsEnabled && hasTTS && (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        checked={ttsMode}
        onChange={(e) => handleTtsToggle(e.target.checked)}
        className="w-4 h-4"
      />
      <span className="text-sm font-medium">Voice Output</span>
      {ttsMode ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
    </label>
  )}
</div>
```

### After Progress Bar (added subtitle display)
```jsx
{/* Spoken Text Subtitle */}
{ttsMode && currentSpokenText && (
  <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
    <div className="flex items-center gap-2">
      <Volume2 className="h-4 w-4 text-blue-600 animate-pulse" />
      <p className="text-sm text-blue-900 italic">{currentSpokenText}</p>
    </div>
    <p className="text-xs text-blue-600 mt-1">Shift+Space to pause • Shift+Enter to resume</p>
  </div>
)}
```

## Text Flow Preserved
✅ All existing text inputs remain functional
✅ Voice Input mode unchanged
✅ Voice Output is purely additive
✅ Users can enable/disable independently
✅ Turn-based interview loop optional

## Analytics Integration
✅ Tracks tts_enabled on toggle
✅ Tracks tts_spoken with char count
✅ Tracks tts_paused on Shift+Space
✅ Tracks tts_resumed on Shift+Enter

## Accessibility Features
✅ Keyboard shortcuts (Shift+Space, Shift+Enter)
✅ Visual subtitle with current spoken text
✅ Animated icon when speaking
✅ Keyboard hints displayed
✅ Auto-cleanup on unmount
