import React, { useState } from 'react';
import './Board.css';
import { CheckerPiece } from '../CheckerPiece';
import { getValidMoves } from '../../hooks/useGameState';
import type { GameState } from '../../types/game';

export interface BoardProps {
  gameState: GameState;
  onTileClick: (row: number, col: number) => void;
  onMovePiece: (from: { row: number; col: number }, to: { row: number; col: number }) => void;
}

export const Board: React.FC<BoardProps> = ({ gameState, onTileClick, onMovePiece }) => {
  const { board, selectedPosition, validMoves } = gameState;
  const [draggingPos, setDraggingPos] = useState<{ row: number; col: number } | null>(null);
  const [hoveredSquare, setHoveredSquare] = useState<{ row: number; col: number } | null>(null);
  const [pieceHovered, setPieceHovered] = useState<{ row: number; col: number } | null>(null);
  const [hoverValidMoves, setHoverValidMoves] = useState<any[]>([]);

  const onDragStart = (row: number, col: number) => {
    console.log('[DRAG] onDragStart called for position:', { row, col });
    // Select the piece so valid moves are calculated
    onTileClick(row, col);
    setDraggingPos({ row, col });
    setPieceHovered(null); // Clear hover glow when dragging starts
    setHoverValidMoves([]); // Clear hover moves
  };

  const onDrop = (row: number, col: number) => {
    console.log('[DROP] onDrop called for position:', { row, col }, 'draggingPos:', draggingPos);
    if (draggingPos) {
      // Check if target is a valid move
      const isValid = validMoves.some(
        (move) => move.to.row === row && move.to.col === col && move.from.row === draggingPos.row && move.from.col === draggingPos.col
      );

      if (isValid) {
        console.log('[DROP] Moving piece from', draggingPos, 'to', { row, col });
        onMovePiece(draggingPos, { row, col });
      }
    }
    setDraggingPos(null);
    setHoveredSquare(null);
  };

  const onDragOver = (e: React.DragEvent, row: number, col: number) => {
    // Only allow drop if it's a valid move
    if (draggingPos) {
      const isValid = validMoves.some(
        (move) => move.to.row === row && move.to.col === col && move.from.row === draggingPos.row && move.from.col === draggingPos.col
      );

      if (isValid) {
        e.preventDefault(); // Allow drop
        e.dataTransfer.dropEffect = "move";
      }
    }
  };

  const onDragEnter = (row: number, col: number) => {
    setHoveredSquare({ row, col });
  };

  const onMouseEnter = (row: number, col: number) => {
    if (!draggingPos) {
      const piece = board[row][col];
      if (piece && piece.color === gameState.currentPlayer) {
        setPieceHovered({ row, col });
        // Calculate valid moves for this piece to show hints
        const moves = getValidMoves(board, piece, { row, col });
        setHoverValidMoves(moves);
      } else {
        setPieceHovered(null);
        setHoverValidMoves([]);
      }
    }
  };

  const onMouseLeave = () => {
    if (!draggingPos) {
      setPieceHovered(null);
      setHoverValidMoves([]);
    }
  };

  return (
    <div className="board-container">
      <div className="checkerboard">
        {board.map((row, rowIndex) =>
          row.map((piece, colIndex) => {
            const isDark = (rowIndex + colIndex) % 2 === 1;

            // Check if this square is selected (clicked)
            const isSelected = selectedPosition?.row === rowIndex && selectedPosition?.col === colIndex;

            // Check if this square is the source of the current drag
            const isDragSource = draggingPos?.row === rowIndex && draggingPos?.col === colIndex;

            // Check if this square is a valid move target for the selected piece
            const isValidMove = validMoves.some(
              (move) => move.to.row === rowIndex && move.to.col === colIndex
            );

            // Check if this square is a valid move target for the hovered piece
            const isHoverValidMove = hoverValidMoves.some(
              (move) => move.to.row === rowIndex && move.to.col === colIndex
            );

            const isCurrentPlayerPiece = piece?.color === gameState.currentPlayer;

            // Determine if this square should glow
            // 1. It's the piece being hovered
            const isPieceHovered = pieceHovered?.row === rowIndex && pieceHovered?.col === colIndex;

            // 2. It's a valid target for the dragged piece and we're hovering over it
            const isValidHovered = draggingPos && hoveredSquare?.row === rowIndex && hoveredSquare?.col === colIndex && isValidMove;

            // 3. It's the source of the drag (gold border)
            const showGoldBorder = isDragSource || (isValidHovered);

            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`
                  board-square 
                  ${isDark ? 'dark' : 'light'} 
                  ${isValidMove ? 'valid-move' : ''} 
                  ${isHoverValidMove && !draggingPos ? 'hover-valid-move' : ''}
                  ${isSelected ? 'selected' : ''} 
                  ${showGoldBorder ? 'gold-border' : ''}
                  ${isPieceHovered ? 'piece-hovered' : ''}
                `}
                onClick={() => onTileClick(rowIndex, colIndex)}
                onDragOver={(e) => onDragOver(e, rowIndex, colIndex)}
                onDrop={() => onDrop(rowIndex, colIndex)}
                onDragEnter={() => onDragEnter(rowIndex, colIndex)}
                onMouseEnter={() => onMouseEnter(rowIndex, colIndex)}
                onMouseLeave={onMouseLeave}
              >
                {/* Highlight marker for valid moves (either selected or hovered) */}
                {(isValidMove || (isHoverValidMove && !draggingPos)) && <div className="move-indicator" />}

                {piece && (
                  <CheckerPiece
                    color={piece.color}
                    isKing={piece.isKing}
                    position={{ row: rowIndex, col: colIndex }}
                    isSelected={isSelected}
                    draggable={isCurrentPlayerPiece}
                    onDragStart={() => onDragStart(rowIndex, colIndex)}
                  />
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
