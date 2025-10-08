import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Landing() {
  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-2xl"
      >
        <h1 className="text-5xl font-bold text-gray-900 mb-4">CaseQuest</h1>
        <p className="text-xl text-gray-600 mb-8">
          Master consulting case interviews through gamified learning
        </p>
        <Link
          to="/dashboard"
          className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Get Started
        </Link>
      </motion.div>
    </div>
  );
}
