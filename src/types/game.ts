import type { ScoreBreakdown } from '../utils/scoring';

export type Player = 'red' | 'black';

export interface Piece {
  color: Player;
  isKing: boolean;
}

export type BoardState = (Piece | null)[][];

export interface Position {
  row: number;
  col: number;
}

export interface Move {
  from: Position;
  to: Position;
  isJump: boolean;
  jumpedPiece?: Position;
  jumpSequence?: Position[]; // Array of intermediate positions for multi-jumps
}

export type GameMode = 'PvP' | 'PvAI';

export type AILevel = 'beginner' | 'intermediate' | 'advanced';

export interface GameState {
  board: BoardState;
  currentPlayer: Player;
  selectedPosition: Position | null;
  validMoves: Move[];
  winner: Player | 'draw' | null;
  gameMode: GameMode;
  isAiTurn: boolean;
  aiLevel: AILevel;
  scores: {
    red: ScoreBreakdown;
    black: ScoreBreakdown;
  };
  turnStartTime: number;
  totalTime: {
    red: number;
    black: number;
  };
  lastAIMove?: {
    from: Position;
    to: Position;
    timestamp: number;
  };
}
