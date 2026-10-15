import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { GameButton } from '../components/GameButton'
import { GameTransition } from '../components/GameTransition';
import { playSound } from '../utils/audio'

const CheckIcon = () => (
  <svg className="w-6 h-6 text-green-500 drop-shadow-[0_0_5px_rgba(220,38,38,0.5)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
  </svg>
);

export const Setup = ({ playerNames, handleNameChange, isFormValid, startGame, setCurrentView, resetPlayerNames }) => {
  const [warningIndex, setWarningIndex] = useState(null);
  
  useEffect(() => {
    const timeout = setTimeout(() => {
      const invalidIndex = playerNames.findIndex(name => name.trim().length > 0 && name.trim().length < 3);
      setWarningIndex(invalidIndex !== -1 ? invalidIndex : null);
    }, 800);

    return () => clearTimeout(timeout);
  }, [playerNames]);

  const [transitionType, setTransitionType] = useState(0);
  const handleStartGame = () => {
    const randomAnimation = Math.floor(Math.random() * 3) + 1;
    setTransitionType(randomAnimation);
  };

  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [activePlayerIndex, setActivePlayerIndex] = useState(null);

  const qwertyRows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M', 'DEL']
  ];

  const handleKeyClick = (key) => {
    if (activePlayerIndex === null) return;
    const currentName = playerNames[activePlayerIndex];

    if (key === 'DEL') {
      handleNameChange(activePlayerIndex, currentName.slice(0, -1));
    } else {
      if (currentName.length < 12) {
        handleNameChange(activePlayerIndex, currentName + key);
      }
    }
  };

  return (
    <div className="flex flex-col h-full w-full p-4 justify-center gap-y-8 relative animate-fade-in overflow-hidden">
      
      <motion.h2 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-black text-center text-red-500 shrink-0 tracking-[0.45em]"
      >
        JUGADORES
      </motion.h2>
      
      <div className="flex flex-col gap-y-3 overflow-y-auto custom-scrollbar shrink pt-8">
        {playerNames.map((name, index) => {
          const isTyping = name.trim().length > 0;
          const isValid = name.trim().length >= 3;
          
          return (
            <motion.div 
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative flex items-center p-1 rounded-lg border-2 transition-all duration-300 shrink-0 ${
                isValid 
                  ? 'bg-gray-900 border-red-600/50 shadow-[0_0_15px_rgba(220,38,38,0.15)]' 
                  : isTyping ? 'bg-gray-900 border-gray-700' : 'bg-gray-950 border-gray-800'
              }`}
            >
              {warningIndex === index && (
                <motion.div 
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute -top-7 right-8 bg-red-950 border border-red-500 text-red-100 text-[10px] font-bold px-2 py-1 rounded shadow-[0_0_10px_rgba(220,38,38,0.3)] z-20"
                >
                  Mínimo 3 caracteres
                  <div className="absolute top-full right-4 border-[5px] border-transparent border-t-red-500"></div>
                </motion.div>
              )}

              <div className={`px-4 py-3 font-black text-sm tracking-widest border-r transition-colors ${
                isValid ? 'text-red-500 border-red-900/50' : 'text-gray-700 border-gray-800'
              }`}>
                0{index + 1}
              </div>
  
              <button
                onClick={() => {
                  playSound('input_ui');
                  setActivePlayerIndex(index);
                  setIsKeyboardOpen(true);
                }}
                className={`flex-1 bg-transparent px-3 py-2 font-bold focus:outline-none uppercase text-left transition-colors w-full truncate ${
                  isValid ? 'text-white' : 'text-gray-500 text-sm tracking-[0.2em]'
                }`}
              >
                {isTyping ? name : "ESPERANDO SUJETO..."}
              </button>
              
              <div className="pr-3 flex items-center min-w-7 justify-end pointer-events-none">
                {isValid ? (
                  <CheckIcon />
                ) : (
                  <span className={`w-3 h-3 rounded-sm transition-all duration-300 ${
                    isTyping ? 'bg-amber-500 animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.6)]' : 'bg-red-600 animate-pulse shadow-[0_0_8px_rgba(220,38,38,0.8)]'
                  }`}></span>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>

      <div className="shrink-0 flex flex-col gap-y-3 w-70 self-center">
        <GameButton 
          variant={playerNames.every(name => name.trim().length >= 3) ? "primary" : "disabled"} 
          onClick={handleStartGame}
        >
          EMPEZAR JUEGO
        </GameButton>
        
        <GameButton 
          variant="secondary" 
          onClick={() => {
            resetPlayerNames();
            setCurrentView('menu');
          }}
        >
          CANCELAR
        </GameButton>
      </div>

      {transitionType > 0 && (
        <GameTransition 
          type={transitionType} 
          players={playerNames.filter(n => n.trim().length > 0)} 
          onComplete={startGame} 
        />
      )}

      <AnimatePresence>
        {isKeyboardOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col justify-end"
          >

            <div className="flex-1 w-full" onClick={() => setIsKeyboardOpen(false)} />

            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-gray-950 border-t border-red-900/50 rounded-t-3xl w-full p-3 pb-8 shadow-[0_-10px_40px_rgba(220,38,38,0.15)] flex flex-col items-center gap-y-4 relative"
            >
              <div className="w-12 h-1.5 bg-gray-800 rounded-full mb-1" />

              <div className="w-full text-center text-3xl font-black tracking-widest text-white h-15 flex items-center justify-center bg-gray-900/50 rounded-lg border border-gray-800">
                {activePlayerIndex !== null && playerNames[activePlayerIndex]}
                <span className="animate-pulse ml-1 text-red-500">_</span>
              </div>

              <div className="flex flex-col gap-3 w-full max-w-100">
                {qwertyRows.map((row, rowIndex) => (
                  <div key={rowIndex} className="flex justify-center gap-1.5 w-full">
                    {row.map((key) => (
                      <button
                        key={key}
                        onClick={() => {
                          playSound('click2');
                          handleKeyClick(key);
                        }}
                        className={`rounded-md border-b-[5px] font-black transition-all active:translate-y-0.5 active:border-b-0 flex items-center justify-center ${
                          key === 'DEL' 
                            ? 'flex-[1.5] max-w-17.5 h-12 bg-amber-950/50 border-amber-900 text-amber-500 text-sm shadow-[0_2px_8px_rgba(245,158,11,0.2)]' 
                            : 'flex-1 max-w-11 h-12 bg-gray-900 border-gray-800 text-gray-300 hover:bg-gray-800 hover:text-white shadow-[0_2px_8px_rgba(0,0,0,0.4)] text-lg'
                        }`}
                      >
                        {key === 'DEL' ? '⌫' : key}
                      </button>
                    ))}
                  </div>
                ))}
              </div>

              <GameButton variant="primary" onClick={() => setIsKeyboardOpen(false)} className="mt-2 w-full max-w-50">
                CONFIRMAR
              </GameButton>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
    </div>
  )
}