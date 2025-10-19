import { track } from './analytics';

const API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY;
const API_URL = 'https://api.elevenlabs.io/v1/text-to-speech';

// Premium voice IDs (from ElevenLabs)
export const PREMIUM_VOICES = {
  rachel: '21m00Tcm4TlvDq8ikWAM',  // Professional female
  adam: 'pNInz6obpgDQGcFmaJgB',    // Professional male
  bella: 'EXAVITQu4vr4xnSDxMaL',   // Warm female
  antoni: 'ErXwobaYiN019PkySvjV',  // Calm male
};

export async function speakPremium(text, voiceId = PREMIUM_VOICES.rachel, options = {}) {
  if (!API_KEY) {
    console.warn('ElevenLabs API key not set');
    return false;
  }

  try {
    const res = await fetch(`${API_URL}/${voiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': API_KEY
      },
      body: JSON.stringify({
        text,
        model_id: options.model || 'eleven_monolingual_v1',
        voice_settings: {
          stability: options.stability || 0.5,
          similarity_boost: options.similarity || 0.75
        }
      })
    });

    if (!res.ok) throw new Error('ElevenLabs API error');

    const audioBlob = await res.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    
    audio.onended = () => URL.revokeObjectURL(audioUrl);
    audio.play();
    
    track('premium_tts_spoken', { voiceId, chars: text.length });
    return true;
  } catch (err) {
    console.error('Premium TTS error:', err);
    return false;
  }
}

export function hasPremiumTTS() {
  return !!API_KEY;
}
