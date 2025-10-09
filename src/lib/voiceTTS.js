import { track } from './analytics';

let currentUtterance = null;

export function speak(text, voice = null, rate = 1.05) {
  if (!window.speechSynthesis) return false;
  
  cancelSpeech();
  
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = rate;
  
  if (voice) {
    utterance.voice = voice;
  } else {
    const voices = window.speechSynthesis.getVoices();
    const femaleEnglish = voices.find(v => 
      v.lang.startsWith('en') && (v.name.includes('Female') || v.name.includes('Samantha') || v.name.includes('Victoria'))
    ) || voices.find(v => v.lang.startsWith('en'));
    if (femaleEnglish) utterance.voice = femaleEnglish;
  }
  
  utterance.onstart = () => track('tts_spoken', { chars: text.length });
  utterance.onerror = (e) => console.error('TTS error:', e);
  
  currentUtterance = utterance;
  window.speechSynthesis.speak(utterance);
  return true;
}

export function cancelSpeech() {
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
    currentUtterance = null;
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
