import { useState } from 'react'
import logoImg from '../assets/logo.png'
import { motion, AnimatePresence } from 'framer-motion'
import { GameButton } from '../components/GameButton'

const GearIcon = () => (
  <svg className="w-6 h-6 drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const CloseIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const IGIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
  </svg>
);

const WarningIcon = () => (
  <svg className="w-12 h-12 text-red-500 mb-2 drop-shadow-[0_0_15px_rgba(220,38,38,0.8)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

export const Menu = ({ 
  setCurrentView, 
  hasSavedGame, 
  continueGame, 
  soundEnabled = true, 
  toggleSound, 
  vibrationEnabled = true, 
  toggleVibration 
}) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isWarningOpen, setIsWarningOpen] = useState(false);

  const handleNewGameClick = () => {
    if (hasSavedGame) {
      setIsWarningOpen(true);
    } else {
      setCurrentView('setup');
    }
  };

  return (
    <div className="flex flex-col h-full w-full p-5 gap-y-6">

      <button 
        onClick={() => setIsSettingsOpen(true)}
        className="absolute top-6 left-6 text-gray-600 hover:text-white transition-colors z-10"
      >
        <GearIcon />
      </button>

      <AnimatePresence>
        {isSettingsOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-gray-950 border border-red-900/50 rounded-2xl w-full max-w-sm p-6 shadow-[0_0_30px_rgba(220,38,38,0.15)] flex flex-col gap-y-6 relative"
            >
              <button 
                onClick={() => setIsSettingsOpen(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition-colors"
              >
                <CloseIcon />
              </button>

              <h3 className="text-xl font-black text-white uppercase tracking-widest text-center border-b border-gray-800 pb-4">
                Ajustes del Sistema
              </h3>

              <div className="flex flex-col gap-y-4 w-70 self-center">
                <div className="flex items-center justify-between bg-gray-900/50 p-3 rounded-lg border border-gray-800">
                  <span className="text-gray-300 font-bold text-xs uppercase tracking-widest">Efectos de Sonido</span>
                  <button 
                    onClick={toggleSound} 
                    className={`w-12 h-6 rounded-full transition-colors relative ${soundEnabled ? 'bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.6)]' : 'bg-gray-700'}`}
                  >
                    <div className={`absolute top-1 bg-white w-4 h-4 rounded-full transition-transform ${soundEnabled ? 'left-7' : 'left-1'}`} />
                  </button>
                </div>

                <div className="flex items-center justify-between bg-gray-900/50 p-3 rounded-lg border border-gray-800">
                  <span className="text-gray-300 font-bold text-xs uppercase tracking-widest">Vibración</span>
                  <button 
                    onClick={toggleVibration} 
                    className={`w-12 h-6 rounded-full transition-colors relative ${vibrationEnabled ? 'bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.6)]' : 'bg-gray-700'}`}
                  >
                    <div className={`absolute top-1 bg-white w-4 h-4 rounded-full transition-transform ${vibrationEnabled ? 'left-7' : 'left-1'}`} />
                  </button>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-800 flex flex-col items-center gap-y-2">
                <span className="text-gray-500 text-[10px] uppercase font-bold tracking-[0.2em]">
                  Desarrollador Principal
                </span>
                <a 
                  href="https://instagram.com/aleexch0" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-2 text-gray-300 hover:text-red-500 transition-colors"
                >
                  <IGIcon />
                  <span className="text-sm font-black uppercase tracking-widest">AleexCh</span>
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}

        {isWarningOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-gray-950 border border-red-600/50 rounded-2xl w-full max-w-sm p-6 shadow-[0_0_40px_rgba(220,38,38,0.3)] flex flex-col items-center text-center gap-y-4 relative"
            >
              <WarningIcon />       
              <h3 className="text-xl font-black text-white uppercase tracking-widest">
                ¿Estás Seguro?
              </h3>
              
              <p className="text-gray-400 text-xs font-mono leading-relaxed mb-2">
                Se va a sobrescribir tu progreso actual de forma permanente.
              </p>

              <div className="w-50 flex flex-col gap-y-3 self-center">
                <GameButton variant="alert" onClick={() => {
                  localStorage.removeItem('cdb_save');
                  setCurrentView('setup');
                }}>
                  SOBRESCRIBIR
                </GameButton>
                <GameButton variant="secondary" onClick={() => setIsWarningOpen(false)}>
                  CANCELAR
                </GameButton>
              </div>
            </motion.div>
          </motion.div>
        )} 
      </AnimatePresence>

      <div className="flex flex-col items-center justify-center grow min-h-0 gap-y-4">
        <motion.div
          initial={{ opacity: 0, scale: 2 }}
          animate={{ opacity: 1, scale: 0.95 }}
          transition={{ duration: 0.8 }}
          className="w-full grow flex justify-center items-center overflow-hidden"
        >
          <img 
            src={logoImg} 
            alt="Logo Rey de Diamantes" 
            className="max-h-full w-auto object-contain drop-shadow-[0_0_15px_rgba(220,38,38,0.6)]"
          />
        </motion.div>
        
        <div className="text-center space-y-2 shrink-0">
          <h2 className="text-3xl font-black text-white tracking-tight leading-tight">
            CONCURSO DE <br/>
            <span className="text-red-500">BELLEZA</span>
          </h2>
          <p className="text-gray-400 text-sm px-2 text-center">
            Piensa como la mayoría, pero un poco menos.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-y-3 shrink-0 w-70 self-center">
        {hasSavedGame && (
          <GameButton variant="success" onClick={continueGame}>
            Continuar Partida
          </GameButton>
        )}

        <GameButton variant="primary" onClick={handleNewGameClick}>
          Partida Nueva
        </GameButton>
        
        <GameButton variant="secondary" onClick={() => setCurrentView('rules')}>
          Reglas del Juego
        </GameButton>
      </div>
    </div>
  )
}