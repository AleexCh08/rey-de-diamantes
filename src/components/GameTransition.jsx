import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { playSound, stopSound } from '../utils/audio';

const LockIcon = () => (
  <svg className="w-5 h-5 text-red-500 drop-shadow-[0_0_8px_rgba(220,38,38,1)]" fill="currentColor" viewBox="0 0 24 24">
    <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" />
  </svg>
);

const DiamondIcon = () => (
  <svg className="w-24 h-24 text-red-600 drop-shadow-[0_0_30px_rgba(220,38,38,0.8)]" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2L2 12l10 10 10-10L12 2z" />
  </svg>
);

export const GameTransition = ({ type, players, onComplete }) => {
  const [shake, setShake] = useState(false);

  useEffect(() => {
    stopSound('atmosphere');
    const duration = type === 2 ? (players.length * 500) + 2500 : 3500;
    
    if (type === 1) playSound('glitch_1');
    if (type === 3) playSound('pulse');
    
    if (type === 2) {
      players.forEach((_, i) => {
        setTimeout(() => {
          setShake(true);
          playSound('lock_beep'); 
          setTimeout(() => setShake(false), 100);
        }, i * 500); 
      });

      setTimeout(() => {
        playSound('door_slam');
      }, (players.length * 500) + 500);
    }

    const timer = setTimeout(() => {
      onComplete();
    }, duration);

    return () => clearTimeout(timer);
  }, [type, players, onComplete]);

  // ==========================================
  // EFECTO 1: GLITCH DEL SISTEMA (Sobrecarga)
  // ==========================================
  if (type === 1) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black overflow-hidden pointer-events-none">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #fff 2px, #fff 4px)' }} />
        
        <motion.div
          animate={{ opacity: [0, 1, 0, 1, 1, 0.8, 1, 0] }}
          transition={{ duration: 3, times: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.8, 1] }}
          className="relative flex items-center justify-center w-full"
        >
          <motion.div
            animate={{ x: [-5, 5, -8, 2, -10, 0], skewX: [0, -15, 20, -5, 10, 0] }}
            transition={{ duration: 0.5, repeat: 4, repeatType: "mirror" }}
            className="absolute inset-0 flex items-center justify-center text-red-600 font-black text-5xl tracking-[0.4em] mix-blend-screen opacity-70 translate-x-1 text-center"
          >
            SISTEMA<br/>LISTO
          </motion.div>
          
          <motion.div
            animate={{ x: [5, -5, 8, -2, 10, 0], skewX: [0, 15, -20, 5, -10, 0] }}
            transition={{ duration: 0.5, repeat: 4, repeatType: "mirror" }}
            className="absolute inset-0 flex items-center justify-center text-cyan-500 font-black text-5xl tracking-[0.4em] mix-blend-screen opacity-70 -translate-x-1 text-center"
          >
            SISTEMA<br/>LISTO
          </motion.div>

          <motion.div
            animate={{ scale: [1, 1.1, 1], filter: ["blur(0px)", "blur(4px)", "blur(0px)"] }}
            transition={{ duration: 0.3, repeat: 8 }}
            className="relative flex items-center justify-center text-white font-black text-5xl tracking-[0.4em] text-center drop-shadow-[0_0_20px_rgba(255,255,255,0.8)] z-10"
          >
            SISTEMA<br/>LISTO
          </motion.div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0, 1, 0] }}
          transition={{ duration: 3, times: [0, 0.8, 0.85, 1] }}
          className="absolute inset-0 bg-white z-20 mix-blend-overlay"
        />
      </div>
    );
  }

  // ==========================================
  // EFECTO 2: SELLADO DE PUERTAS (Lock-in)
  // ==========================================
  if (type === 2) {
    return (
      <motion.div 
        animate={shake ? { x: [-10, 10, -10, 10, 0], y: [-5, 5, -5, 5, 0] } : {}}
        transition={{ duration: 0.1 }}
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black px-6 pointer-events-none overflow-hidden"
      >
        <div className="w-64 max-w-[90%] mx-auto space-y-4 z-10 flex flex-col justify-center">
          {players.map((name, index) => (
            <div key={index} className="flex justify-between items-center border-b border-gray-800 pb-2">
              <span className="text-gray-500 font-mono font-bold uppercase tracking-widest truncate max-w-[80%]">{name}</span>
              <div className="relative w-6 h-6 flex items-center justify-center shrink-0">

                <motion.div 
                  animate={{ opacity: [1, 0] }}
                  transition={{ delay: index * 0.5, duration: 0.1, fillMode: "forwards" }}
                  className="absolute w-2 h-2 bg-gray-600 rounded-full animate-ping"
                />

                <motion.div
                  initial={{ scale: 5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.5, type: "spring", stiffness: 500, damping: 15 }}
                  className="absolute flex items-center justify-center inset-0"
                >
                  <LockIcon />
                </motion.div>
              </div>
            </div>
          ))}
        </div>

        <motion.div
          initial={{ y: "-100%" }}
          animate={{ y: "0%" }}
          transition={{ delay: players.length * 0.5 + 0.5, type: "spring", bounce: 0.2, duration: 0.8 }}
          className="absolute inset-0 bg-red-950 border-b-8 border-red-600 z-20 flex items-center justify-center shadow-[inset_0_-20px_50px_rgba(0,0,0,0.8)]"
        >
          <div className="text-center flex flex-col items-center justify-center">
            <motion.div 
              animate={{ opacity: [0.5, 1, 0.5] }} 
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-red-500 text-sm font-bold tracking-[0.5em] mb-2 text-center"
            >
              CÓDIGO ACEPTADO
            </motion.div>
            <h1 className="text-white text-3xl font-black tracking-widest drop-shadow-[0_4px_4px_rgba(0,0,0,1)] uppercase text-center">
              No hay vuelta<br/>atrás
            </h1>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  // ==========================================
  // EFECTO 3: EL PULSO (Geometría Mortal)
  // ==========================================
  if (type === 3) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black pointer-events-none">
        
        <motion.div
          animate={{ opacity: [0, 0.3, 0, 0, 0.5, 0, 1] }}
          transition={{ duration: 3.5, times: [0, 0.1, 0.3, 0.4, 0.5, 0.8, 1] }}
          className="absolute inset-0 bg-linear-to-t from-red-900 to-transparent"
        />

        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: [0, 1, 1, 1.3, 1, 1, 1.5, 1, 20],
            opacity: [0, 1, 1, 1, 1, 1, 1, 1, 0]
          }}
          transition={{ 
            duration: 3.5, 
            times: [0, 0.2, 0.4, 0.45, 0.5, 0.7, 0.75, 0.8, 1],
            ease: "easeInOut"
          }}
          className="relative flex items-center justify-center w-full h-full"
        >
          <DiamondIcon />

          <motion.div 
            animate={{ scale: [1, 2.5, 1, 3, 1], opacity: [0, 0.5, 0, 0, 0.8, 0] }}
            transition={{ duration: 3.5, times: [0, 0.4, 0.5, 0.7, 0.75, 0.8] }}
            className="absolute inset-0 m-auto w-24 h-24 border-2 border-red-500 rounded-full mix-blend-screen"
          />
        </motion.div>
      </div>
    );
  }

  return null;
};