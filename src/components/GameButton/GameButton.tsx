import React from 'react';
import type { FC } from 'react';
import './GameButton.css';
// Import BOTH the Values (numbers) and the Colors (names)
import { NeonHueValues} from '../../types/neon-hues';
import type { NeonColor } from '../../types/neon-hues';

interface GameButtonProps {
  label: string;
  color?: string;
  onClick?: () => void;
  hue?: NeonColor;
  width?: number;
  height?: number;
  padding?: number;
  className?: string;
  opacity?: number;
}

export const GameButton: FC<GameButtonProps> = ({
  label,
  color,
  onClick,
  hue, // no default value, optional
  width = 200,
  height = 50,
  padding = 10,
  className = '',
  opacity =1.0
}) => {

  // Only set --btn-hue if a valid hue is provided (not undefined or 'None')
  const buttonStyle = {
    ...(hue ? { '--btn-hue': NeonHueValues[hue] } : {}),
    color: color,
    width: width ? `${width}px` : undefined,
    height: height ? `${height}px` : undefined,
    padding: padding ? `${padding}px` : undefined,
    opacity: opacity
  } as React.CSSProperties;

  return (
    <button
      className={`game-button${className ? ' ' + className : ''}`}
      onClick={onClick}
      style={buttonStyle}
    >
      {label}
    </button>
  );
};