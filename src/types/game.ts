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
  jumpedPiece?: Position; // Position of the captured piece, if any
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
}
