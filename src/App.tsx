import { useState } from 'react';
import './App.css';
import { Board } from './components/Board';
import { Sidebar } from './components/Sidebar';
import { useGameState } from './hooks/useGameState';
import type { BoardState } from './types/game';

function App() {
  const { gameState, handleTileClick, movePiece, setAILevel } = useGameState();
  const [testMode, setTestMode] = useState(false);

  // Test scenario: Place a Black piece at row 6 to easily test kinging
  const setupKingingTest = () => {
    const testBoard: BoardState = Array(8)
      .fill(null)
      .map(() => Array(8).fill(null));

    // Place a Black piece at row 6, col 1 (one move away from kinging at row 7)
    testBoard[6][1] = { color: 'black', isKing: false };

    // Place a Red piece at row 1, col 2 (one move away from kinging at row 0)
    testBoard[1][2] = { color: 'red', isKing: false };

    console.log('TEST MODE: Black piece at row 6, Red piece at row 1');
    console.log('Black should king when moving to row 7');
    console.log('Red should king when moving to row 0');

    setTestMode(true);
  };

  return (
    <div className="app-container">
      <div className="game-layout">
        <div className="main-content">
          <Board
            gameState={gameState}
            onTileClick={handleTileClick}
            onMovePiece={movePiece}
          />
          <button
            onClick={setupKingingTest}
            style={{
              position: 'absolute',
              top: '10px',
              left: '10px',
              padding: '10px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              zIndex: 1000
            }}
          >
            Test Kinging
          </button>
        </div>
        <Sidebar
          aiLevel={gameState.aiLevel}
          onAILevelChange={setAILevel}
        />
      </div>
    </div>
  );
}

export default App;
