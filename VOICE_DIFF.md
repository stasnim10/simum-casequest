# CaseSimulator.jsx - Voice Mode Integration Diff

## Imports Added
```javascript
import VoiceBar from '../components/VoiceBar';
import { suggestFollowups } from '../lib/voiceFollowups';
```

## State Added
```javascript
// Voice mode detection & state
const hasSR = !!(window.SpeechRecognition || window.webkitSpeechRecognition);
const voiceEnabled = import.meta.env.VITE_ENABLE_VOICE !== '0';
const [voiceMode, setVoiceMode] = useState(false);
const [voiceConsent, setVoiceConsent] = useState(() => 
  localStorage.getItem('cq_voice_consent') === '1'
);
```

## Handlers Added
```javascript
const handleVoiceConsent = (checked) => {
  setVoiceConsent(checked);
  localStorage.setItem('cq_voice_consent', checked ? '1' : '0');
};

const handleVoiceToggle = (checked) => {
  setVoiceMode(checked);
  if (checked) track('voice_mode_enabled', { caseId: currentCase.id });
};

const processTranscript = (full) => {
  track('voice_transcript_captured', { step: activeStep, lengthChars: full.length });
  
  // Step 0: Clarifying Questions
  if (activeStep === 0) {
    const sentences = full.split(/[.?!]\s+/).filter(Boolean);
    setAnswers(a => ({...a, clarifying: sentences.slice(0, 3).concat(a.clarifying.slice(sentences.length))}));
  }
  
  // Step 1: Hypothesis
  if (activeStep === 1) {
    setAnswers(a => ({...a, hypothesis: full}));
  }
  
  // Step 2: Framework (keyword matching)
  if (activeStep === 2) {
    const mapStructure = (txt) => {
      const t = txt.toLowerCase();
      if (t.includes('profit')) return 'Profitability';
      if (t.includes('market')) return 'Market Entry';
      if (t.includes('cost')) return 'Cost Optimization';
      return answers.structure || 'Profitability';
    };
    setAnswers(a => ({...a, structure: mapStructure(full)}));
  }
  
  // Step 3: Quant (regex parsing)
  if (activeStep === 3) {
    const nums = Object.fromEntries(
      Array.from(full.matchAll(/(revenue|cost|margin)\s*[:=]?\s*(\d+(\.\d+)?)/gi))
        .map(m => [m[1].toLowerCase(), m[2]])
    );
    setAnswers(a => ({...a, quant: {...a.quant, ...nums}}));
  }
  
  // Step 4: Recommendation
  if (activeStep === 4) {
    setAnswers(a => ({...a, recommendation: full}));
  }
};
```

## UI Changes

### Header Section (added toggle)
```jsx
<div className="flex justify-between items-start mb-2">
  <h2 className="text-3xl font-bold">Case Simulator</h2>
  {voiceEnabled && (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        checked={voiceMode}
        onChange={(e) => handleVoiceToggle(e.target.checked)}
        className="w-4 h-4"
      />
      <span className="text-sm font-medium">Voice Mode</span>
    </label>
  )}
</div>
```

### Step Content (added voice UI after description)
```jsx
{/* Voice Consent */}
{voiceMode && !voiceConsent && (
  <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
    <label className="flex items-start gap-2 cursor-pointer">
      <input
        type="checkbox"
        checked={voiceConsent}
        onChange={(e) => handleVoiceConsent(e.target.checked)}
        className="mt-1"
      />
      <span className="text-sm text-gray-700">
        I consent to process my microphone audio locally via browser SpeechRecognition. 
        No raw audio is uploaded.
      </span>
    </label>
  </div>
)}

{/* Voice Bar */}
{voiceMode && voiceConsent && hasSR && (
  <div className="mb-4">
    <VoiceBar
      onComplete={processTranscript}
      onCancel={() => {}}
    />
  </div>
)}

{/* Fallback for no SR */}
{voiceMode && voiceConsent && !hasSR && (
  <div className="mb-4 p-3 bg-gray-50 border rounded-lg">
    <p className="text-sm text-gray-600 mb-2">
      Speech recognition not available. Paste dictation text here:
    </p>
    <textarea
      className="w-full border rounded p-2 text-sm"
      rows={3}
      onBlur={(e) => processTranscript(e.target.value)}
      placeholder="Paste your dictated text..."
    />
  </div>
)}

{/* Follow-up hints */}
{voiceMode && voiceConsent && (
  <div className="mb-4 p-3 bg-purple-50 rounded-lg">
    <p className="text-xs font-medium text-purple-900 mb-2">💡 Suggested prompts:</p>
    <ul className="text-xs text-purple-700 space-y-1">
      {suggestFollowups({ step: activeStep, answers, caseData: currentCase }).map((hint, i) => (
        <li key={i}>• {hint}</li>
      ))}
    </ul>
  </div>
)}
```

## Text Flow Preserved
✅ All existing text inputs remain functional
✅ Voice mode is purely additive
✅ Users can mix voice + typing
✅ Disable voice mode to return to original experience

## Analytics Integration
✅ Tracks voice_mode_enabled on toggle
✅ Tracks voice_transcript_captured per step
✅ Reuses existing ai_feedback_received event
