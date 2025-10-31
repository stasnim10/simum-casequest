import { X } from 'lucide-react';

export default function BadgeModal({ isOpen, onClose, badge }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between">
          <h3 className="text-xl font-bold text-gray-900">Badge earned!</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="text-center">
          <div className="mb-4 text-6xl">{badge?.icon || '🏆'}</div>
          <h4 className="text-lg font-semibold text-gray-900">{badge?.name || 'Achievement'}</h4>
          <p className="mt-2 text-sm text-gray-600">{badge?.description || 'Great job!'}</p>
        </div>
      </div>
    </div>
  );
}
