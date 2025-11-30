import { useCallback } from 'react';
import type { BoardState, Move, Player, Position } from '../types/game';

// Helper to check if a position is on the board
const isValidPos = (row: number, col: number): boolean => {
  return row >= 0 && row < 8 && col >= 0 && col < 8;
};

// Helper to get all valid moves for a specific player
// This duplicates some logic from useGameState, ideally we should refactor to a shared utility
// But for now, we'll keep it self-contained to avoid circular dependencies or complex refactors
const getAllValidMoves = (board: BoardState, player: Player): Move[] => {
  const moves: Move[] = [];
  const size = 8;

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const piece = board[row][col];
      if (piece && piece.color === player) {
        const directions = [];

        // Red moves UP (-1), Black moves DOWN (+1)
        if (piece.color === 'red' || piece.isKing) {
          directions.push({ row: -1, col: -1 }, { row: -1, col: 1 });
        }
        if (piece.color === 'black' || piece.isKing) {
          directions.push({ row: 1, col: -1 }, { row: 1, col: 1 });
        }

        directions.forEach((dir) => {
          const currentPos: Position = { row, col };

          // 1. Simple Move
          const targetRow = row + dir.row;
          const targetCol = col + dir.col;

          if (isValidPos(targetRow, targetCol) && board[targetRow][targetCol] === null) {
            moves.push({
              from: currentPos,
              to: { row: targetRow, col: targetCol },
              isJump: false
            });
          }

          // 2. Jump Move
          const jumpRow = row + dir.row * 2;
          const jumpCol = col + dir.col * 2;

          if (isValidPos(jumpRow, jumpCol) && board[jumpRow][jumpCol] === null) {
            const midRow = row + dir.row;
            const midCol = col + dir.col;
            const midPiece = board[midRow][midCol];

            if (midPiece && midPiece.color !== piece.color) {
              moves.push({
                from: currentPos,
                to: { row: jumpRow, col: jumpCol },
                isJump: true,
                jumpedPiece: { row: midRow, col: midCol }
              });
            }
          }
        });
      }
    }
  }
  return moves;
};

// Evaluate board position for a player
const evaluateBoard = (board: BoardState, player: Player): number => {
  let score = 0;
  const opponent: Player = player === 'red' ? 'black' : 'red';

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (!piece) continue;

      if (piece.color === player) {
        // Base piece value
        score += piece.isKing ? 5 : 3;

        // Positional bonuses
        if (!piece.isKing) {
          // Reward advancement toward opponent's side
          const advancement = piece.color === 'red' ? (7 - row) : row;
          score += advancement * 0.5;

          // Bonus for pieces close to kinging
          if ((piece.color === 'red' && row === 1) || (piece.color === 'black' && row === 6)) {
            score += 2;
          }
        }

        // Center control bonus
        if (col >= 2 && col <= 5) {
          score += 0.5;
        }
      } else if (piece.color === opponent) {
        // Subtract opponent's value
        score -= piece.isKing ? 5 : 3;
      }
    }
  }

  return score;
};

// Minimax algorithm with alpha-beta pruning
const minimax = (
  board: BoardState,
  depth: number,
  alpha: number,
  beta: number,
  maximizingPlayer: boolean,
  player: Player
): number => {
  if (depth === 0) {
    return evaluateBoard(board, player);
  }

  const currentPlayer = maximizingPlayer ? player : (player === 'red' ? 'black' : 'red');
  const moves = getAllValidMoves(board, currentPlayer);

  if (moves.length === 0) {
    // No moves available - game over
    return maximizingPlayer ? -1000 : 1000;
  }

  if (maximizingPlayer) {
    let maxEval = -Infinity;
    for (const move of moves) {
      const newBoard = board.map(r => [...r]);
      const piece = newBoard[move.from.row][move.from.col]!;
      newBoard[move.to.row][move.to.col] = piece;
      newBoard[move.from.row][move.from.col] = null;

      if (move.isJump && move.jumpedPiece) {
        newBoard[move.jumpedPiece.row][move.jumpedPiece.col] = null;
      }

      // Check for kinging
      if ((piece.color === 'red' && move.to.row === 0) ||
        (piece.color === 'black' && move.to.row === 7)) {
        piece.isKing = true;
      }

      const evalScore = minimax(newBoard, depth - 1, alpha, beta, false, player);
      maxEval = Math.max(maxEval, evalScore);
      alpha = Math.max(alpha, evalScore);

      if (beta <= alpha) break; // Alpha-beta pruning
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of moves) {
      const newBoard = board.map(r => [...r]);
      const piece = newBoard[move.from.row][move.from.col]!;
      newBoard[move.to.row][move.to.col] = piece;
      newBoard[move.from.row][move.from.col] = null;

      if (move.isJump && move.jumpedPiece) {
        newBoard[move.jumpedPiece.row][move.jumpedPiece.col] = null;
      }

      // Check for kinging
      if ((piece.color === 'red' && move.to.row === 0) ||
        (piece.color === 'black' && move.to.row === 7)) {
        piece.isKing = true;
      }

      const evalScore = minimax(newBoard, depth - 1, alpha, beta, true, player);
      minEval = Math.min(minEval, evalScore);
      beta = Math.min(beta, evalScore);

      if (beta <= alpha) break; // Alpha-beta pruning
    }
    return minEval;
  }
};

export const useAI = () => {
  const getBestMove = useCallback((
    board: BoardState,
    player: Player,
    difficulty: 'beginner' | 'intermediate' | 'advanced' = 'intermediate'
  ): Move | null => {
    const allMoves = getAllValidMoves(board, player);

    if (allMoves.length === 0) {
      return null;
    }

    // BEGINNER: Completely random
    if (difficulty === 'beginner') {
      return allMoves[Math.floor(Math.random() * allMoves.length)];
    }

    // INTERMEDIATE: Prioritize jumps, then random
    if (difficulty === 'intermediate') {
      const jumps = allMoves.filter(m => m.isJump);
      if (jumps.length > 0) {
        return jumps[Math.floor(Math.random() * jumps.length)];
      }
      return allMoves[Math.floor(Math.random() * allMoves.length)];
    }

    // ADVANCED: Use minimax algorithm
    if (difficulty === 'advanced') {
      let bestMove: Move | null = null;
      let bestScore = -Infinity;

      // Prioritize jumps first
      const jumps = allMoves.filter(m => m.isJump);
      const movesToEvaluate = jumps.length > 0 ? jumps : allMoves;

      for (const move of movesToEvaluate) {
        const newBoard = board.map(r => [...r]);
        const piece = newBoard[move.from.row][move.from.col]!;
        newBoard[move.to.row][move.to.col] = piece;
        newBoard[move.from.row][move.from.col] = null;

        if (move.isJump && move.jumpedPiece) {
          newBoard[move.jumpedPiece.row][move.jumpedPiece.col] = null;
        }

        // Check for kinging
        if ((piece.color === 'red' && move.to.row === 0) ||
          (piece.color === 'black' && move.to.row === 7)) {
          piece.isKing = true;
        }

        // Evaluate this move using minimax (depth 3 for good performance)
        const score = minimax(newBoard, 3, -Infinity, Infinity, false, player);

        if (score > bestScore) {
          bestScore = score;
          bestMove = move;
        }
      }

      return bestMove;
    }

    // Fallback to intermediate
    return allMoves[Math.floor(Math.random() * allMoves.length)];
  }, []);

  return { getBestMove };
};
