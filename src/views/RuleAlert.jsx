import { motion } from 'framer-motion'
import { useEffect } from 'react'
import { GameButton } from '../components/GameButton'
import { playSound } from '../utils/audio'

export const RuleAlert = ({ players, acknowledgeRule }) => {
  const totalEliminated = 5 - players.filter(p => p.alive).length;

  useEffect(() => {
    const timers = [];

    playSound('system_alert');
    const rulesToDisplay = Math.min(totalEliminated, 3);

    for (let i = 0; i < rulesToDisplay; i++) {
      const printTimer = setTimeout(() => {
        playSound('rule_print');
      }, 1500 + (i * 800)); 
      timers.push(printTimer);
    }

    return () => timers.forEach(timer => clearTimeout(timer));
  }, [totalEliminated]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { delayChildren: 1.5, staggerChildren: 0.8 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
  }

  return (
    <div className="flex flex-col h-dvh w-full p-4 justify-center items-center text-center overflow-hidden gap-y-6">
      
      <div className="flex flex-col items-center justify-center w-full shrink-0">
        <motion.div 
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="mb-2 shrink-0"
        >
          <svg className="w-12 h-12 text-red-600 drop-shadow-[0_0_15px_rgba(220,38,38,0.8)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </motion.div>
        
        <motion.h2 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-2xl font-black text-white mb-1 shrink-0 uppercase"
        >
          ALERTA DEL SISTEMA
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-red-500 font-bold mb-6 uppercase tracking-widest text-[10px] shrink-0"
        >
          Actualización de Condiciones
        </motion.p>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="bg-gray-950 border border-red-900/50 p-6 rounded-xl w-full max-w-md mx-auto space-y-4 shadow-[0_0_20px_rgba(220,38,38,0.1)] text-left flex flex-col justify-center shrink-0"
        >
          <h3 className="text-gray-500 text-[10px] uppercase font-bold text-center tracking-widest mb-1 shrink-0">
            Nuevas reglas en efecto
          </h3>
          
          {totalEliminated >= 1 && (
            <motion.div variants={itemVariants} className="shrink-0">
              <span className="text-red-500 font-black block text-xs mb-0.5">REGLA 1</span>
              <p className="text-gray-300 text-xs leading-snug font-mono border-l-2 border-red-900/50 pl-2 text-justify">
                Si hay un acierto exacto, la penalización para los perdedores se duplica (-2 pts).
              </p>
            </motion.div>
          )}
          
          {totalEliminated >= 2 && (
            <motion.div variants={itemVariants} className="border-t border-gray-800 pt-3 shrink-0">
              <span className="text-red-500 font-black block text-xs mb-0.5">REGLA 2</span>
              <p className="text-gray-300 text-xs leading-snug font-mono border-l-2 border-red-900/50 pl-2 text-justify">
                Los números repetidos en una misma ronda se invalidan automáticamente, pierden una vida.
              </p>
            </motion.div>
          )}

          {totalEliminated >= 3 && (
            <motion.div variants={itemVariants} className="border-t border-gray-800 pt-3 shrink-0">
              <span className="text-red-500 font-black block text-xs mb-0.5">REGLA 3</span>
              <p className="text-gray-300 text-xs leading-snug font-mono border-l-2 border-red-900/50 pl-2 text-justify">
                Si eliges 0 ganas la ronda automáticamente. Sin embargo, si tu oponente elige el 100 vence al 0.
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 4 }}
        className="w-70 shrink-0 z-10 self-center"
      >
        <GameButton 
          variant="alert" 
          onClick={acknowledgeRule}
        >
          ACEPTAR Y CONTINUAR
        </GameButton>
      </motion.div>
      
    </div>
  )
}