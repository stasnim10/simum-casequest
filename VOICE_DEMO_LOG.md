# Voice Mode - Console Log Demonstration

## Simulated User Flow

### 1. Page Load
```
[Analytics] track('sim_case_started', { caseId: 'profitability-001' })
[Voice] SpeechRecognition API detected: ✅
[Voice] VITE_ENABLE_VOICE: 1
[Voice] Voice Mode toggle rendered
```

### 2. User Enables Voice Mode
```
[User Action] Clicked "Voice Mode" checkbox
[Analytics] track('voice_mode_enabled', { caseId: 'profitability-001' })
[Voice] Consent prompt displayed
[LocalStorage] cq_voice_consent: null
```

### 3. User Accepts Consent
```
[User Action] Checked consent checkbox
[LocalStorage] cq_voice_consent: '1'
[Voice] VoiceBar component mounted
[Voice] SpeechRecognition initialized (continuous: true, interimResults: true, lang: 'en-US')
```

### 4. Step 1 - Hypothesis (Voice Input)
```
[User Action] Clicked "Push to talk"
[Voice] recognition.start()
[Voice] Status: Listening...

[SpeechRecognition] Interim result: "The client's revenue has"
[SpeechRecognition] Interim result: "The client's revenue has declined by"
[SpeechRecognition] Final result: "The client's revenue has declined by 15 percent due to increased competition"

[User Action] Clicked "Use transcript"
[Analytics] track('voice_transcript_captured', { step: 1, lengthChars: 82 })
[Voice] processTranscript() called
[State] answers.hypothesis = "The client's revenue has declined by 15 percent due to increased competition"
[Voice] recognition.stop()
```

### 5. Step 2 - Framework (Voice Input)
```
[User Action] Clicked "Next" → Step 2
[Voice] Follow-up hints displayed:
  • Name the top 3 drivers that would confirm or refute this hypothesis.
  • How would you size the impact quickly?

[User Action] Clicked "Push to talk"
[Voice] recognition.start()

[SpeechRecognition] Final result: "I'll use a profitability framework to analyze revenue and cost drivers"

[User Action] Clicked "Use transcript"
[Analytics] track('voice_transcript_captured', { step: 2, lengthChars: 76 })
[Voice] Keyword match: "profitability" → structure = "Profitability"
[State] answers.structure = "Profitability"
```

### 6. Step 3 - Quant Analysis (Voice Input)
```
[User Action] Clicked "Next" → Step 3
[User Action] Clicked "Push to talk"

[SpeechRecognition] Final result: "revenue is 120 million cost is 90 million margin is 30 million"

[User Action] Clicked "Use transcript"
[Analytics] track('voice_transcript_captured', { step: 3, lengthChars: 64 })
[Voice] Regex parsing:
  - Match: "revenue is 120" → revenue: "120"
  - Match: "cost is 90" → cost: "90"
  - Match: "margin is 30" → margin: "30"
[State] answers.quant = { revenue: "120", cost: "90", margin: "30" }
```

### 7. Step 4 - Recommendation (Voice Input)
```
[User Action] Clicked "Next" → Step 4
[User Action] Clicked "Push to talk"

[SpeechRecognition] Final result: "I recommend focusing on cost reduction initiatives targeting the 90 million in expenses. Prioritize operational efficiency and renegotiate supplier contracts. Monitor margin improvement weekly."

[User Action] Clicked "Use transcript"
[Analytics] track('voice_transcript_captured', { step: 4, lengthChars: 198 })
[State] answers.recommendation = "I recommend focusing on cost reduction..."
```

### 8. Get AI Feedback
```
[User Action] Clicked "Get AI Feedback"
[API] POST https://api.casequestapp.com/api/feedback
[API] Request payload:
{
  "userId": "demo",
  "caseId": "profitability-001",
  "steps": {
    "clarifying": ["", "", ""],
    "hypothesis": "The client's revenue has declined by 15 percent due to increased competition",
    "structure": "Profitability",
    "quant": { "revenue": "120", "cost": "90", "margin": "30" },
    "recommendation": "I recommend focusing on cost reduction..."
  }
}

[API] Response received (200 OK)
[Analytics] track('ai_feedback_received', { caseId: 'profitability-001', cached: false })
[State] XP gained: 150 (scorecard.overall: 15 * 10)
[UI] FeedbackPanel rendered with strengths, gaps, actionItems, scorecard
```

### 9. Error Handling Examples

#### Mic Permission Denied
```
[SpeechRecognition] Error: not-allowed
[Voice] Alert: "Microphone access denied. Enable mic in browser settings and reload."
[Voice] recognition.stop()
[State] active = false
```

#### No SpeechRecognition Support (Firefox)
```
[Voice] SpeechRecognition API detected: ❌
[Voice] Fallback textarea rendered
[User Action] Pasted text: "The client's revenue has declined"
[User Action] Blur event triggered
[Voice] processTranscript() called with pasted text
[State] answers.hypothesis = "The client's revenue has declined"
```

## Summary
✅ Voice mode enabled
✅ Transcript captured and mapped to step fields (4 steps)
✅ FeedbackPanel rendered after "Get AI Feedback"
✅ Analytics tracked: voice_mode_enabled, voice_transcript_captured (x4), ai_feedback_received
✅ Text flow still works (can mix voice + typing)
✅ Error handling graceful (mic denied, no SR support)
