import { motion } from 'framer-motion'
import { GameButton } from '../components/GameButton';

export const Rules = ({ setCurrentView }) => {
  return (
    <div className="flex flex-col h-full w-full sm:p-4 overflow-hidden">
      
      <div className="flex-1 min-h-0 flex flex-col items-center justify-center w-full px-5 max-w-md mx-auto py-2 gap-y-4">
        
        <motion.h2 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-2xl font-black text-white text-center shrink-0"
        >
          REGLAS
        </motion.h2>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col gap-y-2 sm:gap-y-4 w-full shrink min-h-0"
        >

          <div className="bg-gray-800/90 p-4 rounded-xl border border-gray-700 flex flex-col justify-center shrink min-h-0">
            <h3 className="text-red-500 font-black text-sm uppercase tracking-widest mb-1 text-center">Objetivo</h3>
            <p className="text-white text-sm leading-snug text-center">
              Coloca un número del 0 al 100. Intenta adivinar el 80% del promedio antes de agotarse el tiempo. El que más se acerque al número objetivo gana la ronda.
            </p>
          </div>

          <div className="bg-gray-800/90 p-6 rounded-xl border border-gray-700 flex flex-col justify-center">
            <h3 className="text-red-500 font-black text-sm uppercase tracking-widest mb-1 text-center">Penalización</h3>
            <p className="text-white text-base leading-snug text-center">
              Los perdedores pierden -1 PV. Empiezas con 10 PV, si llegas a 0, quedas eliminado.
            </p>
          </div>

          <div className="bg-gray-800/90 p-6 rounded-xl border border-gray-700 flex flex-col justify-center">
            <h3 className="text-red-500 font-black text-sm uppercase tracking-widest mb-1 text-center">Reglas Ocultas</h3>
            <p className="text-white text-base leading-snug text-center">
              Por cada jugador eliminado, se desbloquean reglas más estrictas, aumentando el reto del juego.
            </p>
          </div>

        </motion.div>

        <div className="shrink-0 w-full max-w-70 mt-2">
          <GameButton variant="primary" onClick={() => setCurrentView('menu')}>
            ENTENDIDO
          </GameButton>
        </div>
        
      </div>
    </div>
  )
}