import { useState, useEffect } from 'react'

export const useGame = () => {
  const [currentView, setCurrentView] = useState('menu')
  const [playerNames, setPlayerNames] = useState(['', '', '', '', ''])
  const [players, setPlayers] = useState([])
  const [currentRound, setCurrentRound] = useState(1)
  const [turnIndex, setTurnIndex] = useState(0)
  const [currentInput, setCurrentInput] = useState('')
  const [roundStats, setRoundStats] = useState(null)
  const [hasSavedGame, setHasSavedGame] = useState(false)
  const isFormValid = playerNames.every(name => name.trim().length > 0)
  const activePlayers = players.filter(p => p.alive)
  const currentPlayer = activePlayers[turnIndex]

  useEffect(() => {
    const saved = localStorage.getItem('cdb_save')
    if (saved) setHasSavedGame(true)
    else setHasSavedGame(false)
  }, [currentView])

  useEffect(() => {
    const activeViews = ['transition', 'turn', 'results', 'ruleAlert', 'eliminated']
    if (activeViews.includes(currentView)) {
      const gameState = {
        players, currentRound, turnIndex, currentView, roundStats, playerNames
      }
      localStorage.setItem('cdb_save', JSON.stringify(gameState))
    }
  }, [players, currentRound, turnIndex, currentView, roundStats, playerNames])

  const continueGame = () => {
    const saved = localStorage.getItem('cdb_save')
    if (saved) {
      const parsed = JSON.parse(saved)
      setPlayers(parsed.players)
      setCurrentRound(parsed.currentRound)
      setTurnIndex(parsed.turnIndex)
      setRoundStats(parsed.roundStats)
      setPlayerNames(parsed.playerNames)
      setCurrentView(parsed.currentView)
    }
  }

  const handleNameChange = (index, value) => {
    const newNames = [...playerNames]
    newNames[index] = value
    setPlayerNames(newNames)
  }

  const startGame = () => {
    if (!isFormValid) return
    const initialPlayers = playerNames.map((name, index) => ({
      id: index,
      name: name.trim(),
      score: 0,
      alive: true,
      selection: null
    }))
    setPlayers(initialPlayers)
    setCurrentRound(1)
    setTurnIndex(0)
    setCurrentView('transition')
    setPlayerNames(['', '', '', '', ''])
  }

  const processRound = (currentPlayersState) => {
    const totalPlayers = currentPlayersState.length;
    const alivePlayers = currentPlayersState.filter(p => p.alive)
    const activeParticipants = alivePlayers.filter(p => p.selection !== -1)
    const n = activeParticipants.length
    
    const totalEliminated = totalPlayers - alivePlayers.length

    const sum = activeParticipants.reduce((acc, p) => acc + p.selection, 0)
    const average = n > 0 ? sum / n : 0
    const target = average * 0.8

    let roundWinners = []
    let exactMatch = false

    if (totalEliminated >= 2) {
      const counts = {}
      activeParticipants.forEach(p => counts[p.selection] = (counts[p.selection] || 0) + 1)
      alivePlayers.forEach(p => { 
        if (p.selection !== -1 && counts[p.selection] > 1) p.invalidated = true 
      })
    }

    if (totalEliminated >= 3 && n === 2) {
      const p1 = alivePlayers[0], p2 = alivePlayers[1]
      if (!p1.invalidated && !p2.invalidated) {
        if (p1.selection === 0 && p2.selection === 100) roundWinners.push(p2.id)
        else if (p2.selection === 0 && p1.selection === 100) roundWinners.push(p1.id)
        else if (p1.selection === 0) roundWinners.push(p1.id)
        else if (p2.selection === 0) roundWinners.push(p2.id)
      }
    }

    if (roundWinners.length === 0) {
      let validPlayers = alivePlayers.filter(p => !p.invalidated && p.selection !== -1)
      if (validPlayers.length > 0) {
        let minDiff = Infinity
        validPlayers.forEach(p => {
          const diff = Math.abs(p.selection - target)
          if (diff < minDiff) minDiff = diff
        })
        validPlayers.forEach(p => {
          const diff = Math.abs(p.selection - target)
          if (diff === minDiff) {
            roundWinners.push(p.id)
            if (p.selection === Math.round(target)) exactMatch = true 
          }
        })
      }
    }

    let penalty = -1
    if (totalEliminated >= 1 && exactMatch) {
      penalty = -2
    }

    let newlyEliminated = []

    const finalPlayers = currentPlayersState.map(p => {
      if (!p.alive) return p
      
      const isWinner = roundWinners.includes(p.id)
      const newScore = isWinner ? p.score : p.score + penalty
      const isNowDead = newScore <= -10
      
      if (isNowDead) {
        newlyEliminated.push({ ...p, score: newScore })
      }
      
      return {
        ...p, 
        score: newScore, 
        alive: !isNowDead, 
        invalidated: false, 
        isRoundWinner: isWinner
      }
    })

    setPlayers(finalPlayers)
    
    setRoundStats({ target: target.toFixed(2), exactMatch, totalEliminated, newlyEliminated })
    setCurrentView('results')
  }

  const confirmSelection = (forcedValue = null) => {
    let number;
    if (forcedValue !== null) {
      number = forcedValue;
    } else {
      number = parseInt(currentInput, 10);
      if (isNaN(number) || number < 0 || number > 100) return;
    }   
    const updatedPlayers = players.map(p => p.id === currentPlayer.id ? { ...p, selection: number } : p)

    setPlayers(updatedPlayers)
    setCurrentInput('') 
    if (turnIndex + 1 < activePlayers.length) {
      setTurnIndex(turnIndex + 1)
      setCurrentView('transition') 
    } else {
      processRound(updatedPlayers)
    }
  }

  const proceedToNextPhase = () => {
    const survivors = players.filter(p => p.alive)
    const currentEliminated = players.length - survivors.length

    if (survivors.length <= 1) {
      localStorage.removeItem('cdb_save')
      setCurrentView('gameOver')
    } else if (currentEliminated > roundStats.totalEliminated) {
      setCurrentView('ruleAlert')
    } else {
      setCurrentRound(currentRound + 1)
      setTurnIndex(0)
      setCurrentView('transition')
    }
  }

  const startNextRound = () => {
    if (roundStats && roundStats.newlyEliminated && roundStats.newlyEliminated.length > 0) {
      setCurrentView('eliminated')
    } else {
      proceedToNextPhase()
    }
  }

  const acknowledgeElimination = () => {
    proceedToNextPhase()
  }

  const acknowledgeRule = () => {
    setCurrentRound(currentRound + 1)
    setTurnIndex(0)
    setCurrentView('transition')
  }

  const resetPlayerNames = () => {
    setPlayerNames(['', '', '', '', '']);
  };

  return {
    currentView, setCurrentView,
    playerNames, handleNameChange, isFormValid, resetPlayerNames,
    players, currentRound, currentInput, setCurrentInput,
    roundStats, currentPlayer,
    startGame, confirmSelection, startNextRound, acknowledgeRule, acknowledgeElimination,
    hasSavedGame, continueGame
  }
}