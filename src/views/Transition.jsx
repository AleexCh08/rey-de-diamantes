import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { playSound, stopSound } from '../utils/audio';

const ScannerIcon = () => (
  <svg className="w-24 h-24 text-red-500 opacity-80 drop-shadow-[0_0_15px_rgba(220,38,38,0.6)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
  </svg>
);

export const Transition = ({ currentPlayer, setCurrentView }) => {
  useEffect(() => {
    if (!currentPlayer) return;
    const scannerInterval = setInterval(() => {
      playSound('scanner');
    }, 2000);

    return () => clearInterval(scannerInterval);
  }, [currentPlayer]);

  if (!currentPlayer) return null;

  return (
    <div className="flex flex-col h-full w-full p-4 justify-center items-center gap-y-10 relative overflow-hidden">
      
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #fff 2px, #fff 4px)' }} />
      
      <motion.div 
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        className="text-red-500 text-xs font-black tracking-[0.4em] uppercase text-center flex items-center justify-center gap-2 z-10 shrink-0"
      >
        <span className="w-2 h-4 bg-red-600 rounded-full animate-pulse"></span>
        Transfiriendo dispositivo
      </motion.div>

      <motion.div 
        initial={{ scale: 0.8, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="relative w-full px-4 text-center z-10 shrink-0"
      >
        <div className="absolute inset-0 bg-red-900/20 blur-2xl rounded-full" />
        
        <h2 className="relative text-5xl font-black text-white tracking-widest drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] uppercase wrap-break-word leading-tight px-2">
          {currentPlayer.name}
        </h2>
      </motion.div>

      <motion.button 
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          whileTap={{ scale: 0.9, opacity: 0.8 }}
          transition={{ delay: 0.3, duration: 0.8, type: "spring" }}
          onClick={() => {
            playSound('click');
            setCurrentView('turn');
          }}
          className="relative w-56 h-56 flex items-center justify-center outline-none group"
        >
          <motion.div 
            animate={{ scale: [1, 1.25, 1], opacity: [0.1, 0.5, 0.1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute inset-0 border-2 border-red-500/40 rounded-full group-active:border-red-500/80 transition-colors"
          />
          <motion.div 
            animate={{ scale: [1, 1.5, 1], opacity: [0.05, 0.2, 0.05] }}
            transition={{ repeat: Infinity, duration: 2, delay: 0.3 }}
            className="absolute inset-0 border border-red-500/20 rounded-full"
          />
          
          <motion.div 
            animate={{ y: [-55, 55, -55] }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            className="absolute w-32 h-1 bg-red-500 shadow-[0_0_20px_rgba(220,38,38,1)] z-20 rounded-full"
          />
          
          <ScannerIcon />
        </motion.button>

        <motion.div 
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="text-red-500 text-sm font-black tracking-[0.3em] uppercase text-center"
        >
          [ COLOCA TU DEDO ]
        </motion.div>
      
    </div>
  );
}