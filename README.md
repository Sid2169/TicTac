# Tic-Tac-Toe Game

A modern, interactive Tic-Tac-Toe game built with vanilla JavaScript, HTML, and CSS. Features both single-player AI modes and two-player gameplay with a sleek, responsive design and dark/light theme support.

## 🎮 Features

### Game Modes
- **Single Player vs AI**: Play against computer opponents with 4 difficulty levels
- **Two Player**: Local multiplayer for two human players

### AI Difficulty Levels
- **Easy**: Random move selection
- **Normal**: Basic strategy (win/block moves) with random fallback
- **Hard**: Advanced strategy with 80% optimal play
- **Unbeatable**: Perfect minimax algorithm implementation

### User Interface
- 🌙 **Dark/Light Theme Toggle**: Switch between dark and light modes
- 📱 **Responsive Design**: Optimized for desktop and mobile devices
- 🎨 **Custom Styling**: Modern UI with smooth animations and transitions
- 🏆 **Score Tracking**: Persistent score tracking across rounds
- 🎯 **Visual Feedback**: Hover effects and win animations

### Game Features
- Choose your mark (X or O)
- Custom player names
- Round-by-round gameplay
- Game over popup with results
- Reset functionality with confirmation
- Overall score display

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No additional dependencies required

### Installation
1. Clone or download the repository
2. Open `index.html` in your web browser
3. Start playing!

```bash
# Clone the repository
git clone [repository-url]

# Navigate to the project directory
cd tic-tac-toe

# Open in browser
open index.html
```

## 🎯 How to Play

### Setup
1. **Select Your Mark**: Choose X or O (X always goes first)
2. **Enter Player Name**: Customize your player name
3. **Choose Game Mode**: 
   - Select AI opponent with difficulty level
   - Or choose two-player mode
4. **Start Game**: Click "Start Game" to begin

### Gameplay
- Click on empty cells to make your move
- The game will highlight the current player's turn
- Win by getting three marks in a row (horizontal, vertical, or diagonal)
- Scores are tracked across multiple rounds

### Controls
- **Reset**: Start a new round (confirms if game is in progress)
- **Result**: View current overall scores
- **Home**: Return to the main menu
- **Theme Toggle**: Switch between dark and light modes

## 🏗️ Project Structure

```
tic-tac-toe/
├── index.html          # Main HTML structure
├── styles.css          # CSS styling and themes
├── script.js           # Game logic and functionality
└── images/            # Game assets (X, O, AI, 2-player icons)
    ├── x.png
    ├── o.png
    ├── ai.png
    └── 2-player.png
```

## 🔧 Technical Implementation

### Architecture
The game uses a modular JavaScript architecture with the following components:

- **Board Module**: Manages game board state and win detection
- **Game Module**: Handles game flow, turns, and scoring
- **AI Module**: Implements different AI strategies including minimax
- **UI Module**: Manages user interface and event handling

### Key Features
- **Minimax Algorithm**: Unbeatable AI using game theory
- **Responsive Design**: CSS Grid and Flexbox for layouts
- **Theme System**: CSS custom properties for easy theming
- **Event-Driven**: Clean separation of concerns with event handling

### Browser Compatibility
- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers

## 🎨 Customization

### Themes
The game includes built-in dark and light themes. You can customize colors by modifying the CSS custom properties in `styles.css`:

```css
:root {
    --primary-color: #222831;
    --accent-color: #00ADB5;
    --text-color: #EEEEEE;
    /* ... other variables */
}
```

### AI Difficulty
You can modify AI behavior by adjusting the algorithms in the `AI` module within `script.js`.

## 📱 Responsive Design

The game is fully responsive and adapts to different screen sizes:
- Desktop: Full-featured experience
- Tablet: Optimized touch interactions
- Mobile: Condensed layout with touch-friendly controls

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Create a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🔮 Future Enhancements

- [ ] Online multiplayer support
- [ ] Game statistics and analytics
- [ ] Sound effects and animations
- [ ] Tournament mode
- [ ] Custom board sizes (4x4, 5x5)
- [ ] AI personality customization

## 🐛 Known Issues

- None currently reported

## 📞 Support

If you encounter any issues or have questions:
- Check the browser console for error messages
- Ensure JavaScript is enabled in your browser
- Try refreshing the page
- Use a modern, updated browser

## 🎯 Credits

Created with ❤️ using vanilla JavaScript, HTML5, and CSS3.

**Connect with the developer:**
- [GitHub](https://github.com/Sid2169)
- [LinkedIn](https://www.linkedin.com/in/siddhartha-singh-952a64256/)

---

*Enjoy playing Tic-Tac-Toe! 🎮*
