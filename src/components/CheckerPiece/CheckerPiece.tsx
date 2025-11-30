import type { FC } from 'react';
import './CheckerPiece.css';

export interface CheckerPieceProps {
  color: string;
  isKing: boolean;
  position: { row: number; col: number };
  isSelected?: boolean;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
  onDragEnd?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export const CheckerPiece: FC<CheckerPieceProps> = ({
  color,
  isKing,
  isSelected,
  draggable,
  onDragStart,
  onDragEnd,
  onMouseEnter,
  onMouseLeave,
}) => {
  // Select the appropriate SVG based on color and king status
  const getPieceImage = () => {
    if (isKing) {
      return color === 'red' ? '/Red_King.svg' : '/Black_King.svg';
    }
    return color === 'red' ? '/checker-red.svg' : '/checker-black.svg';
  };

  const pieceImage = getPieceImage();

  const classNames = [
    'checker-piece',
    isKing ? 'king' : '',
    isSelected ? 'selected' : '',
    draggable ? 'draggable' : ''
  ].filter(Boolean).join(' ');

  const handleDragStart = (e: React.DragEvent) => {
    console.log('[PIECE DRAG START] Color:', color, 'isKing:', isKing, 'draggable:', draggable);

    // Create a custom drag image to avoid the "3 pieces" issue
    const canvas = document.createElement('canvas');
    canvas.width = 80;
    canvas.height = 80;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      // Draw a simple circle to represent the piece
      ctx.fillStyle = color === 'red' ? '#ef4444' : '#4b5563';
      ctx.beginPath();
      ctx.arc(40, 40, 35, 0, 2 * Math.PI);
      ctx.fill();

      // Draw crown indicator if king
      if (isKing) {
        ctx.fillStyle = '#FFD700';
        ctx.font = 'bold 30px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('♔', 40, 40);
      }

      console.log('[PIECE DRAG START] Custom drag image created');
    } else {
      console.error('[PIECE DRAG START] Failed to get canvas context!');
    }

    try {
      e.dataTransfer.setDragImage(canvas, 40, 40);
      console.log('[PIECE DRAG START] Drag image set successfully');
    } catch (err) {
      console.error('[PIECE DRAG START] Error setting drag image:', err);
    }

    if (onDragStart) {
      onDragStart(e);
      console.log('[PIECE DRAG START] Called parent onDragStart');
    } else {
      console.warn('[PIECE DRAG START] No onDragStart handler provided!');
    }
  };

  return (
    <div
      className={classNames}
      draggable={draggable}
      onDragStart={draggable ? handleDragStart : undefined}
      onDragEnd={draggable ? onDragEnd : undefined}
      onMouseEnter={draggable ? onMouseEnter : undefined}
      onMouseLeave={draggable ? onMouseLeave : undefined}
    >
      <img src={pieceImage} alt={`${color} ${isKing ? 'king' : 'checker'}`} className="checker-piece" />
    </div>
  );
};  
