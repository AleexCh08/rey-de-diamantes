import { motion } from 'framer-motion'
import { useEffect } from 'react'
import { GameButton } from '../components/GameButton'
import { playSound, stopSound } from '../utils/audio'

export const GameOver = ({ players, setCurrentView }) => {
  useEffect(() => {
    playSound('winner');
  }, []);
  
  const survivors = players.filter(p => p.alive);
  
  const isTotalWipeout = survivors.length === 0;
  
  const winner = isTotalWipeout 
    ? null 
    : survivors.length === 1 
      ? survivors[0] 
      : [...players].sort((a, b) => b.score - a.score)[0];
  const rainCards = Array.from({ length: 6 });

  return (
    <div className="flex flex-col h-full w-full p-4 items-center justify-center text-center relative z-10 overflow-hidden gap-y-6">

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        className={`absolute inset-0 -z-10 ${
          isTotalWipeout 
            ? 'bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.15),transparent_70%)]' 
            : 'bg-[radial-gradient(circle_at_center,rgba(234,179,8,0.15),transparent_70%)]'
        }`}
      />

      <div className="absolute inset-0 pointer-events-none -z-10">
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: '100vh', opacity: [0, 0.8, 0] }}
            transition={{ 
              repeat: Infinity, 
              duration: 3 + Math.random() * 2, 
              delay: Math.random() * 5, 
              ease: "linear" 
            }}
            className="absolute text-red-500 text-xl font-bold"
            style={{ left: `${Math.random() * 100}%` }}
          >
            &diams;
          </motion.div>
        ))}
      </div>

      {isTotalWipeout ? (
        <div className="flex flex-col items-center justify-center w-full shrink-0">
          <motion.div
            initial={{ scale: 0, y: -50, rotate: 180 }}
            animate={{ scale: 1, y: 0, rotate: 0 }}
            transition={{ type: "spring", damping: 12, stiffness: 100, delay: 0.3 }}
            className="mb-6"
          >
            <div className="text-9xl text-red-600 drop-shadow-[0_0_30px_rgba(220,38,38,0.8)] leading-none">&diams;</div>
          </motion.div>

          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="text-red-500 font-bold uppercase tracking-[0.4em] text-sm mb-2 shrink-0"
          >
            Fin del Juego
          </motion.span>

          <motion.h2 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.5, type: "spring", bounce: 0.5 }}
            className="text-4xl font-black text-white mb-2 drop-shadow-[0_0_15px_rgba(255,255,255,0.4)] shrink-0 uppercase px-4 leading-tight"
          >
            Ganó el Rey<br/>de Diamantes
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.2 }}
            className="text-gray-500 text-xs tracking-widest uppercase font-bold mt-4"
          >
            [ Cero Sobrevivientes ]
          </motion.p>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center w-full shrink-0">
          <motion.div
            initial={{ scale: 0, y: -50, rotate: -20 }}
            animate={{ scale: 1, y: 0, rotate: 0 }}
            transition={{ type: "spring", damping: 12, stiffness: 100, delay: 0.3 }}
            className="mb-6"
          >
            <svg className="w-28 h-28 text-yellow-500 drop-shadow-[0_0_25px_rgba(234,179,8,0.8)] mx-auto" fill="currentColor" viewBox="0 0 24 24">
              <path d="M5 16L3 5L8.5 10L12 2L15.5 10L21 5L19 16H5ZM19 19C19 19.6 18.6 20 18 20H6C5.4 20 5 19.6 5 19V18H19V19Z" />
            </svg>
          </motion.div>

          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="text-yellow-500 font-bold uppercase tracking-[0.4em] text-sm mb-2 shrink-0"
          >
            Sobreviviente Final
          </motion.span>

          <motion.h2 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.5, type: "spring", bounce: 0.5 }}
            className="text-5xl font-black text-white mb-8 drop-shadow-[0_0_15px_rgba(255,255,255,0.4)] shrink-0 uppercase"
          >
            {winner?.name}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8 }}
            className="text-yellow-500/80 text-xs tracking-[0.3em] uppercase font-bold mb-8"
          >
            [ Nuevo Rey de Diamantes ]
          </motion.p>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.2 }}
            className="bg-gray-950 border border-yellow-900/50 rounded-xl p-4 w-full max-w-50 shadow-[0_0_20px_rgba(234,179,8,0.1)] relative overflow-hidden shrink-0 mx-auto"
          >
            <div className="absolute inset-0 bg-linear-to-t from-yellow-500/10 to-transparent"></div>
            <span className="text-gray-500 text-xs uppercase font-bold tracking-widest block mb-1 relative z-10">Estado</span>
            <span className="text-3xl font-mono font-black text-yellow-500 relative z-10">PV: {10 + winner.score}</span>
          </motion.div>
        </div>
      )}

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 3.5 }}
        className="w-70 shrink-0 z-20 mt-4 self-center"
      >
        <GameButton 
          variant="secondary" 
          onClick={() => {
            stopSound('winner');
            setCurrentView('menu');                   
          }}
        >
          VOLVER AL MENÚ
        </GameButton>
      </motion.div>
      
    </div>
  )
}