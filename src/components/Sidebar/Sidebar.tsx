import './Sidebar.css';
import type { AILevel } from '../../types/game';

export interface SidebarProps {
  aiLevel: AILevel;
  onAILevelChange: (level: AILevel) => void;
}

export function Sidebar({ aiLevel, onAILevelChange }: SidebarProps) {
  return (
    <div className="sidebar">
      <h2 className="sidebar-title">AI Settings</h2>

      <div style={{ padding: '1rem' }}>
        <h3 style={{
          color: 'var(--text-primary)',
          fontSize: '0.9rem',
          marginBottom: '0.75rem',
          fontWeight: 600
        }}>
          Difficulty Level
        </h3>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem'
        }}>
          <button
            onClick={() => onAILevelChange('beginner')}
            style={{
              padding: '0.75rem',
              backgroundColor: aiLevel === 'beginner' ? 'var(--primary-color)' : 'rgba(255, 255, 255, 0.1)',
              color: 'var(--text-primary)',
              border: aiLevel === 'beginner' ? '2px solid var(--primary-color)' : '2px solid transparent',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: aiLevel === 'beginner' ? 600 : 400,
              transition: 'all 0.2s ease',
            }}
          >
            🟢 Beginner
          </button>

          <button
            onClick={() => onAILevelChange('intermediate')}
            style={{
              padding: '0.75rem',
              backgroundColor: aiLevel === 'intermediate' ? 'var(--primary-color)' : 'rgba(255, 255, 255, 0.1)',
              color: 'var(--text-primary)',
              border: aiLevel === 'intermediate' ? '2px solid var(--primary-color)' : '2px solid transparent',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: aiLevel === 'intermediate' ? 600 : 400,
              transition: 'all 0.2s ease',
            }}
          >
            🟡 Intermediate
          </button>

          <button
            onClick={() => onAILevelChange('advanced')}
            style={{
              padding: '0.75rem',
              backgroundColor: aiLevel === 'advanced' ? 'var(--primary-color)' : 'rgba(255, 255, 255, 0.1)',
              color: 'var(--text-primary)',
              border: aiLevel === 'advanced' ? '2px solid var(--primary-color)' : '2px solid transparent',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: aiLevel === 'advanced' ? 600 : 400,
              transition: 'all 0.2s ease',
            }}
          >
            🔴 Advanced
          </button>
        </div>

        <p style={{
          color: 'var(--text-secondary)',
          fontSize: '0.75rem',
          marginTop: '1rem',
          lineHeight: '1.4'
        }}>
          {aiLevel === 'beginner' && 'Random moves - Easy to beat'}
          {aiLevel === 'intermediate' && 'Prioritizes captures - Moderate challenge'}
          {aiLevel === 'advanced' && 'Strategic thinking - Challenging opponent'}
        </p>
      </div>
    </div>
  );
}
