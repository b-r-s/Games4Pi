import { useState } from 'react';
import './App.css';
import { Board } from './components/Board';
import { Sidebar } from './components/Sidebar';
import { useGameState } from './hooks/useGameState';
import type { BoardState } from './types/game';

function App() {
  const { gameState, handleTileClick, movePiece, setAILevel, restartGame, toastMessage } = useGameState();

  return (
    <div className="app-container">
      <div className="game-layout">
        <div className="main-content">
          <Board
            gameState={gameState}
            onTileClick={handleTileClick}
            onMovePiece={movePiece}
            onRestart={restartGame}
            toastMessage={toastMessage}
          />
        </div>
        <Sidebar
          aiLevel={gameState.aiLevel}
          onAILevelChange={setAILevel}
          scores={gameState.scores}
          currentPlayer={gameState.currentPlayer}
          turnStartTime={gameState.turnStartTime}
          totalTime={gameState.totalTime}
        />
      </div>
    </div>
  );
}

export default App;
