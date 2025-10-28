import { useEffect, useRef, useState } from 'react';
import { Mic, MicOff, X, Check, Edit2 } from 'lucide-react';

export default function VoiceBar({ onFinalTranscript, onPartial, onCancel, onComplete }) {
  const [active, setActive] = useState(false);
  const [partial, setPartial] = useState('');
  const [finals, setFinals] = useState([]);
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState('');
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
    return () => {
      try {
        r.stop();
      } catch (err) {
        console.debug('Speech recognition stop failed', err);
      }
    };
  }, [finals, onFinalTranscript, onPartial]);

  const start = () => {
    try {
      recognitionRef.current?.start();
      setActive(true);
    } catch (err) {
      console.debug('Speech recognition start failed', err);
    }
  };
  const stop  = () => {
    try {
      recognitionRef.current?.stop();
      setActive(false);
    } catch (err) {
      console.debug('Speech recognition stop failed', err);
    }
  };
  
  const startEdit = () => {
    setEditText(finals.join(' ').trim());
    setEditing(true);
  };

  const saveEdit = () => {
    setFinals([editText]);
    setEditing(false);
  };

  return (
    <div className="card p-3 space-y-2">
      <div className="flex items-center gap-3">
        <button onClick={active ? stop : start} className={`btn ${active ? 'btn-primary' : ''}`}>
          {active ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
          <span className="ml-2">{active ? 'Listening…' : 'Push to talk'}</span>
        </button>
        <div className="flex-1 min-h-[2rem] text-sm text-gray-600 truncate">
          {partial || finals.slice(-1)[0] || 'Say your hypothesis, structure, or next step…'}
        </div>
        {finals.length > 0 && !editing && (
          <button onClick={startEdit} className="btn btn-sm">
            <Edit2 className="h-4 w-4" />
          </button>
        )}
        <button onClick={() => onCancel?.()} className="btn"><X className="h-4 w-4" /><span className="ml-2">Cancel</span></button>
        <button onClick={() => onComplete?.(finals.join(' ').trim())} className="btn btn-primary">
          <Check className="h-4 w-4" /><span className="ml-2">Use transcript</span>
        </button>
      </div>
      {editing && (
        <div className="flex gap-2">
          <textarea 
            value={editText} 
            onChange={e => setEditText(e.target.value)}
            className="flex-1 px-3 py-2 border rounded text-sm"
            rows="3"
          />
          <button onClick={saveEdit} className="btn btn-primary">Save</button>
        </div>
      )}
    </div>
  );
}
