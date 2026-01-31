import './App.css';
import { Board } from './components/Board';
import { Sidebar } from './components/Sidebar';
import {SplashScreen} from './components/SplashScreen/SplashScreen';
import { GamePlayInstructions } from './components/GamePlayInstructions';
import { useGameState } from './hooks/useGameState';
import { useSettings } from './hooks/useSettings';
import { BOARD_COLOR_SCHEMES } from './utils/colorThemes';
import { useEffect, useState } from 'react';
import { usePiNetwork } from './hooks/usePiNetwork';
import logo from './assets/icon-192x192.png';




function App() {
  // DEV-ONLY: Preview authentication screens for styling
  // To use: add ?previewAuth=checking or ?previewAuth=failed to your local URL
  // 'checking' shows the loading/auth screen, 'failed' shows the error/failure screen
  //  
 //  http://localhost:5174/?previewAuth=failed 


  const previewAuth = (() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('previewAuth');
    }
    return null;
  })();

  const { settings, updateSettings } = useSettings();
  const { gameState, handleTileClick, movePiece, setAILevel, restartGame, undoMove, clearUndoHighlight, toastMessage } = useGameState(settings);
  const [showPlayAgain, setShowPlayAgain] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [showInstructions, setShowInstructions] = useState(false);

  // Pi Network authentication
  const { authenticate } = usePiNetwork();
  const [authChecked, setAuthChecked] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    // Only attempt authentication if Pi SDK is available
    if (typeof window !== 'undefined' && 'Pi' in window) {
      authenticate()
        .then(() => setAuthChecked(true))
        .catch(() => {
          setAuthChecked(true);
          setAuthError('Authentication failed.');
        });
    } else if (import.meta.env.MODE === 'development') {
      // Local dev override: skip auth, load app
      setAuthChecked(true);
      setAuthError(null);
    } else {
      setAuthChecked(true);
      setAuthError('Pi SDK not detected. Please use the Pi Browser or Developer Portal sandbox.');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRestart = () => {
    setShowPlayAgain(false);
    restartGame();
  };

  const handleStartGame = () => {
    setShowSplash(false);
  };

  const handleShowInstructions = () => {
    setShowInstructions(true);
  };

  const handleHideInstructions = () => {
    setShowInstructions(false);
  };

  // When aiMovesFirst setting changes and no moves have been made, restart to apply
  useEffect(() => {
    if (gameState.moveCount === 0 && !showSplash) {
      restartGame();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.aiMovesFirst]);

  // Apply board colors as CSS variables
  useEffect(() => {
    const colors = BOARD_COLOR_SCHEMES[settings.boardColors];
    document.documentElement.style.setProperty('--board-light', colors.light);
    document.documentElement.style.setProperty('--board-dark', colors.dark);
  }, [settings.boardColors]);


  // DEV-ONLY: Preview authentication screens for styling
  if (previewAuth === 'checking') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', color:'white' }}>
        <img src={logo} alt="Checkers4Pi" style={{ width: 96, height: 96, marginBottom: 24 }} />
        <div>Checking Pi Network authentication...</div>
      </div>
    );
  }
  if (previewAuth === 'failed') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <img src={logo} alt="Checkers4Pi" style={{ width: 96, height: 96, marginBottom: 24 }} />
        <div style={{ color: 'red', marginBottom: 12 }}>Authentication failed.</div>
        <div style={{ maxWidth: 320, textAlign: 'center' , color:'white'}}>
          This app requires the Pi Network SDK.<br />
          Please open in the Pi Browser or use the Pi Developer Portal sandbox for full functionality.
        </div>
      </div>
    );
  }

  // Show authentication/fallback message if not authenticated
  if (!authChecked) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <img src={logo} alt="Checkers4Pi" style={{ width: 96, height: 96, marginBottom: 24 }} />
        <div>Checking Pi Network authentication...</div>
      </div>
    );
  }

  if (authError) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <img src={logo} alt="Checkers4Pi" style={{ width: 96, height: 96, marginBottom: 24 }} />
        <div style={{ color: 'red', marginBottom: 12 }}>{authError}</div>
        <div style={{ maxWidth: 320, textAlign: 'center' }}>
          This app requires the Pi Network SDK.<br />
          Please open in the Pi Browser or use the Pi Developer Portal sandbox for full functionality.
        </div>
      </div>
    );
  }

  if (showSplash) {
    if (showInstructions) {
      return (
        <GamePlayInstructions onBack={handleHideInstructions} />
      );
    }
    return <SplashScreen onStart={handleStartGame} onShowInstructions={handleShowInstructions} />;
  }

  return (
    <div className="app-container">
      <div className="game-layout">
        <div className="main-content">
          <Board
            gameState={gameState}
            onTileClick={handleTileClick}
            onMovePiece={movePiece}
            onRestart={handleRestart}
            onClearUndoHighlight={clearUndoHighlight}
            toastMessage={toastMessage}
            playerColor={settings.playerColor}
            onModalFadeComplete={() => setShowPlayAgain(true)}
          />
        </div>
        <Sidebar
          aiLevel={gameState.aiLevel}
          onAILevelChange={setAILevel}
          scores={gameState.scores}
          currentPlayer={gameState.currentPlayer}
          turnStartTime={gameState.turnStartTime}
          totalTime={gameState.totalTime}
          settings={settings}
          onSettingsChange={updateSettings}
          showPlayAgain={showPlayAgain}
          onPlayAgain={handleRestart}
          onRestart={handleRestart}
          moveHistory={gameState.moveHistory}
          canUndo={gameState.aiLevel === 'beginner' && gameState.moveHistory.length >= 2 && !gameState.isAiTurn && !gameState.winner}
          onUndo={undoMove}
          logo={logo}
          gameInProgress={gameState.moveCount > 0}
        />
      </div>
    </div>
  );
}

export default App;
