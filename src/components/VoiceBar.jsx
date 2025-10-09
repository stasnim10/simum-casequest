import { useEffect, useRef, useState } from 'react';
import { Mic, MicOff, X, Check } from 'lucide-react';

export default function VoiceBar({ onFinalTranscript, onPartial, onCancel, onComplete }) {
  const [active, setActive] = useState(false);
  const [partial, setPartial] = useState('');
  const [finals, setFinals] = useState([]);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    const r = new SR();
    r.continuous = true;
    r.interimResults = true;
    r.lang = 'en-US';
    r.onresult = (e) => {
      let p = '';
      let fs = [...finals];
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const res = e.results[i];
        if (res.isFinal) {
          fs.push(res[0].transcript.trim());
          onFinalTranscript?.(res[0].transcript.trim());
        } else {
          p = res[0].transcript;
          onPartial?.(p);
        }
      }
      setFinals(fs);
      setPartial(p);
    };
    r.onerror = (e) => {
      if (e.error === 'not-allowed') {
        alert('Microphone access denied. Enable mic in browser settings and reload.');
      }
      setActive(false);
    };
    recognitionRef.current = r;
    return () => { try { r.stop(); } catch {} };
  }, [finals, onFinalTranscript, onPartial]);

  const start = () => { try { recognitionRef.current?.start(); setActive(true); } catch {} };
  const stop  = () => { try { recognitionRef.current?.stop();  setActive(false); } catch {} };

  return (
    <div className="card p-3 flex items-center gap-3">
      <button onClick={active ? stop : start} className={`btn ${active ? 'btn-primary' : ''}`}>
        {active ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
        <span className="ml-2">{active ? 'Listening…' : 'Push to talk'}</span>
      </button>
      <div className="flex-1 min-h-[2rem] text-sm text-gray-600 truncate">
        {partial || finals.slice(-1)[0] || 'Say your hypothesis, structure, or next step…'}
      </div>
      <button onClick={() => onCancel?.()} className="btn"><X className="h-4 w-4" /><span className="ml-2">Cancel</span></button>
      <button onClick={() => onComplete?.(finals.join(' ').trim())} className="btn btn-primary">
        <Check className="h-4 w-4" /><span className="ml-2">Use transcript</span>
      </button>
    </div>
  );
}
