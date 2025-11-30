# Project Structure

## Overview
The project follows a component-based architecture with each component in its own folder containing its TypeScript file and CSS styles.

## Directory Structure

```
e:\dev\AI_Checkers\
├── public/
│   └── crown.svg                    # Crown icon for king pieces
│
├── src/
│   ├── components/
│   │   ├── CheckerPiece/
│   │   │   ├── CheckerPiece.tsx     # Checker piece component
│   │   │   ├── CheckerPiece.css     # Piece styles (3D effects, animations)
│   │   │   └── index.ts             # Component exports
│   │   │
│   │   ├── Board/
│   │   │   ├── Board.tsx            # Game board component (placeholder)
│   │   │   ├── Board.css            # Board styles (3D perspective)
│   │   │   └── index.ts             # Component exports
│   │   │
│   │   ├── Sidebar/
│   │   │   ├── Sidebar.tsx          # Metrics sidebar component (placeholder)
│   │   │   ├── Sidebar.css          # Sidebar styles (glassmorphism)
│   │   │   └── index.ts             # Component exports
│   │   │
│   │   └── index.ts                 # Central component exports
│   │
│   ├── App.tsx                      # Main application component
│   ├── App.css                      # App-specific styles
│   ├── index.css                    # Global styles and CSS variables
│   └── main.tsx                     # Application entry point
│
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── vite.config.ts
└── project-overview.md
```

## Component Organization

### CheckerPiece Component ✅
- **Location**: `src/components/CheckerPiece/`
- **Status**: Complete
- **Features**:
  - Regular and king pieces
  - Stacked pieces effect for kings
  - SVG crown icon
  - Drag-and-drop support
  - Hover animations
  - Selection states

### Board Component 🚧
- **Location**: `src/components/Board/`
- **Status**: Placeholder
- **Planned Features**:
  - 8x8 checkerboard grid
  - Pseudo-3D perspective
  - Valid move indicators
  - Piece placement

### Sidebar Component 🚧
- **Location**: `src/components/Sidebar/`
- **Status**: Placeholder
- **Planned Features**:
  - Game metrics display
  - Player scores
  - Game status
  - Control buttons
  - Difficulty selector

## Import Patterns

### Recommended (using index files):
```typescript
import { CheckerPiece } from './components/CheckerPiece';
import { Board, Sidebar } from './components';
```

### Also valid (direct imports):
```typescript
import { CheckerPiece } from './components/CheckerPiece/CheckerPiece';
```

## CSS Architecture

Each component has its own CSS file co-located with the component:
- **Scoped styles**: Component-specific classes
- **Global variables**: Defined in `src/index.css`
- **No conflicts**: Each component uses unique class names

## Next Steps

1. Implement Board component with 8x8 grid
2. Implement Sidebar component with metrics
3. Add game state management
4. Implement move validation logic
5. Build AI opponent
