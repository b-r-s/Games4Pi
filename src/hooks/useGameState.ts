import { useState, useCallback, useEffect } from 'react';
import type { BoardState, Piece, Position, GameState, Move } from '../types/game';
import { useAI } from './useAI';

const BOARD_SIZE = 8;

const createInitialBoard = (): BoardState => {
  console.log('Creating initial board...');
  const board: BoardState = Array(BOARD_SIZE)
    .fill(null)
    .map(() => Array(BOARD_SIZE).fill(null));

  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      // Only place pieces on dark squares
      if ((row + col) % 2 === 1) {
        if (row < 3) {
          board[row][col] = { color: 'black', isKing: false };
        } else if (row > 4) {
          board[row][col] = { color: 'red', isKing: false };
        } else {
          // Explicitly ensure middle rows are empty
          board[row][col] = null;
        }
      }
    }
  }
  console.log('Initial board created.');
  return board;
};

const isValidPos = (pos: Position): boolean => {
  return (
    pos.row >= 0 &&
    pos.row < BOARD_SIZE &&
    pos.col >= 0 &&
    pos.col < BOARD_SIZE
  );
};

export const getValidMoves = (board: BoardState, piece: Piece, pos: Position): Move[] => {
  const moves: Move[] = [];
  const directions: Position[] = [];

  // Red moves up, Black moves down
  if (piece.color === 'red' || piece.isKing) {
    directions.push({ row: -1, col: -1 }, { row: -1, col: 1 });
  }
  if (piece.color === 'black' || piece.isKing) {
    directions.push({ row: 1, col: -1 }, { row: 1, col: 1 });
  }

  directions.forEach(dir => {
    // Simple move
    const target: Position = { row: pos.row + dir.row, col: pos.col + dir.col };
    if (isValidPos(target) && board[target.row][target.col] === null) {
      moves.push({ from: pos, to: target, isJump: false });
    }
    // Jump move
    const jumpTarget: Position = { row: pos.row + dir.row * 2, col: pos.col + dir.col * 2 };
    if (isValidPos(jumpTarget) && board[jumpTarget.row][jumpTarget.col] === null) {
      const midPos: Position = { row: pos.row + dir.row, col: pos.col + dir.col };
      const midPiece = board[midPos.row][midPos.col];
      if (midPiece && midPiece.color !== piece.color) {
        moves.push({ from: pos, to: jumpTarget, isJump: true, jumpedPiece: midPos });
      }
    }
  });

  return moves;
};

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>({
    board: createInitialBoard(),
    currentPlayer: 'red',
    selectedPosition: null,
    validMoves: [],
    winner: null,
    gameMode: 'PvAI',
    isAiTurn: false,
    aiLevel: 'intermediate',
  });

  const { getBestMove } = useAI();

  // AI turn effect
  useEffect(() => {
    if (
      gameState.gameMode === 'PvAI' &&
      gameState.currentPlayer === 'black' &&
      !gameState.winner
    ) {
      if (!gameState.isAiTurn) {
        setGameState(prev => ({ ...prev, isAiTurn: true }));
      }
      const timer = setTimeout(() => {
        const aiMove = getBestMove(gameState.board, 'black', gameState.aiLevel);
        if (aiMove) {
          setGameState(prev => {
            const newBoard = prev.board.map(r => [...r]);
            const piece = newBoard[aiMove.from.row][aiMove.from.col]!;
            newBoard[aiMove.to.row][aiMove.to.col] = piece;
            newBoard[aiMove.from.row][aiMove.from.col] = null;
            if (aiMove.isJump && aiMove.jumpedPiece) {
              newBoard[aiMove.jumpedPiece.row][aiMove.jumpedPiece.col] = null;
            }
            if (piece.color === 'black' && aiMove.to.row === BOARD_SIZE - 1) {
              piece.isKing = true;
            }
            if (piece.color === 'red' && aiMove.to.row === 0) {
              piece.isKing = true;
            }
            return {
              ...prev,
              board: newBoard,
              currentPlayer: 'red',
              isAiTurn: false,
              selectedPosition: null,
              validMoves: [],
            };
          });
        } else {
          setGameState(prev => ({ ...prev, winner: 'red', isAiTurn: false }));
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [gameState.currentPlayer, gameState.gameMode, gameState.winner, gameState.board, getBestMove, gameState.isAiTurn]);

  const handleTileClick = useCallback((row: number, col: number) => {
    if (gameState.isAiTurn || gameState.winner) return;
    setGameState(prev => {
      const clickedPiece = prev.board[row][col];
      const isCurrentPlayerPiece = clickedPiece?.color === prev.currentPlayer;

      // Select piece
      if (isCurrentPlayerPiece) {
        const moves = getValidMoves(prev.board, clickedPiece!, { row, col });
        return { ...prev, selectedPosition: { row, col }, validMoves: moves };
      }

      // Move to empty tile
      if (!clickedPiece && prev.selectedPosition) {
        const move = prev.validMoves.find(
          m => m.to.row === row && m.to.col === col,
        );
        if (move) {
          const newBoard = prev.board.map(r => [...r]);
          const piece = newBoard[prev.selectedPosition.row][prev.selectedPosition.col]!;
          newBoard[move.to.row][move.to.col] = piece;
          newBoard[move.from.row][move.from.col] = null;
          if (move.isJump && move.jumpedPiece) {
            newBoard[move.jumpedPiece.row][move.jumpedPiece.col] = null;
          }
          if (
            (piece.color === 'red' && move.to.row === 0) ||
            (piece.color === 'black' && move.to.row === BOARD_SIZE - 1)
          ) {
            piece.isKing = true;
          }
          return {
            ...prev,
            board: newBoard,
            currentPlayer: prev.currentPlayer === 'red' ? 'black' : 'red',
            selectedPosition: null,
            validMoves: [],
          };
        }
      }

      // Deselect
      return { ...prev, selectedPosition: null, validMoves: [] };
    });
  }, [gameState.isAiTurn, gameState.winner]);

  // Drag‑and‑drop move helper
  const movePiece = (from: { row: number; col: number }, to: { row: number; col: number }) => {
    const isValid = gameState.validMoves.some(
      m =>
        m.from.row === from.row &&
        m.from.col === from.col &&
        m.to.row === to.row &&
        m.to.col === to.col,
    );
    if (!isValid) return;
    setGameState(prev => {
      const newBoard = prev.board.map(r => [...r]);
      const piece = newBoard[from.row][from.col]!;
      newBoard[to.row][to.col] = piece;
      newBoard[from.row][from.col] = null;
      const move = prev.validMoves.find(
        m =>
          m.from.row === from.row &&
          m.from.col === from.col &&
          m.to.row === to.row &&
          m.to.col === to.col,
      );
      if (move && move.isJump && move.jumpedPiece) {
        newBoard[move.jumpedPiece.row][move.jumpedPiece.col] = null;
      }
      if (piece.color === 'black' && to.row === BOARD_SIZE - 1) {
        piece.isKing = true;
      }
      if (piece.color === 'red' && to.row === 0) {
        piece.isKing = true;
      }
      return {
        ...prev,
        board: newBoard,
        currentPlayer: prev.currentPlayer === 'red' ? 'black' : 'red',
        selectedPosition: null,
        validMoves: [],
      };
    });
  };

  const setAILevel = useCallback((level: 'beginner' | 'intermediate' | 'advanced') => {
    setGameState(prev => ({ ...prev, aiLevel: level }));
  }, []);

  return { gameState, handleTileClick, movePiece, setAILevel };
};
