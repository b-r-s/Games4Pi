import { useState, useEffect } from 'react';
import './Sidebar.css';
import type { AILevel, Player } from '../../types/game';
import type { ScoreBreakdown } from '../../utils/scoring';

export interface SidebarProps {
  aiLevel: AILevel;
  onAILevelChange: (level: AILevel) => void;
  scores: { red: ScoreBreakdown; black: ScoreBreakdown };
  currentPlayer: Player;
  turnStartTime: number;
  totalTime: { red: number; black: number };
}

// Helper to format milliseconds to MM:SS
const formatTime = (ms: number): string => {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

export function Sidebar({
  aiLevel,
  onAILevelChange,
  scores,
  currentPlayer,
  turnStartTime,
  totalTime
}: SidebarProps) {
  const [activeTab, setActiveTab] = useState<'game' | 'settings'>('game');
  const [currentMoveTime, setCurrentMoveTime] = useState(0);

  // Update current move timer every 100ms
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMoveTime(Date.now() - turnStartTime);
    }, 100);
    return () => clearInterval(interval);
  }, [turnStartTime]);

  const renderPlayerScore = (player: Player, label: string, emoji: string) => {
    const isActive = currentPlayer === player;
    const score = scores[player];
    const playerTotalTime = totalTime[player];
    const moveTime = isActive ? currentMoveTime : 0;
    const colorClass = player === 'red' ? 'text-red' : 'text-blue';

    return (
      <div className={`player-score-card ${isActive ? 'active' : ''}`}>
        <div className="card-header">
          <span className="player-name">
            <span className="player-emoji">{emoji}</span>
            <span className={colorClass}>{label}</span>
            {isActive && <span className="animate-pulse">⏱️</span>}
          </span>
          <span className="player-total-score">
            {score.total.toFixed(0)}
          </span>
        </div>

        <div className="score-details">
          <span>Mat: {score.material.toFixed(0)}</span>
          <span className="opacity-50">|</span>
          <span>Pow: {score.power.toFixed(0)}</span>
          <span className="opacity-50">|</span>
          <span>Str: {score.strategy.toFixed(0)}</span>
        </div>

        <div className="timer-row">
          <span>Move: {isActive ? formatTime(moveTime) : '--:--'}</span>
          <span>Total: {formatTime(playerTotalTime)}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="sidebar">
      {/* Tabs */}
      <div className="sidebar-tabs">
        <button
          className={`sidebar-tab ${activeTab === 'game' ? 'active' : ''}`}
          onClick={() => setActiveTab('game')}
        >
          Game Stats
        </button>
        <button
          className={`sidebar-tab ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          AI Level
        </button>
      </div>

      {/* Content */}
      <div className="sidebar-content">
        {activeTab === 'game' ? (
          <>
            <h2 className="sidebar-title">Current Match</h2>
            <div className="match-stats-container">
              {renderPlayerScore('red', 'Red (You)', '🔴')}
              {renderPlayerScore('black', 'Black (AI)', '⚫')}
            </div>
          </>
        ) : (
          <>
            <h2 className="sidebar-title">AI Difficulty</h2>
            <div className="settings-content">
              <button
                className={`difficulty-btn ${aiLevel === 'beginner' ? 'active' : ''}`}
                onClick={() => onAILevelChange('beginner')}
              >
                <span>🟢</span> Beginner
              </button>

              <button
                className={`difficulty-btn ${aiLevel === 'intermediate' ? 'active' : ''}`}
                onClick={() => onAILevelChange('intermediate')}
              >
                <span>🟡</span> Intermediate
              </button>

              <button
                className={`difficulty-btn ${aiLevel === 'advanced' ? 'active' : ''}`}
                onClick={() => onAILevelChange('advanced')}
              >
                <span>🔴</span> Advanced
              </button>

              <p className="difficulty-desc">
                {aiLevel === 'beginner' && 'Random moves. Good for learning the rules.'}
                {aiLevel === 'intermediate' && 'Balanced. Prioritizes captures.'}
                {aiLevel === 'advanced' && 'Strategic. Thinks ahead and plays to win.'}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
