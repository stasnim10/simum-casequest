import { track } from './analytics';
let voicePrefs = JSON.parse(localStorage.getItem('cq_voice_prefs') || '{"rate":1.05,"pitch":1,"volume":1,"voiceName":null}');

export function getVoices() {
  return window.speechSynthesis?.getVoices() || [];
}

export function getVoicePrefs() {
  return voicePrefs;
}

export function setVoicePrefs(prefs) {
  voicePrefs = { ...voicePrefs, ...prefs };
  localStorage.setItem('cq_voice_prefs', JSON.stringify(voicePrefs));
}

function selectVoice() {
  const voices = getVoices();
  if (voicePrefs.voiceName) {
    const selected = voices.find(v => v.name === voicePrefs.voiceName);
    if (selected) return selected;
  }
  const enVoices = voices.filter(v => v.lang.startsWith('en'));
  return enVoices.find(v => v.name.includes('Samantha') || v.name.includes('Victoria') || v.name.includes('Female')) || enVoices[0];
}

export function speak(text, voice = null, rate = null) {
  if (!window.speechSynthesis) return false;
  
  cancelSpeech();
  
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = rate || voicePrefs.rate;
  utterance.pitch = voicePrefs.pitch;
  utterance.volume = voicePrefs.volume;
  utterance.voice = voice || selectVoice();
  
  utterance.onstart = () => track('tts_spoken', { chars: text.length });
  utterance.onerror = (e) => console.error('TTS error:', e);
  
  window.speechSynthesis.speak(utterance);
  return true;
}

export function cancelSpeech() {
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}

export function pauseSpeech() {
  if (window.speechSynthesis && window.speechSynthesis.speaking) {
    window.speechSynthesis.pause();
    track('tts_paused');
  }
}

export function resumeSpeech() {
  if (window.speechSynthesis && window.speechSynthesis.paused) {
    window.speechSynthesis.resume();
    track('tts_resumed');
  }
}

export function isSpeaking() {
  return window.speechSynthesis?.speaking || false;
}

export function hasTTSSupport() {
  return !!(window.speechSynthesis && window.SpeechSynthesisUtterance);
}
