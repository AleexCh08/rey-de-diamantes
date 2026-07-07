import { motion } from 'framer-motion'
import { useEffect } from 'react'
import { GameButton } from '../components/GameButton'
import { playSound, triggerVibration } from '../utils/audio'

export const Eliminated = ({ newlyEliminated, acknowledgeElimination }) => {

  useEffect(() => {
    if (!newlyEliminated || newlyEliminated.length === 0) return;

    const timers = [];

    newlyEliminated.forEach((_, index) => {
      const slamTimer = setTimeout(() => {
        playSound('slam');
      }, index * 400);

      const slashTimer = setTimeout(() => {
        playSound('slash');
        triggerVibration(100);
      }, (index * 400) + 400);

      timers.push(slamTimer, slashTimer);
    });

    return () => timers.forEach(timer => clearTimeout(timer));
  }, [newlyEliminated]);

  if (!newlyEliminated || newlyEliminated.length === 0) return null;

  return (
    <div className="flex flex-col absolute inset-0 z-50 bg-red-950/90 backdrop-blur-md p-4 overflow-y-auto text-center">
      
      <div className="m-auto flex flex-col items-center justify-center w-full py-4">
        
        <motion.h2 
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="text-red-500 font-black tracking-[0.3em] uppercase text-xl shrink-0 mb-6 text-center"
        >
          Alerta de Eliminación
        </motion.h2>
        
        <div className="flex flex-col gap-y-4 w-full items-center">
          {newlyEliminated.map((p, index) => (
            <motion.div 
              key={p.id} 
              initial={{ scale: 1.8, opacity: 0, rotate: -3 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ 
                delay: index * 0.4, 
                type: "spring", 
                stiffness: 400, 
                damping: 15,
                mass: 1.5 
              }}
              className="bg-black border-2 border-red-600 rounded-2xl p-5 shadow-[0_0_30px_rgba(220,38,38,0.6)] relative overflow-hidden w-85 max-w-sm shrink-0"
            >
              <motion.div 
                initial={{ opacity: 1 }}
                animate={{ opacity: 0 }}
                transition={{ delay: index * 0.4 + 0.1, duration: 0.4 }}
                className="absolute inset-0 bg-red-600 z-0"
              />

              <span className="text-gray-500 font-bold uppercase text-[15px] tracking-widest block mb-1 relative z-10">
                Jugador Retirado
              </span>
              
              <div className="relative inline-block z-10">
                <h3 className="text-white text-3xl font-black uppercase tracking-widest leading-none">
                  {p.name}
                </h3>
                
                <motion.div 
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: '100%', opacity: 1 }}
                  transition={{ delay: (index * 0.4) + 0.4, duration: 0.2, ease: "easeOut" }}
                  className="absolute top-1/2 left-0 h-1.5 bg-red-600 -translate-y-1/2 shadow-[0_0_15px_rgba(220,38,38,1)]"
                />
              </div>
            </motion.div>
          ))}
        </div>

        <div className='w-60 shrink-0 z-10 mt-6'>
          <GameButton
            variant="alert" 
            onClick={acknowledgeElimination}
          >
            CONTINUAR
          </GameButton>
        </div>

      </div>
    </div>
  )
}