import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LifeBuoy, X, ChevronRight } from 'lucide-react';

const FAQ = [
  {
    title: 'Where am I?',
    description: 'You are on your current step inside Coach Milo’s guided learning journey.'
  },
  {
    title: 'What should I do next?',
    description: 'Tap the big Continue Learning button or follow Milo’s highlighted prompt.'
  },
  {
    title: 'How do I earn XP?',
    description: 'Finish micro-lessons, complete practice drills, and keep your daily streak alive.'
  }
];

export default function HelpBeacon() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-24 right-4 z-40 inline-flex items-center gap-2 px-4 py-3 rounded-full bg-indigo-600 text-white shadow-lg hover:bg-indigo-700"
      >
        <LifeBuoy className="w-5 h-5" />
        Help
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Need a hand?</h3>
                  <p className="text-xs text-gray-500">Coach Milo has quick answers.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                {FAQ.map((item) => (
                  <div key={item.title} className="rounded-xl border border-indigo-100 bg-indigo-50/60 p-4">
                    <div className="flex items-center gap-2 text-indigo-700 font-medium">
                      <ChevronRight className="w-4 h-4" />
                      {item.title}
                    </div>
                    <p className="text-sm text-indigo-900 mt-1 leading-relaxed">{item.description}</p>
                  </div>
                ))}
              </div>

              <div className="grid gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    navigate('/learn');
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700"
                >
                  Open learning modules
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    navigate('/simulator');
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                >
                  Launch simulator
                </button>
              </div>
          </div>
        </div>
      )}
    </>
  );
}
