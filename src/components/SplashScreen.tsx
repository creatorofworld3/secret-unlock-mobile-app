
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { SplashScreen } from '@capacitor/splash-screen';

interface SplashScreenComponentProps {
  onComplete: () => void;
}

const SplashScreenComponent: React.FC<SplashScreenComponentProps> = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      SplashScreen.hide();
      onComplete();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-zkp-gradient flex items-center justify-center">
      <div className="text-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8"
        >
          <div className="w-24 h-24 mx-auto mb-6 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="text-4xl text-white"
            >
              🔐
            </motion.div>
          </div>
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-3xl font-bold text-white mb-2"
        >
          ZKP Auth
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="text-white/80 text-lg"
        >
          Zero-Knowledge Authentication
        </motion.p>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1.2, duration: 0.4 }}
          className="mt-8"
        >
          <div className="w-8 h-8 mx-auto border-2 border-white/30 border-t-white rounded-full animate-spin" />
        </motion.div>
      </div>
    </div>
  );
};

export default SplashScreenComponent;
