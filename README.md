# Tic-Tac-Toe — Interactive Game Application

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow.svg)](https://www.ecma-international.org/ecma-262/)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26.svg)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6.svg)](https://developer.mozilla.org/en-US/docs/Web/CSS)

> A modern, feature-rich Tic-Tac-Toe game built with vanilla JavaScript, featuring AI opponents with multiple difficulty levels, two-player mode, and an elegant dark/light theme interface.

![Website's Screen Shot](![Desktop View Home page](image.png))
![Website's Screen Shot](![Desktop View Game](image-1.png))
![Website's Screen Shot](![Mobile View](image-2.png)) ![Website's Screen Shot](![Mobile View Game](image-3.png))

[Live Demo](https://sid2169.github.io/TicTac/) • [Report Bug](https://github.com/Sid2169/TicTac/issues) • [Request Feature](https://github.com/Sid2169/TicTac/issues)



---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [How to Play](#-how-to-play)
- [Project Structure](#-project-structure)
- [Key Design Decisions](#-key-design-decisions)
- [Technical Highlights](#-technical-highlights)
- [Browser Support](#-browser-support)
- [Future Enhancements](#-future-enhancements)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

**Tic-Tac-Toe** is an interactive implementation of the classic game featuring both single-player AI modes and local multiplayer. Built entirely with vanilla JavaScript, it demonstrates clean modular architecture, advanced algorithms (including Minimax), and modern UI/UX design principles.

### Why This Implementation?

- **🚫 Framework-free**: Pure JavaScript with no runtime dependencies
- **🤖 Smart AI**: Four difficulty levels including unbeatable Minimax algorithm
- **🎨 Modern Design**: Dark/light theme support with smooth animations
- **📱 Responsive**: Seamless experience across desktop, tablet, and mobile
- **♿ Accessible**: Semantic HTML with proper contrast ratios
- **🎮 Engaging**: Score tracking, custom names, and visual feedback

---

## ✨ Features

### Core Functionality

#### 🎮 Game Modes
- **Single Player vs AI**: Challenge computer opponents with varying skill levels
- **Two Player Local**: Face-to-face multiplayer for two human players
- Custom player names for personalized experience
- Choose your mark (X or O) before starting

#### 🤖 AI Difficulty Levels
- **Easy**: Random move selection for casual play
- **Normal**: Basic strategy with win/block detection
- **Hard**: Advanced strategy with 80% optimal play
- **Unbeatable**: Perfect Minimax algorithm implementation

#### 🎨 User Interface
- **Dark/Light Theme Toggle**: Switch themes with animated toggle
- **Responsive Design**: Optimized layouts for all device sizes
- **Custom Styling**: Modern UI with smooth transitions
- **Visual Feedback**: Hover effects, animations, and state indicators
- **Game Over Popup**: Clean results display with next actions

#### 🏆 Score Management
- Round-by-round score tracking
- Persistent scores across multiple rounds
- Overall winner display
- Visual score updates with animations

#### 🎯 Gameplay Features
- Mark selection (X or O) before game start
- Custom player names
- Current turn indicator
- Win condition detection (rows, columns, diagonals)
- Draw detection
- Reset functionality with confirmation
- Home button to restart completely

---

## 🏗️ Architecture

### Design Philosophy

The application follows a **modular pattern** inspired by MVC architecture, adapted for vanilla JavaScript. Each module has a single responsibility and communicates through well-defined interfaces.

```
┌─────────────────────────────────────────────┐
│        Application Entry (script.js)         │
│  • Imports DOM elements                      │
│  • Initializes UI module                     │
│  • Bootstraps game system                    │
└─────────────────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
┌───────▼────────┐      ┌────────▼─────────┐
│  Game Logic    │      │    UI Layer      │
│                │      │                  │
│ • Board        │◄────►│ • UI Module      │
│ • Game         │      │ • Event Handlers │
│ • AI           │      │ • DOM Updates    │
└────────────────┘      └──────────────────┘
         │                       
         └───────────┬───────────
                     ▼
              ┌─────────────┐
              │ Game State  │
              └─────────────┘
```

### Module Breakdown

#### **Board Module** (IIFE Pattern)

**Purpose**: Manages game board state and win detection

**Key Components**:
- `init()`: Initializes empty 3x3 board
- `getBoard()`: Returns board copy (prevents mutation)
- `makeMove(index, player)`: Updates board with player move
- `checkWinner(board)`: Detects win patterns or draw

**Responsibilities**:
- Board state management
- Win condition validation
- Draw detection
- Pure data operations (no UI)

**Design Pattern**: Immediately Invoked Function Expression (IIFE) for encapsulation

#### **Game Module** (IIFE Pattern)

**Purpose**: Central game controller managing flow and state

**Key Components**:
- `init(mode, difficulty, userMark)`: Initializes game with settings
- `playTurn(index)`: Processes player/AI moves
- `switchTurn()`: Alternates between players
- `playAITurn()`: Triggers AI move calculation
- `resetGame()`: Resets board for next round
- `resetScores()`: Clears all scores

**State Management**:
- Current player tracking
- Game mode (AI vs 2-player)
- AI difficulty level
- Player marks (X/O assignment)
- Score persistence
- Game over status

**Responsibilities**:
- Turn management
- Score tracking
- AI coordination
- Win/draw handling
- Game flow control

#### **AI Module** (IIFE Pattern)

**Purpose**: Implements AI strategies from random to unbeatable

**Algorithms**:

1. **Easy (Random)**:
   - Selects random available move
   - No strategic thinking

2. **Normal (Basic Strategy)**:
   - Checks for winning moves
   - Blocks opponent wins
   - Falls back to random

3. **Hard (Advanced Strategy)**:
   - 80% optimal play (Minimax)
   - 20% normal strategy (adds unpredictability)

4. **Unbeatable (Minimax)**:
   - Perfect game theory implementation
   - Evaluates all possible game states
   - Guarantees win or draw

**Key Functions**:
- `setMarks(ai, human)`: Configures AI's mark
- `getBestMove(board, difficulty)`: Returns optimal move
- `minimax(board, isMaximizing)`: Recursive minimax algorithm
- `getAvailableMoves(board)`: Returns valid move indices

**Minimax Logic**:
```javascript
// Recursively evaluate game tree
// Returns: +10 (AI win), -10 (human win), 0 (draw)
const minimax = (board, isMaximizing) => {
  // Base cases: win, lose, or draw
  // Recursive cases: try all moves, return best
};
```

#### **UI Module** (IIFE Pattern)

**Purpose**: Handles all DOM interactions and visual updates

**Key Features**:
- Theme toggle (dark/light mode)
- Mark selection UI
- Mode selection (AI/2-player)
- Difficulty dropdown
- Player name inputs
- Board rendering
- Score display
- Popup management

**Event Handling**:
- Cell click events
- Hover effects (preview moves)
- Button interactions
- Form submissions
- Window resize adaptation

**Responsibilities**:
- DOM manipulation
- Event listener setup
- Visual feedback
- Animation triggers
- User input validation

---

## 🚀 Getting Started

### Prerequisites

- Modern web browser with ES6+ support:
  - Chrome 90+
  - Firefox 88+
  - Safari 14+
  - Edge 90+
- No build tools or dependencies required

### Installation

```bash
# Clone the repository
git clone https://github.com/Sid2169/tic-tac-toe.git
cd tic-tac-toe

# Open in browser
# Simply double-click index.html or use a local server
```

### Running Locally

```bash
# Option 1: Python Simple Server
python -m http.server 8000
# Visit http://localhost:8000

# Option 2: Node http-server
npx http-server
# Visit http://localhost:8080

# Option 3: VS Code Live Server Extension
# Right-click index.html → Open with Live Server
```

---

## 🎯 How to Play

### Setup Phase

1. **Select Your Mark**: Click X or O button (X always goes first)
2. **Enter Player Name**: Customize Player 1 name in text field
3. **Choose Game Mode**:
   - Click AI icon for single-player mode
   - Click 2-player icon for local multiplayer
4. **Set Difficulty** (AI mode only): Select from dropdown
5. **Enter Player 2 Name** (2-player mode only)
6. **Start Game**: Click "Start Game" button

### Gameplay

- Click any empty cell to place your mark
- Hover over cells to preview your mark
- Current player is indicated in scoreboard
- Win by getting three marks in a row (horizontal, vertical, or diagonal)
- Game announces winner or draw in popup
- Scores update automatically

### Controls

- **Reset**: Start new round (confirms if game in progress)
- **Result**: View current overall scores
- **Home**: Return to main menu (restarts completely)
- **Theme Toggle**: Switch between dark/light modes (top right)

### Winning

Get three of your marks in a row:
- **Horizontal**: [0-1-2], [3-4-5], [6-7-8]
- **Vertical**: [0-3-6], [1-4-7], [2-5-8]
- **Diagonal**: [0-4-8], [2-4-6]

---

## 📁 Project Structure

```
tic-tac-toe/
├── index.html              # Main HTML structure
├── styles.css              # Complete styling & themes
├── script.js               # Game logic & functionality
│
├── images/                 # Game assets
│   ├── x.png              # X mark image
│   ├── o.png              # O mark image
│   ├── ai.png             # AI mode icon
│   └── 2-player.png       # Two-player mode icon
│
├── README.md               # This file
└── LICENSE                 # MIT License
```

### Key Files Explained

- **`index.html`**: Semantic HTML structure with accessibility features
- **`styles.css`**: CSS custom properties for theming, responsive layouts
- **`script.js`**: Modular JavaScript with Board, Game, AI, and UI modules
- **`images/`**: Visual assets for marks and mode selection

---

## 🔑 Key Design Decisions

### 1. **Modular IIFE Pattern**

**Decision**: Use Immediately Invoked Function Expressions (IIFEs) for modules

**Rationale**:
- Encapsulation without ES6 modules (no build step)
- Private variables and methods
- Clean public API exposure
- Prevents global namespace pollution

**Example**:
```javascript
const Board = (() => {
  let board; // Private variable
  
  const init = () => { /* ... */ }; // Private method
  
  return { init, getBoard, makeMove, checkWinner }; // Public API
})();
```

### 2. **Minimax Algorithm for Unbeatable AI**

**Decision**: Implement full Minimax rather than heuristic-based AI

**Rationale**:
- Tic-Tac-Toe has small state space (9! = 362,880 positions)
- Minimax guarantees optimal play
- Educational value in demonstrating game theory
- Performance is acceptable (< 50ms for first move)

**Trade-offs**:
- More complex than simple heuristics
- Requires recursive thinking
- Could be slower for larger games (mitigated by small board)

### 3. **CSS Custom Properties for Theming**

**Decision**: Use CSS variables instead of Sass/class toggling

**Rationale**:
- Runtime theme switching without recompilation
- Single source of truth for colors
- Easy maintenance and updates
- Native browser support (no preprocessor)

**Example**:
```css
:root {
  --primary-color: #222831;
  --accent-color: #00ADB5;
}

.light {
  --primary-color: #D0D0D0;
  --accent-color: #007B83;
}
```

### 4. **Separation of UI and Logic**

**Decision**: Strict separation between game logic and DOM manipulation

**Rationale**:
- Easier testing (logic is pure)
- Better maintainability
- Reusable game engine
- Clear responsibilities

**Implementation**:
- Board/Game/AI modules: Pure logic, no DOM access
- UI module: Only handles DOM, delegates logic to other modules

### 5. **Hover Preview System**

**Decision**: Show mark preview on hover instead of requiring click

**Rationale**:
- Better user feedback
- Reduces accidental clicks
- Modern UX pattern
- Visual affordance

**Implementation**:
```javascript
cell.addEventListener('mouseenter', handleMouseEnter);
cell.addEventListener('mouseleave', handleMouseLeave);
```

### 6. **Score Persistence Across Rounds**

**Decision**: Track cumulative scores instead of single-round results

**Rationale**:
- Encourages multiple rounds
- Creates competitive atmosphere
- Better for learning (playing same opponent)
- Adds replay value

### 7. **Difficulty Gradation**

**Decision**: Four distinct difficulty levels instead of just two

**Rationale**:
- Accommodates all skill levels
- Progressive difficulty curve
- Demonstrates different AI approaches
- Educational (shows algorithm evolution)

### 8. **Responsive Design with CSS Grid**

**Decision**: Use CSS Grid for game board instead of Flexbox

**Rationale**:
- Perfect for 3x3 grid layout
- Maintains aspect ratio easily
- Simpler responsive logic
- Better browser support than older methods

---

## 💡 Technical Highlights

### 1. **Minimax Algorithm Implementation**

Perfect play through recursive game tree evaluation:

```javascript
const minimax = (board, isMaximizing) => {
  // Base cases: check for terminal states
  let winner = Board.checkWinner(board);
  if (winner === aiMark) return 10;
  if (winner === humanMark) return -10;
  if (!board.includes(null)) return 0; // Draw
  
  // Recursive case: evaluate all possible moves
  let bestScore = isMaximizing ? -Infinity : Infinity;
  const available = getAvailableMoves(board);
  
  for (let move of available) {
    let testBoard = [...board];
    testBoard[move] = isMaximizing ? aiMark : humanMark;
    let score = minimax(testBoard, !isMaximizing);
    bestScore = isMaximizing 
      ? Math.max(bestScore, score) 
      : Math.min(bestScore, score);
  }
  
  return bestScore;
};
```

### 2. **Smart Win Detection**

Efficient pattern matching using pre-defined win conditions:

```javascript
const winPatterns = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
  [0, 4, 8], [2, 4, 6]             // Diagonals
];

for (let [a, b, c] of winPatterns) {
  if (board[a] && board[a] === board[b] && board[a] === board[c]) {
    return board[a]; // Winner found
  }
}
```

### 3. **Dynamic Mark Assignment**

Flexible player/AI mark handling:

```javascript
// Human picks X, AI gets O
humanPlayer = userMark;
aiPlayer = userMark === "X" ? "O" : "X";

// X always starts
currentPlayer = "X";

// If AI is X, it moves first
if (mode === "ai" && aiPlayer === "X") {
  playAITurn();
}
```

### 4. **Hover Effect System**

Visual feedback with event delegation:

```javascript
cell.addEventListener('mouseenter', function handleMouseEnter() {
  if (!cell.classList.contains('disabled')) {
    const currentMark = Game.getCurrentPlayer();
    cell.classList.add(currentMark.toLowerCase());
  }
});

cell.addEventListener('mouseleave', function handleMouseLeave() {
  if (!cell.classList.contains('disabled')) {
    cell.classList.remove('x', 'o');
  }
});
```

### 5. **Theme Toggle with CSS Classes**

Single class toggle for complete theme switch:

```javascript
const toggleTheme = () => {
  document.body.classList.toggle("light");
};
```

All theme-specific styles automatically update through CSS variables.

### 6. **Game State Management**

Clean state tracking with status objects:

```javascript
const playTurn = (index) => {
  if (isGameOver || !Board.makeMove(index, currentPlayer)) {
    return false;
  }
  
  let winner = Board.checkWinner();
  if (winner) {
    isGameOver = true;
    if (winner !== 'draw') scores[winner]++;
    UI.showGameOverPopup(winner, scores);
    return { status: "gameover", winner };
  }
  
  switchTurn();
  return { status: "continue" };
};
```

### 7. **Popup Management**

Reusable popup system for game over and confirmations:

```javascript
const showGameOverPopup = (winner, scores) => {
  const popup = document.getElementById('game-over-popup');
  const announcement = document.getElementById('winner-announcement');
  
  // Dynamic content based on game result
  if (winner === 'draw') {
    announcement.innerHTML = `It's a Draw!<br>...`;
  } else {
    const winnerName = winner === 'X' ? playerXName : playerOName;
    announcement.innerHTML = `${winnerName} Wins!<br>...`;
  }
  
  popup.classList.remove('hidden');
};
```

---

## 🌐 Browser Support

### Fully Supported

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Opera 76+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

### Minimum Requirements

- ES6 JavaScript (arrow functions, template literals, spread operator)
- CSS Grid & Flexbox
- CSS Custom Properties (variables)
- classList API
- addEventListener

### No Polyfills Required

Modern browsers have native support for all features used.

---

## 🚧 Future Enhancements

### Planned Features

- [ ] **Online Multiplayer**: Real-time play with WebSockets
- [ ] **Game History**: Review past games with move replay
- [ ] **Statistics Dashboard**: Win/loss ratios, average time per game
- [ ] **Custom Board Sizes**: 4x4, 5x5 variants
- [ ] **Sound Effects**: Move sounds, win celebration, theme music
- [ ] **Animations**: Enhanced win line animations, confetti
- [ ] **AI Personality**: Different AI playing styles (aggressive, defensive)
- [ ] **Tournament Mode**: Multi-round elimination brackets
- [ ] **Achievements**: Unlock badges for milestones
- [ ] **Leaderboard**: Top players ranking system

### Technical Improvements

- [ ] **Progressive Web App**: Service worker for offline play
- [ ] **Local Storage**: Persistent scores and settings
- [ ] **TypeScript Migration**: Type safety and better IDE support
- [ ] **Unit Tests**: Jest coverage for game logic
- [ ] **E2E Tests**: Playwright for UI testing
- [ ] **Accessibility Audit**: WCAG 2.1 AA compliance
- [ ] **Performance Monitoring**: Track FPS and interaction metrics
- [ ] **Code Splitting**: Lazy load AI algorithms
- [ ] **Internationalization**: Multi-language support

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

### How to Contribute

1. **Fork** the repository
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines

- Follow existing code style and patterns
- Use meaningful variable and function names
- Write descriptive commit messages
- Test across multiple browsers
- Keep code modular and DRY
- Comment complex algorithms
- Update README if adding features

### Code Style

```javascript
// Good: Clear, descriptive names
const checkWinnerOnBoard = (board) => { /* ... */ };

// Bad: Unclear abbreviations
const chkWnr = (b) => { /* ... */ };
```

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### MIT License Summary

- ✅ Commercial use
- ✅ Modification
- ✅ Distribution
- ✅ Private use
- ⚠️ Liability and warranty disclaimers apply

---

## 👤 Author

**Siddhartha Singh** (Sid2169)

- GitHub: [@Sid2169](https://github.com/Sid2169)
- LinkedIn: [Siddhartha Singh](https://www.linkedin.com/in/siddhartha-singh-952a64256/)
- Project Link: [Tic-Tac-Toe](https://github.com/Sid2169/tic-tac-toe)

---

## 🙏 Acknowledgments

- **Game Theory**: John von Neumann and Oskar Morgenstern
- **Minimax Algorithm**: Claude Shannon (1950)
- **Design Inspiration**: Modern web design trends
- **Font Awesome**: Icon library for social links
- **Google Fonts**: Spicy Rice, Changa, Permanent Marker typefaces
- **Community**: Testers and feedback providers

---

## 📚 Additional Resources

### Learn More About Game AI

- [Minimax Algorithm Explained](https://en.wikipedia.org/wiki/Minimax)
- [Game Theory Basics](https://plato.stanford.edu/entries/game-theory/)
- [Tic-Tac-Toe Mathematics](https://en.wikipedia.org/wiki/Tic-tac-toe#Strategy)

### Web Development

- [MDN Web Docs](https://developer.mozilla.org/)
- [JavaScript.info](https://javascript.info/)
- [CSS Tricks](https://css-tricks.com/)

---

<div align="center">

**Built with ❤️ using vanilla JavaScript, HTML5, and CSS3**

If you enjoyed this project, please consider giving it a ⭐!

[⬆ Back to Top](#tic-tac-toe--interactive-game-application)

</div>