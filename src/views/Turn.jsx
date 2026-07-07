import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GameButton } from '../components/GameButton'
import { playSound, stopSound } from '../utils/audio';

const WarningIcon = () => (
  <svg className="w-8 h-8 text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const DangerIcon = () => (
  <svg className="w-8 h-8 text-red-500 animate-pulse drop-shadow-[0_0_8px_rgba(239,68,68,1)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

export const Turn = ({ currentPlayer, currentInput, setCurrentInput, confirmSelection }) => {
  const [isLocked, setIsLocked] = useState(false)
  const [isNumpadOpen, setIsNumpadOpen] = useState(false)

  const [isHolding, setIsHolding] = useState(false)
  const [showTimeout, setShowTimeout] = useState(false);
  const holdTimeoutRef = useRef(null)
  const [timeLeft, setTimeLeft] = useState(30);

  useEffect(() => {
    setTimeLeft(30);
  }, [currentPlayer?.id]);

  useEffect(() => {
    if (isLocked) return;
    
    let syncInterval;
    playSound('clock');
    const initialDelay = setTimeout(() => {
      playSound('glitch');  
      syncInterval = setInterval(() => {
        playSound('glitch');
      }, 3200);
      
    }, 1500);

    return () => {
      clearTimeout(initialDelay);
      if (syncInterval) clearInterval(syncInterval);
      stopSound('clock');
    };
  }, [isLocked]);

  useEffect(() => {
    if (isLocked || showTimeout || isHolding || timeLeft <= 0) return;

    const intervalTimer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(intervalTimer);
  }, [isLocked, showTimeout, isHolding, timeLeft]);

  useEffect(() => {
    if (timeLeft === 0) {
      setIsLocked(true); 
      setShowTimeout(true);
      stopSound('warning_beep');
      playSound('time_out');

      const alertTimer = setTimeout(() => {
        setShowTimeout(false);
        setIsLocked(false);
        confirmSelection(-1); 
      }, 2000);

      return () => clearTimeout(alertTimer);
    }
  }, [timeLeft, confirmSelection]);

  useEffect(() => {
    if (timeLeft <= 5 && timeLeft > 0 && !isLocked && !isHolding) {
      playSound('warning_beep');
    }
  }, [timeLeft, isLocked, isHolding]);

  if (!currentPlayer) return null;

  const isValidInput = currentInput !== '' && Number(currentInput) >= 0 && Number(currentInput) <= 100;

  const handleConfirm = () => {
    if (!isValidInput || isLocked) return;
    
    setIsLocked(true);
    stopSound('warningBeep');
    
    setTimeout(() => {
      confirmSelection();
      setIsLocked(false);
    }, 600);
  };

  const startHold = () => {
    if (!isValidInput || isLocked) return;
    setIsHolding(true);
    playSound('scanner'); 
    
    holdTimeoutRef.current = setTimeout(() => {
      setIsHolding(false);
      handleConfirm();
    }, 1500); 
  };

  const cancelHold = () => {
    if (holdTimeoutRef.current) {
      clearTimeout(holdTimeoutRef.current);
      holdTimeoutRef.current = null;
    }
    if (isHolding) {
      setIsHolding(false);
      stopSound('scanner');
    }
  };

  const getAlert = (score) => {
    const hp = 10 + score;
    if (hp === 1) return { icon: <DangerIcon />, style: "bg-red-950/30 border-red-500 shadow-[inset_0_0_20px_rgba(239,68,68,0.2)]" };
    if (hp === 2) return { icon: <WarningIcon />, style: "bg-amber-950/30 border-amber-500 shadow-[inset_0_0_20px_rgba(245,158,11,0.1)]" };
    return null;
  };

  const alert = getAlert(currentPlayer.score);

  const handlePadClick = (val) => {
    if (isLocked) return; 

    if (val === 'C') {
      setCurrentInput('');
      return;
    }
    
    if (val === 'DEL') {
      setCurrentInput(prev => prev.slice(0, -1));
      return;
    }

    if (currentInput === '0' && val !== '0') {
      setCurrentInput(val); 
      return;
    }
    if (currentInput === '0' && val === '0') return; 

    const nextVal = currentInput + val;
    if (Number(nextVal) >= 0 && Number(nextVal) <= 100) {
      setCurrentInput(nextVal);
    }
  };

  const padKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', 'DEL'];

  return (
    <div className="flex flex-col h-dvh w-full p-4 relative overflow-hidden justify-center gap-y-4">
      
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #fff 2px, #fff 4px)' }} />

      <div className="flex flex-col items-center justify-center relative z-10 shrink-0 w-full">
        <motion.div 
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-red-500 text-[20px] font-black tracking-[0.3em] uppercase mb-1 flex items-center justify-center gap-2"
        >
          <span className="w-1.5 h-3 bg-red-600 rounded-full animate-pulse"></span>
          Sujeto Activo
        </motion.div>
        
        <h2 className="text-5xl sm:text-6xl font-black text-white tracking-widest uppercase drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] leading-none text-center px-2 truncate w-full mb-3">
          {currentPlayer.name}
        </h2>

        <div className="flex items-center justify-center gap-3 w-full mt-2">
          
          <div className="bg-gray-950 border border-gray-800 px-4 py-1.5 rounded-lg flex items-center gap-3 shadow-inner z-10 shrink-0">
            <span className="text-[14px] text-gray-500 font-bold uppercase tracking-widest">Integridad</span>
            <span className={`font-mono text-2xl font-black leading-none ${
              (10 + currentPlayer.score) <= 2 ? 'text-red-500 animate-pulse' : 'text-emerald-500'
            }`}>
              {10 + currentPlayer.score} <span className="text-2xl text-gray-600">PV</span>
            </span>
          </div>
          
          {alert && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className={`p-1.5 rounded-lg border ${alert.style} flex items-center justify-center shadow-md shrink-0`}>
              {alert.icon}
            </motion.div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-center relative z-10 w-full shrink-0 my-2">
        <div className={`relative w-64 h-64 flex items-center justify-center transition-all duration-300 ${
          timeLeft <= 5 && !isLocked && !showTimeout ? 'animate-pulse drop-shadow-[0_0_25px_rgba(239,68,68,0.8)] scale-105' : ''
        }`}>
          
          <svg className="absolute inset-0 w-full h-full transform -rotate-90 drop-shadow-[0_0_15px_rgba(220,38,38,0.4)] pointer-events-none opacity-80" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="48" fill="none" stroke="#111827" strokeWidth="1" />
            <motion.circle
              cx="50" cy="50" r="48"
              fill="none" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="301.6"
              initial={{ strokeDashoffset: 0 }} animate={{ strokeDashoffset: 301.6 }}
              transition={{ duration: 30, ease: "linear" }}
            />
          </svg>

          <motion.div 
            animate={
              isLocked 
                ? { scale: 0.95, opacity: 0.3 } 
                : { x: [0, -3, 3, -3, 2, 0], transition: { delay: 1.5, repeat: Infinity, repeatDelay: 3, duration: 0.2 } }
            } 
            className="relative z-10 w-48 h-48 bg-gray-950/90 border border-gray-800 rounded-full p-4 shadow-[inset_0_0_40px_rgba(0,0,0,0.9)] flex flex-col items-center justify-center backdrop-blur-md"
          >
            <label className="text-gray-500 text-[12px] uppercase tracking-[0.4em] font-black absolute top-8">
              VALOR
            </label>

            <button
              disabled={isLocked}
              onClick={() => { playSound('click'); setIsNumpadOpen(true); }}
              className="w-full h-full flex flex-col items-center justify-center outline-none group rounded-full pt-4"
            >
              <span className={`text-7xl font-black transition-all tracking-widest ${currentInput === '' ? 'text-gray-800' : 'text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]'}`}>
                {currentInput === '' ? '00' : currentInput}
              </span>
            </button>
            
            <div className="absolute bottom-8 w-18 h-2 bg-gray-800 rounded-full overflow-hidden">
              <motion.div animate={{ backgroundColor: isValidInput ? '#ef4444' : '#374151', width: isValidInput ? '100%' : '0%' }} transition={{ duration: 0.3 }} className="h-full" />
            </div>
          </motion.div>

        </div>
      </div>

      <div className="w-25 max-w-[320px] mx-auto z-10 shrink-0 mt-2">
        <motion.div
          onPointerDown={startHold}
          onPointerUp={cancelHold}
          onPointerLeave={cancelHold}
          onContextMenu={(e) => e.preventDefault()}
          className={`relative w-full h-22 bg-gray-950 border-3 rounded-full flex items-center justify-center overflow-hidden transition-all select-none touch-none ${
            isLocked ? 'border-red-900/40 opacity-80' :
            isValidInput ? 'border-red-600 cursor-pointer shadow-[0_0_15px_rgba(220,38,38,0.2)]' : 'border-gray-800 opacity-50'
          }`}
        >
          {isValidInput && !isLocked && (
             <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, #ef4444 10px, #ef4444 20px)' }} />
          )}

          {isValidInput && !isLocked && (
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: isHolding ? '100%' : '0%' }}
              transition={{ duration: isHolding ? 1.5 : 0.15, ease: 'linear' }}
              className="absolute left-0 top-0 bottom-0 bg-red-600 shadow-[0_0_20px_rgba(220,38,38,1)]"
            />
          )}
          
          <div className={`relative z-10 flex items-center justify-center transition-all duration-300 ${
            isLocked ? 'text-gray-500' : isValidInput ? (isHolding ? 'text-white scale-125 drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]' : 'text-red-500 drop-shadow-[0_0_10px_rgba(220,38,38,0.8)]') : 'text-gray-700'
          }`}>
            {isLocked ? (
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8V7z" />
              </svg>
            ) : isHolding ? (
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            ) : (
              <svg className={`w-8 h-8 ${isValidInput ? 'animate-pulse' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
              </svg>
            )}
          </div>
        </motion.div>
      </div>        

      <AnimatePresence>
        {isNumpadOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col justify-end"
          >
            <div className="flex-1 w-full" onClick={() => setIsNumpadOpen(false)} />

            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-gray-950 border-t border-red-900/50 rounded-t-3xl w-full p-6 pb-10 shadow-[0_-10px_40px_rgba(220,38,38,0.15)] flex flex-col items-center gap-y-6 relative"
            >
              <div className="w-12 h-1.5 bg-gray-800 rounded-full mb-2" />

              <div className="w-full text-center text-5xl font-black tracking-widest mb-2 text-white">
                {currentInput === '' ? <span className="text-gray-800">00</span> : currentInput}
              </div>

              <div className="grid grid-cols-3 gap-3 w-full max-w-70">
                {padKeys.map((key) => (
                  <button
                    key={key}
                    onClick={() => handlePadClick(key)}
                    className={`py-4 rounded-xl border-b-4 font-black text-2xl transition-all active:translate-y-1 active:border-b-0 ${
                      key === 'C' ? 'bg-red-950/50 border-red-900 text-red-500 shadow-[0_0_15px_rgba(220,38,38,0.2)]' :
                      key === 'DEL' ? 'bg-amber-950/50 border-amber-900 text-amber-500 text-base' :
                      'bg-gray-900 border-gray-800 text-gray-300 hover:bg-gray-800 hover:text-white shadow-[0_4px_10px_rgba(0,0,0,0.4)]'
                    }`}
                  >
                    {key === 'DEL' ? '⌫' : key}
                  </button>
                ))}
              </div>

              <button
                onClick={() => { playSound('click'); setIsNumpadOpen(false); }}
                className="mt-2 w-24 py-4 rounded-full border-b-4 border-emerald-900 bg-emerald-950/80 text-emerald-500 hover:bg-emerald-800 hover:text-emerald-300 hover:shadow-[0_4px_15px_rgba(52,211,153,0.4)] active:translate-y-1 active:border-b-0 transition-all flex items-center justify-center outline-none group"
              >
                <svg 
                  className="w-8 h-8 drop-shadow-[0_0_10px_rgba(52,211,153,0.8)] group-active:scale-95 transition-transform" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showTimeout && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-red-950/90 backdrop-blur-md flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="text-center"
            >
              <div className="text-6xl text-red-500 font-black tracking-widest uppercase mb-4 animate-pulse">
                [ ALERTA ]
              </div>
              <div className="text-2xl text-white font-black tracking-[0.3em] uppercase drop-shadow-[0_0_10px_rgba(220,38,38,0.8)]">
                TIEMPO AGOTADO
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
    </div>
  )
}