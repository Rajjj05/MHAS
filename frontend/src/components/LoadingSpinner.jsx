import React from "react";
import { motion } from "framer-motion";
import { Heart, Brain, Sparkles } from "lucide-react";

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-tranquil-50 to-tranquil-50">
      <div className="text-center">
        <motion.div
          className="relative w-20 h-20 mx-auto mb-6"
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        >
          <div className="absolute inset-0 rounded-full border-4 border-tranquil-200"></div>
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-tranquil-500 border-t-transparent"
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
          <div className="absolute inset-3 bg-gradient-to-br from-tranquil-400 to-tranquil-600 rounded-full flex items-center justify-center">
            <Heart className="w-6 h-6 text-white" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="space-y-2"
        >
          <h3 className="text-lg font-heading font-semibold text-mindful-900">
            Preparing Your Wellness Journey
          </h3>
          <p className="text-mindful-600">
            Loading your personalized experience...
          </p>
        </motion.div>

        {/* Floating Elements */}
        <div className="absolute top-1/4 left-1/4">
          <motion.div
            animate={{ y: [-10, 10, -10] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Brain className="w-6 h-6 text-tranquil-400 opacity-60" />
          </motion.div>
        </div>
        <div className="absolute top-1/3 right-1/4">
          <motion.div
            animate={{ y: [10, -10, 10] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          >
            <Sparkles className="w-5 h-5 text-lavender-400 opacity-60" />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
