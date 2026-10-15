import { useState, useEffect } from 'react'
import { motion, useMotionValue, useTransform, animate, AnimatePresence } from 'framer-motion'
import { GameButton } from '../components/GameButton'
import { playSound, stopSound } from '../utils/audio'

const ExitIcon = () => (
  <svg className="w-6 h-6 drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

const PVAnimation = ({ start, end }) => {
  const count = useMotionValue(start);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    const controls = animate(count, end, { duration: 1.5, delay: 2.2 });
    return () => controls.stop();
  }, [end, count]);

  return <motion.span>{rounded}</motion.span>;
};

const DamagePop = ({ penalty }) => (
  <motion.span
    initial={{ opacity: 0, x: 0 }}
    animate={{ opacity: [0, 1, 1, 0], x: [0, 10, 10, 20] }}
    transition={{ delay: 2.5, duration: 3, times: [0, 0.1, 0.9, 1] }}
    className="text-red-500 font-black ml-2 text-sm uppercase tracking-widest drop-shadow-[0_0_5px_rgba(239,68,68,1)] inline-block"
  >
    [{penalty} PV]
  </motion.span>
);

export const Results = ({ roundStats, players, startNextRound, setCurrentView }) => {
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);
  const [displayTarget, setDisplayTarget] = useState(0)

  useEffect(() => {
    if (!roundStats) return
    const end = parseFloat(roundStats.target)
    let startTime
    const duration = 1200 

    const animateNumber = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = timestamp - startTime
      const current = Math.min((progress / duration) * end, end)
      setDisplayTarget(current.toFixed(2))
      if (progress < duration) {
        requestAnimationFrame(animateNumber)
      }
    }
    requestAnimationFrame(animateNumber)
  }, [roundStats])

  useEffect(() => {
    if (!roundStats) return;

    playSound('calculating');
    const calcTimer = setTimeout(() => {
      stopSound('calculating'); 
      if (roundStats.exactMatch) {
        playSound('bonus');
      }
    }, 1200);

    const impactTimer = setTimeout(() => {
      playSound('impact');
    }, 2200);

    return () => {
      clearTimeout(calcTimer);
      clearTimeout(impactTimer);
      stopSound('calculating'); 
    };
  }, [roundStats]);

  if (!roundStats) return null

  const sortedPlayers = [...players].sort((a, b) => {
    const aIsNew = roundStats.newlyEliminated.some(ne => ne.id === a.id);
    const bIsNew = roundStats.newlyEliminated.some(ne => ne.id === b.id);
    
    const aActive = a.alive || aIsNew;
    const bActive = b.alive || bIsNew;

    if (aActive !== bActive) return aActive ? -1 : 1;
    return 0;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 1.4 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  }

  return (
    <div className="flex flex-col h-full w-full p-4 relative overflow-hidden justify-center gap-y-2">
      <button
        onClick={() => {
          setIsExitModalOpen(true);
        }}
        className="absolute top-4 left-4 text-gray-600 hover:text-red-500 transition-colors z-20 outline-none"
      >
        <ExitIcon />
      </button>
    
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #fff 2px, #fff 4px)' }} />

      <div className="flex flex-col items-center w-full max-w-70 shrink-0 z-10 gap-1.5 sm:gap-3 self-center">
               
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center w-full"
        >
          <h2 className="text-xl font-black text-white tracking-widest uppercase drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
            RESULTADOS
          </h2>
        </motion.div>
        
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", bounce: 0.5, duration: 0.8 }}
          className="relative bg-gray-900 border-2 border-red-900/50 rounded-xl px-8 py-2 sm:py-4 text-center shadow-[0_0_20px_rgba(0,0,0,0.6),inset_0_0_15px_rgba(220,38,38,0.05)] self-center w-full max-w-xs"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-1.5 bg-red-500 rounded-b-md shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
          <div className="absolute top-2 left-2 w-2 h-2 border-t-2 border-l-2 border-red-500/50" />
          <div className="absolute bottom-2 right-2 w-2 h-2 border-b-2 border-r-2 border-red-500/50" />

          <span className="text-xs text-gray-400 font-black uppercase tracking-[0.4em] block mb-1">
            Objetivo
          </span>
          
          <span className="text-5xl sm:text-6xl font-black text-white drop-shadow-[0_0_20px_rgba(220,38,38,0.9)] leading-none block">
            {displayTarget}
          </span>

        </motion.div>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="flex flex-col justify-center gap-1.5 sm:gap-2 z-10 w-full flex-1 min-h-0"
      >
        {sortedPlayers.map(p => {
          const isJustEliminated = roundStats.newlyEliminated.some(ne => ne.id === p.id);
          const isAlreadyDead = !p.alive && !isJustEliminated;

          if (isAlreadyDead) {
            return (
              <motion.div 
                variants={itemVariants} 
                key={p.id} 
                className="flex items-center justify-between px-3 py-1.5 sm:py-3 rounded-xl bg-gray-900/40 border border-gray-800 opacity-40 shrink-0 shadow-md"
              >
                <span className="font-bold text-red-700/80 line-through tracking-widest text-base uppercase">{p.name}</span>
                <span className="text-red-700/80 font-black tracking-widest uppercase text-xs border border-red-900/30 bg-red-950/20 px-2 py-1 rounded-md">Eliminado</span>
              </motion.div>
            )
          }

          if (p.selection === null) return null;

          return (
            <motion.div 
              variants={itemVariants}
              key={p.id} 
              animate={
                p.isRoundWinner 
                  ? { backgroundColor: ["#111827", "#064e3b", "#022c22"], transition: { duration: 1, delay: 2.2 } }
                  : { x: [0, -3, 3, -3, 3, 0], transition: { duration: 0.4, delay: 2.2 } }
              }
              className={`flex items-center px-3 py-1.5 sm:py-3 rounded-xl border-2 relative overflow-hidden shrink-0 shadow-md ${
                p.isRoundWinner 
                  ? 'bg-emerald-950/40 border-emerald-500 shadow-[inset_0_0_15px_rgba(16,185,129,0.2),0_4px_6px_-1px_rgba(0,0,0,0.4)]' 
                  : 'bg-gray-800/95 border-gray-600 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.4)]'
              }`}
            >
              
              {isJustEliminated && (
                <div className="absolute inset-0 bg-red-950/95 flex items-center justify-center text-base text-red-500 font-black uppercase tracking-[0.3em] z-20 backdrop-blur-md border-2 border-red-500">
                  <span className="animate-ping absolute w-2 h-2 bg-red-500 rounded-full left-4" />
                   Eliminado
                  <span className="animate-ping absolute w-2 h-2 bg-red-500 rounded-full right-4" />
                </div>
              )}

              {p.isRoundWinner ? (
                <div className="absolute left-0 top-0 bottom-0 w-2 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
              ) : (
                <div className="absolute left-0 top-0 bottom-0 w-2 bg-gray-400" />
              )}

              <div className="flex-1 pl-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`font-black tracking-wider text-lg uppercase ${p.isRoundWinner ? 'text-emerald-400 drop-shadow-[0_0_5px_rgba(52,211,153,0.5)]' : 'text-white'}`}>
                    {p.name}
                  </span>
                  {p.isRoundWinner && (
                    <span className="text-[10px] font-black bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/40 tracking-widest uppercase">
                      {players.filter(pl => pl.isRoundWinner).length > 1 ? 'Empate' : 'Seguro'}
                    </span>
                  )}
                </div>
                
                <div className="text-xs text-gray-400 flex items-center font-bold uppercase tracking-widest">
                  Vidas: 
                  <span className={`ml-1 text-sm font-black ${p.isRoundWinner ? 'text-emerald-300' : 'text-gray-100'}`}>
                    <PVAnimation start={p.isRoundWinner ? 10 + p.score : 10 + p.score - (roundStats.exactMatch && roundStats.totalEliminated >= 1 ? -2 : -1)} end={10 + p.score} />
                  </span>
                  {!p.isRoundWinner && (
                    <DamagePop penalty={roundStats.exactMatch && roundStats.totalEliminated >= 1 ? "-2" : "-1"} />
                  )}
                </div>
              </div>

              {p.isRoundWinner && roundStats.exactMatch && roundStats.totalEliminated >= 1 && (
                <div className="flex items-center justify-center px-3">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.2, type: "spring" }}
                    className="text-[9px] font-black bg-amber-500/20 text-amber-400 px-2 py-1 rounded border border-amber-500/40 tracking-[0.2em] uppercase animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.4)] text-center leading-tight shrink-0"
                  >
                    ¡Acierto<br/>Exacto!
                  </motion.div>
                </div>
              )}

              {p.selection === -1 && (
                <div className="flex items-center justify-center px-3">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.2, type: "spring" }}
                    className="text-[9px] font-black bg-red-950/80 text-red-500 px-2 py-1 rounded border border-red-500/40 tracking-[0.2em] uppercase shadow-[0_0_8px_rgba(239,68,68,0.4)] text-center leading-tight shrink-0"
                  >
                    Tiempo<br/>Agotado
                  </motion.div>
                </div>
              )}
     
              <div className="text-right pl-4 border-l-2 border-gray-700/60 shrink-0 min-w-16">
                <span className="text-xs text-gray-400 block uppercase font-black tracking-widest mb-1 text-center">Eligió</span>
                <div className={`text-3xl font-mono font-black flex justify-center leading-none text-center ${p.isRoundWinner ? 'text-emerald-400' : 'text-white'}`}>
                  {p.selection === -1 ? (
                    <svg className="w-8 h-8 text-red-600/80 drop-shadow-[0_0_8px_rgba(220,38,38,0.6)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : (
                    p.selection
                  )}
                </div>
              </div>
            </motion.div>
          )
        })}
      </motion.div>

      <div className="w-full max-w-70 shrink-0 z-10 pt-1 sm:pt-2 self-center">
        <GameButton 
          variant="primary" 
          onClick={startNextRound}
        >
          {players.filter(p => p.alive).length <= 1 ? 'REPORTE FINAL' : 'SIGUIENTE RONDA'}
        </GameButton>
      </div>

      <AnimatePresence>
        {isExitModalOpen && (
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
              className="bg-gray-950 border border-gray-800 rounded-2xl w-full max-w-sm p-6 shadow-[0_0_40px_rgba(0,0,0,0.8)] flex flex-col items-center text-center gap-y-6 relative"
            >
              <h3 className="text-xl font-black text-white uppercase tracking-widest">
                ABANDONAR PARTIDA
              </h3>

              <div className="w-60 flex flex-col gap-y-3">
                <GameButton variant="primary" onClick={() => setCurrentView('menu')}>
                  GUARDAR Y SALIR
                </GameButton>

                <GameButton variant="alert" onClick={() => {
                  localStorage.removeItem('cdb_save');
                  setCurrentView('menu');
                }}>
                  SALIR SIN GUARDAR
                </GameButton>

                <GameButton variant="secondary" onClick={() => setIsExitModalOpen(false)}>
                  CANCELAR
                </GameButton>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
    </div>
  )
}