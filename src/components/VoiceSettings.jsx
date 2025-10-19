import { useState, useEffect } from 'react';
import { Settings } from 'lucide-react';
import { getVoices, getVoicePrefs, setVoicePrefs, speak } from '../lib/voiceTTS';
import { hasPremiumTTS, speakPremium, PREMIUM_VOICES } from '../lib/elevenLabsTTS';

export default function VoiceSettings() {
  const [show, setShow] = useState(false);
  const [voices, setVoices] = useState([]);
  const [prefs, setPrefs] = useState(getVoicePrefs());
  const [usePremium, setUsePremium] = useState(false);

  useEffect(() => {
    const loadVoices = () => setVoices(getVoices().filter(v => v.lang.startsWith('en')));
    loadVoices();
    speechSynthesis.addEventListener('voiceschanged', loadVoices);
    return () => speechSynthesis.removeEventListener('voiceschanged', loadVoices);
  }, []);

  const updatePref = (key, value) => {
    const newPrefs = { ...prefs, [key]: value };
    setPrefs(newPrefs);
    setVoicePrefs(newPrefs);
  };

  const testVoice = () => {
    if (usePremium && hasPremiumTTS()) {
      speakPremium('This is how I sound with premium voice.');
    } else {
      speak('This is how I sound with your current settings.');
    }
  };

  return (
    <div className="relative">
      <button onClick={() => setShow(!show)} className="btn btn-sm">
        <Settings className="h-4 w-4" />
      </button>
      {show && (
        <div className="absolute right-0 top-12 w-80 bg-white border rounded-lg shadow-lg p-4 z-50">
          <h3 className="font-semibold mb-3">Voice Settings</h3>
          
          {hasPremiumTTS() && (
            <label className="flex items-center gap-2 mb-3">
              <input 
                type="checkbox" 
                checked={usePremium}
                onChange={e => setUsePremium(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm text-gray-700">Use Premium Voice (ElevenLabs)</span>
            </label>
          )}

          {usePremium && hasPremiumTTS() ? (
            <label className="block mb-3">
              <span className="text-sm text-gray-700">Premium Voice</span>
              <select 
                value={prefs.premiumVoice || 'rachel'} 
                onChange={e => updatePref('premiumVoice', e.target.value)}
                className="w-full mt-1 px-3 py-2 border rounded"
              >
                <option value="rachel">Rachel (Professional Female)</option>
                <option value="adam">Adam (Professional Male)</option>
                <option value="bella">Bella (Warm Female)</option>
                <option value="antoni">Antoni (Calm Male)</option>
              </select>
            </label>
          ) : (
            <>
              <label className="block mb-3">
                <span className="text-sm text-gray-700">Voice</span>
                <select 
                  value={prefs.voiceName || ''} 
                  onChange={e => updatePref('voiceName', e.target.value || null)}
                  className="w-full mt-1 px-3 py-2 border rounded"
                >
                  <option value="">Auto (Default)</option>
                  {voices.map(v => (
                    <option key={v.name} value={v.name}>{v.name}</option>
                  ))}
                </select>
              </label>

              <label className="block mb-3">
                <span className="text-sm text-gray-700">Speed: {prefs.rate.toFixed(2)}x</span>
                <input 
                  type="range" 
                  min="0.5" 
                  max="2" 
                  step="0.1" 
                  value={prefs.rate}
                  onChange={e => updatePref('rate', parseFloat(e.target.value))}
                  className="w-full"
                />
              </label>

              <label className="block mb-3">
                <span className="text-sm text-gray-700">Pitch: {prefs.pitch.toFixed(1)}</span>
                <input 
                  type="range" 
                  min="0.5" 
                  max="2" 
                  step="0.1" 
                  value={prefs.pitch}
                  onChange={e => updatePref('pitch', parseFloat(e.target.value))}
                  className="w-full"
                />
              </label>

              <label className="block mb-3">
                <span className="text-sm text-gray-700">Volume: {Math.round(prefs.volume * 100)}%</span>
                <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.1" 
                  value={prefs.volume}
                  onChange={e => updatePref('volume', parseFloat(e.target.value))}
                  className="w-full"
                />
              </label>
            </>
          )}

          <button onClick={testVoice} className="btn btn-primary w-full">Test Voice</button>
        </div>
      )}
    </div>
  );
}
