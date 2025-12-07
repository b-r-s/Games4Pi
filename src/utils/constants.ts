// Game configuration constants
export const BOARD_SIZE = 8;

// AI configuration
export const AI_THINK_TIME_MS = 1000;
export const MINIMAX_DEPTH = 3;
export const TERMINAL_SCORE = 1000;

// Scoring weights - these determine how the AI values different aspects of the game
export const SCORING_WEIGHTS = {
  MOBILITY: 0.5,        // How much we value having more moves available
  ADVANCEMENT: 0.2,     // How much we value pieces moving forward
  SUPPORT: 0.3,         // How much we value pieces protecting each other
  CENTER_CONTROL: 0.5,  // Bonus for controlling the center columns
  BACK_RANK: 2,         // Bonus for keeping pieces on the home row (defense)
} as const;

// UI timing
export const TOAST_DURATION_MS = 3000;

// Piece values
export const PIECE_VALUES = {
  REGULAR: 3,
  KING: 5,
} as const;
