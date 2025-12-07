import React from 'react';
import { FallingEmojis } from './FallingEmojis';
import './GameOverModal.css';

interface GameOverModalProps {
  winner: 'red' | 'black' | 'draw';
  onRestart: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({ winner, onRestart }) => {
  const isRedWin = winner === 'red';

  const getMessage = () => {
    switch (winner) {
      case 'red': return 'Red Wins! 🎉';
      case 'black': return 'Black Wins!';
      case 'draw': return 'Game Drawn!';
      default: return 'Game Over';
    }
  };

  const titleClass = winner === 'red' ? 'red' : winner === 'black' ? 'black' : 'draw';

  return (
    <>
      {isRedWin && <FallingEmojis />}
      <div className="game-over-overlay">
        <div className="game-over-content">
          <h2 className={`game-over-title ${titleClass}`}>
            {getMessage()}
          </h2>

          <p className="game-over-message">
            {winner === 'draw' ? 'No more moves possible.' : `Congratulations ${winner}!`}
          </p>

          <button
            onClick={onRestart}
            className="play-again-btn"
          >
            Play Again
          </button>
        </div>
      </div>
    </>
  );
};
