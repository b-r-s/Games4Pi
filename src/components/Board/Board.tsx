import React, { useState, useMemo } from 'react';
import './Board.css';
import { CheckerPieceMemo as CheckerPiece } from '../CheckerPiece';
import { getValidMovesForPiece } from '../../utils/gameLogic';
import type { GameState } from '../../types/game';
import { GameOverModal } from '../GameOver/GameOverModal';

export interface BoardProps {
  gameState: GameState;
  onTileClick: (row: number, col: number) => void;
  onMovePiece: (from: { row: number; col: number }, to: { row: number; col: number }) => void;
  onRestart: () => void;
  toastMessage: string | null;
}

export const Board: React.FC<BoardProps> = ({ gameState, onTileClick, onMovePiece, onRestart, toastMessage }) => {
  const { board, selectedPosition, validMoves, lastAIMove, winner } = gameState;
  const [draggingPos, setDraggingPos] = useState<{ row: number; col: number } | null>(null);
  const [hoveredSquare, setHoveredSquare] = useState<{ row: number; col: number } | null>(null);
  const [pieceHovered, setPieceHovered] = useState<{ row: number; col: number } | null>(null);
  const [hoverValidMoves, setHoverValidMoves] = useState<any[]>([]);

  // Performance optimization: create a Set for O(1) lookup instead of O(n) array.some()
  const validMoveMap = useMemo(() => {
    const map = new Set<string>();
    validMoves.forEach(m => map.add(`${m.to.row},${m.to.col}`));
    return map;
  }, [validMoves]);

  const hoverValidMoveMap = useMemo(() => {
    const map = new Set<string>();
    hoverValidMoves.forEach(m => map.add(`${m.to.row},${m.to.col}`));
    return map;
  }, [hoverValidMoves]);

  const onDragStart = (row: number, col: number) => {
    // Select the piece so valid moves are calculated
    onTileClick(row, col);
    setDraggingPos({ row, col });
    setPieceHovered(null); // Clear hover glow when dragging starts
    setHoverValidMoves([]); // Clear hover moves
  };

  const onDrop = (row: number, col: number) => {
    if (draggingPos) {
      // Check if target is a valid move
      const isValid = validMoves.some(
        (move) => move.to.row === row && move.to.col === col && move.from.row === draggingPos.row && move.from.col === draggingPos.col
      );

      if (isValid) {
        onMovePiece(draggingPos, { row, col });
      }
    }
    setDraggingPos(null);
    setHoveredSquare(null);
  };

  const onDragEnd = () => {
    setDraggingPos(null);
    setHoveredSquare(null);
    setPieceHovered(null);
    setHoverValidMoves([]);
  };

  const onDragOver = (e: React.DragEvent, row: number, col: number) => {
    // Always prevent default to allow drop on the element (makes the whole square a drop zone)
    e.preventDefault();

    // Update hovered square for highlighting
    if (draggingPos && (hoveredSquare?.row !== row || hoveredSquare?.col !== col)) {
      setHoveredSquare({ row, col });
    }

    if (draggingPos) {
      const isValid = validMoves.some(
        (move) => move.to.row === row && move.to.col === col && move.from.row === draggingPos.row && move.from.col === draggingPos.col
      );

      // Only show "move" cursor if it's a valid move
      if (isValid) {
        e.dataTransfer.dropEffect = "move";
      } else {
        e.dataTransfer.dropEffect = "none";
      }
    }
  };

  const onDragEnter = () => {
    // We handle hover highlighting in onDragOver for better reliability
  };

  const onMouseEnter = (row: number, col: number) => {
    if (!draggingPos) {
      const piece = board[row][col];
      // Only allow hover effects for the current player's pieces
      if (piece && piece.color === gameState.currentPlayer) {
        setPieceHovered({ row, col });
        // Calculate valid moves for this piece to show hints
        const moves = getValidMovesForPiece(board, piece, { row, col });
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
      {toastMessage && <div className="toast-notification">{toastMessage}</div>}
      {winner && <GameOverModal winner={winner} onRestart={onRestart} />}
      <div className="checkerboard">
        {board.map((row, rowIndex) =>
          row.map((piece, colIndex) => {
            const isDark = (rowIndex + colIndex) % 2 === 1;

            // Check if this square is selected (clicked)
            const isSelected = selectedPosition?.row === rowIndex && selectedPosition?.col === colIndex;

            // Check if this square is the source of the current drag
            const isDragSource = draggingPos?.row === rowIndex && draggingPos?.col === colIndex;

            // Check if this square is a valid move target for the selected piece
            const isValidMove = validMoveMap.has(`${rowIndex},${colIndex}`);

            // Check if this square is a valid move target for the hovered piece
            const isHoverValidMove = hoverValidMoveMap.has(`${rowIndex},${colIndex}`);

            const isCurrentPlayerPiece = piece?.color === gameState.currentPlayer;

            // Determine if this square should glow
            // 1. It's the piece being hovered
            const isPieceHovered = pieceHovered?.row === rowIndex && pieceHovered?.col === colIndex;

            // 2. It's a valid target for the dragged piece and we're hovering over it
            const isValidHovered = draggingPos && hoveredSquare?.row === rowIndex && hoveredSquare?.col === colIndex && isValidMove;

            // 3. It's the source of the drag (gold border)
            const showGoldBorder = isDragSource || (isValidHovered);

            // Check if this square is part of the last AI move
            const isAIMoveSquare = lastAIMove && (
              (lastAIMove.from.row === rowIndex && lastAIMove.from.col === colIndex) ||
              (lastAIMove.to.row === rowIndex && lastAIMove.to.col === colIndex)
            );

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
                  ${isAIMoveSquare ? 'ai-move-highlight' : ''}
                `}
                onClick={() => onTileClick(rowIndex, colIndex)}
                onDragOver={(e) => onDragOver(e, rowIndex, colIndex)}
                onDrop={() => onDrop(rowIndex, colIndex)}
                onDragEnter={onDragEnter}
                onMouseEnter={() => onMouseEnter(rowIndex, colIndex)}
                onMouseLeave={onMouseLeave}
              >
                {/* Highlight marker for valid moves (either selected or hovered) handled by CSS ::after */}

                {piece && (
                  <CheckerPiece
                    color={piece.color}
                    isKing={piece.isKing}
                    position={{ row: rowIndex, col: colIndex }}
                    isSelected={isSelected}
                    draggable={isCurrentPlayerPiece}
                    onDragStart={() => onDragStart(rowIndex, colIndex)}
                    onDragEnd={onDragEnd}
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
