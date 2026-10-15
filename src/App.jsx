import { useGame } from './hooks/useGame'
import { Menu } from './views/Menu' 
import { Setup } from './views/Setup'
import { Transition } from './views/Transition'
import { Turn } from './views/Turn'
import { Results } from './views/Results'
import { GameOver } from './views/GameOver'
import { Rules } from './views/Rules'
import { RuleAlert } from './views/RuleAlert'
import { Eliminated } from './views/Eliminated'
import { AnimatePresence } from 'framer-motion'
import { PageTransition } from './components/PageTransition'
import { useEffect, useState } from 'react'
import { playSound, stopSound, setGlobalSoundEnabled, setGlobalVibrationEnabled } from './utils/audio'

export default function App() {
  const {
    currentView, setCurrentView,
    playerNames, handleNameChange, isFormValid, resetPlayerNames,
    players, currentRound, currentInput, setCurrentInput,
    roundStats, currentPlayer,
    startGame, confirmSelection, startNextRound, acknowledgeRule, acknowledgeElimination,
    hasSavedGame, continueGame
  } = useGame()

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);

  const toggleSound = () => {
    const newValue = !soundEnabled;
    setSoundEnabled(newValue);
    setGlobalSoundEnabled(newValue); 
  };
  
  const toggleVibration = () => {
    const newValue = !vibrationEnabled;
    setVibrationEnabled(newValue);
    setGlobalVibrationEnabled(newValue);
  };

  useEffect(() => {
    const introViews = ['menu', 'setup', 'rules'];
    if (introViews.includes(currentView)) {
      playSound('atmosphere');
    } else {
      stopSound('atmosphere');
    }
  }, [currentView]);

  const enforceFullscreen = () => {
    if (document.documentElement.requestFullscreen && !document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {
      });
    }
  };

  return (
    <div 
      onClick={enforceFullscreen} 
      className="fixed inset-0 bg-black flex justify-center items-center overflow-hidden font-sans text-gray-100 selection:bg-red-500/30 select-none touch-manipulation pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]"
    >
      <div className="w-full h-full max-w-md bg-gray-950 sm:shadow-2xl sm:shadow-red-900/10 sm:border sm:border-gray-800 relative flex flex-col sm:h-[85vh] sm:rounded-3xl overflow-hidden">
           
        <header className="p-4 border-b border-red-900/30 bg-gray-900 flex justify-center items-center shadow-md relative z-10 shrink-0">
          <h1 className="text-xl font-black tracking-widest text-red-600 uppercase drop-shadow-md flex items-center gap-2">
            <span className="text-lg">&diams;</span>
            Rey de Diamantes
            <span className="text-lg">&diams;</span>
          </h1>
        </header>

        {['transition', 'turn', 'results'].includes(currentView) && (
          <div className="bg-red-950/20 border-b border-red-900/40 py-1.5 flex justify-center items-center z-10 relative shadow-[0_4px_20px_rgba(220,38,38,0.15)] shrink-0 backdrop-blur-sm">
            <span className="text-gray-200 font-black tracking-[0.4em] uppercase text-sm drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]">
              RONDA {currentRound}
            </span>
          </div>
        )}

        <main className="flex-1 overflow-hidden relative flex flex-col bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-gray-900 via-gray-950 to-black">       
          <AnimatePresence mode="wait">      
            {currentView === 'menu' && (
              <PageTransition transitionKey="menu">
                <Menu 
                  setCurrentView={setCurrentView} 
                  hasSavedGame={hasSavedGame} 
                  continueGame={continueGame} 
                  soundEnabled={soundEnabled}
                  toggleSound={toggleSound}
                  vibrationEnabled={vibrationEnabled}
                  toggleVibration={toggleVibration}
                />
              </PageTransition>
            )}
            
            {currentView === 'setup' && (
              <PageTransition transitionKey="setup">
                <Setup playerNames={playerNames} handleNameChange={handleNameChange} isFormValid={isFormValid} startGame={startGame} setCurrentView={setCurrentView} resetPlayerNames={resetPlayerNames} />
              </PageTransition>
            )}

            {currentView === 'transition' && (
              <PageTransition transitionKey="transition">
                <Transition currentPlayer={currentPlayer} setCurrentView={setCurrentView} />
              </PageTransition>
            )}

            {currentView === 'turn' && (
              <PageTransition transitionKey="turn">
                <Turn currentPlayer={currentPlayer} currentInput={currentInput} setCurrentInput={setCurrentInput} confirmSelection={confirmSelection} />
              </PageTransition>
            )}

            {currentView === 'results' && (
              <PageTransition transitionKey="results">
                <Results roundStats={roundStats} players={players} startNextRound={startNextRound} setCurrentView={setCurrentView} />
              </PageTransition>
            )}

            {currentView === 'gameOver' && (
              <PageTransition transitionKey="gameOver">
                <GameOver players={players} setCurrentView={setCurrentView} />
              </PageTransition>
            )}

            {currentView === 'rules' && (
              <PageTransition transitionKey="rules">
                <Rules setCurrentView={setCurrentView} />
              </PageTransition>
            )}

            {currentView === 'ruleAlert' && (
              <PageTransition transitionKey="ruleAlert">
                <RuleAlert players={players} acknowledgeRule={acknowledgeRule} />
              </PageTransition>
            )}

            {currentView === 'eliminated' && (
              <PageTransition transitionKey="eliminated">
                <Eliminated newlyEliminated={roundStats?.newlyEliminated} acknowledgeElimination={acknowledgeElimination} />
              </PageTransition>
            )}
          </AnimatePresence>
        </main>
        
        <footer className="h-6 border-t border-red-900/40 bg-gray-900 flex justify-center items-center shadow-[0_-4px_20px_rgba(220,38,38,0.05)] z-10 shrink-0">
          <span className="text-[9px] text-red-600 font-black tracking-[0.4em] uppercase">
            <span className="text-lg">&diams;</span>
          </span>
        </footer>

      </div>
    </div>
  )
}