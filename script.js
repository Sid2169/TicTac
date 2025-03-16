/* Board Management : init() initializes board by defining an array with initial value of element null
                    : getBoard() returns a copy of the board currently
                    : makeMove() takes a palyer making the move either 'x' or 'O' and index of board and updates the board
                    : define array of winning patterns such [0, 1, 2] 
                    : checkWinner() checks winner by checking if any win pattern has occured on board after each move and return winner 
                      i.e 'x' or 'O' or draw
                    :  */
const Board = (() => {
    let board;

    const init = () => {
        board = Array(9).fill(null); // 3x3 grid stored as 1D array
    };

    const getBoard = () => [...board]; // Return a copy to prevent mutation.

    const makeMove = (index, player) => {
        if (board[index] === null) {
            board[index] = player;
            return true; // Move successful
        }
        return false; //Invalid Move
    };

    const checkWinner = (currentBoard = board) => {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6]             // Diagonals
        ];

        for (let pattern of winPatterns) {
            const [a, b, c] = pattern;
            if (currentBoard[a] && currentBoard[a] === currentBoard[b] && currentBoard[a] === currentBoard[c]) {
                return currentBoard[a]; // Return 'X' or 'O' as winner
            }
        }
        return currentBoard.includes(null) ? null : 'draw'; // Game or draw
    };

    return { init, getBoard, makeMove, checkWinner };
})();


const Game = (() => {
    let currentPlayer;
    let mode; // "2-player" or "ai"
    let aiDifficulty;
    let isGameOver;
    let humanPlayer; // Stores human player's mark
    let aiPlayer; // Stores AI player's mark
    let scores = { X: 0, O: 0 }; // Track scores
    let inProgress = false; // Track if game is in progress

    const init = (gameMode = "2-player", difficulty = "easy", userMark = "X") => {
        Board.init();
        humanPlayer = userMark;
        aiPlayer = userMark === "X" ? "O" : "X"; // AI takes the other mark
        currentPlayer = "X"; // X always starts
        mode = gameMode;
        aiDifficulty = difficulty;
        isGameOver = false;
        inProgress = false;

        AI.setMarks(aiPlayer, humanPlayer); // Tells AI its mark

        // If AI is 'X', it should make the first move
        if (mode === "ai" && aiPlayer === "X") {
            playAITurn();
        }
    };

    const getCurrentPlayer = () => currentPlayer;
    
    const getScores = () => ({...scores}); // Return a copy of the scores

    const isInProgress = () => {
        // Check if any moves have been made (game is in progress)
        return Board.getBoard().some(cell => cell !== null);
    };

    const getOverallWinner = () => {
        if (scores.X > scores.O) return 'X';
        if (scores.O > scores.X) return 'O';
        return 'draw'; // Tied score
    };

    const playTurn = (index) => {
        if (isGameOver || !Board.makeMove(index, currentPlayer)) return false;

        // Mark game as in progress once moves are made
        inProgress = true;

        let winner = Board.checkWinner();
        if (winner) {
            isGameOver = true;
            inProgress = false;
            
            // Update scores if there's a winner (not a draw)
            if (winner !== 'draw') {
                scores[winner]++;
                updateScoreDisplay();
            }
            
            UI.showGameOverPopup(winner, scores);
            return { status: "gameover", winner };
        }

        switchTurn();

        if (mode === "ai" && currentPlayer === aiPlayer) {
            playAITurn();
        }

        return { status: "continue" };
    };

    const switchTurn = () => {
        currentPlayer = currentPlayer === "X" ? "O" : "X";
    };

    const playAITurn = () => {
        let aiMove = AI.getBestMove(Board.getBoard(), aiDifficulty);
        if (aiMove !== -1) {
            playTurn(aiMove);
            document.getElementById(`${aiMove}`).classList.add(`${aiPlayer.toLowerCase()}`, 'disabled');
        }
    };

    const updateScoreDisplay = () => {
        document.getElementById('scoreX').textContent = scores.X;
        document.getElementById('scoreO').textContent = scores.O;
    };

    const resetGame = () => {
        Board.init();
        isGameOver = false;
        inProgress = false;
        currentPlayer = "X";
        
        // Clear board UI
        document.querySelectorAll('.cell').forEach(cell => {
            cell.classList.remove('x', 'o', 'disabled');
        });
        
        // If AI is X, it should make the first move
        if (mode === "ai" && aiPlayer === "X") {
            playAITurn();
        }
    };

    const resetScores = () => {
        scores = { X: 0, O: 0 };
        updateScoreDisplay();
    };

    return { 
        init, 
        getCurrentPlayer, 
        playTurn, 
        resetGame, 
        getScores, 
        resetScores, 
        getOverallWinner,
        isInProgress
    };
})();

// AI module for ai
const AI = (() => {
    let aiMark = "O"; // Default, will be set properly by Game module
    let humanMark = "X"; // Default

    const setMarks = (ai, human) => {
        aiMark = ai;
        humanMark = human;
    };

    const getAvailableMoves = (board) => board.map((val, index) => val === null ? index : null).filter(val => val !== null);

    const getRandomMove = (board) => {
        const available = getAvailableMoves(board);
        return available.length > 0 ? available[Math.floor(Math.random() * available.length)] : -1;
    };

    const getNormalMove = (board) => {
        const available = getAvailableMoves(board);
        for (let move of available) {
            let testBoard = [...board];
            testBoard[move] = aiMark; // Simulate AI move
            if (Board.checkWinner(testBoard) === aiMark) return move;

            testBoard[move] = humanMark; // Simulate player move
            if (Board.checkWinner(testBoard) === humanMark) return move;
        }
        return getRandomMove(board);
    };

    const getHardMove = (board) => {
        return Math.random() > 0.2 ? getUnbeatableMove(board) : getNormalMove(board);
    };

    const getUnbeatableMove = (board) => {
        let bestScore = -Infinity;
        let bestMove = -1;
        const available = getAvailableMoves(board);

        for (let move of available) {
            let testBoard = [...board];
            testBoard[move] = aiMark; // AI makes a move
            let score = minimax(testBoard, false);
            if (score > bestScore) {
                bestScore = score;
                bestMove = move;
            }
        }
        return bestMove;
    };

    const minimax = (board, isMaximizing) => {
        let winner = Board.checkWinner(board);
        if (winner === aiMark) return 10;
        if (winner === humanMark) return -10;
        if (!board.includes(null)) return 0;

        let bestScore = isMaximizing ? -Infinity : Infinity;
        const available = getAvailableMoves(board);

        for (let move of available) {
            let testBoard = [...board];
            testBoard[move] = isMaximizing ? aiMark : humanMark;
            let score = minimax(testBoard, !isMaximizing);
            bestScore = isMaximizing ? Math.max(bestScore, score) : Math.min(bestScore, score);
        }

        return bestScore;
    };

    const getBestMove = (board, difficulty) => {
        switch (difficulty) {
            case "easy":
                return getRandomMove(board);
            case "normal":
                return getNormalMove(board);
            case "hard":
                return getHardMove(board);
            case "unbeatable":
                return getUnbeatableMove(board);
            default:
                return getRandomMove(board);
        }
    };

    return { getBestMove, setMarks };
})();

const UI = (() => {
    let player1 = "X";
    let player1Name = 'Player 1';
    let player2 = "O";
    let player2Name = 'Player 2';
    let gameMode = "ai";
    let difficulty = "easy";

    // Store references to DOM elements (passed in)
    let elements = {};

    const initUI = ({ 
        themeSwitch, 
        popupOverlay,
        popupConfirmBtn,
        popupCancelBtn, 
        markBtns, 
        modeBtns, 
        difficultySelect, 
        startBtn, 
        boardCells, 
        resetBtn, 
        resultBtn,
        homeBtn,
    }) => {
        elements = { 
            themeSwitch, 
            popupOverlay,
            popupConfirmBtn,
            popupCancelBtn, 
            markBtns, 
            modeBtns, 
            difficultySelect, 
            startBtn, 
            boardCells, 
            resetBtn, 
            resultBtn,
            homeBtn,
        };

        setEventListeners();
        initGameOverControls();
    };

    const setEventListeners = () => {
        elements.themeSwitch.addEventListener("change", toggleTheme);
        elements.popupCancelBtn.addEventListener("click", togglePopup);
        elements.popupConfirmBtn.addEventListener("click", () => {
            togglePopup();
            Game.resetGame();
        });
        elements.difficultySelect.addEventListener("change", updateDifficulty);

        elements.markBtns.forEach((btn) => {
            btn.addEventListener("click", () => {
                elements.markBtns.forEach((b) => b.classList.remove("highlight-select-mark"));
                btn.classList.add("highlight-select-mark");
                updatePlayers(btn.textContent);
            });
        });

        elements.modeBtns.forEach((btn) => {
            btn.addEventListener("click", () => {
                elements.modeBtns.forEach((b) => b.classList.remove("highlight-select-mark"));
                btn.classList.add("highlight-select-mark");
                switchGameMode(btn.id);
            });
        });

        elements.startBtn.addEventListener('click', () => {
            Game.init(gameMode, difficulty, player1);
            Game.resetScores(); // Reset scores when starting a new game
            document.querySelector('.markSelectorContainer').classList.add('hidden');
            document.querySelector('.game-panel').classList.remove('hidden');
            const player1Input = document.querySelector('.player1').value;
            player1Input && (player1Name = player1Input);
            const player2Input = document.querySelector('.player2').value;
            player2Input && (player2Name = player2Input);

            const playerXName = document.getElementById('playerXName');
            playerXName.innerText = player1 === 'X' ? player1Name : player2Name;
            const playerOName = document.getElementById('playerOName');
            playerOName.innerText = playerXName.innerText === player1Name ? player2Name : player1Name;

            if (gameMode === 'ai') {
                if (player1Name === playerXName.innerText) {
                    playerOName.innerText = `${difficulty} AI`;
                }
                else {
                    playerXName.innerText = `${difficulty} AI`;
                }
            }
        
        });

        // Add listeners for reset and result buttons
        if (elements.resetBtn) {
            elements.resetBtn.addEventListener('click', () => {
                // Check if game is in progress
                if (Game.isInProgress()) {
                    // Show reset confirmation popup
                    togglePopup();
                } else {
                    // If no game in progress, reset directly
                    Game.resetGame();
                }
            });
        }

        if (elements.resultBtn) {
            elements.resultBtn.addEventListener('click', () => {
                const scores = Game.getScores();
                const overallWinner = Game.getOverallWinner();
                showOverallResultPopup(overallWinner, scores);
            });
        }

        elements.homeBtn.addEventListener('click', () => {
            location.reload();
        })

        elements.boardCells.forEach((cell) => {
            function handleMouseEnter() {
                if (!cell.classList.contains('disabled')) {
                    if (Game.getCurrentPlayer() === 'X') cell.classList.add('x');
                    else cell.classList.add('o');
                }
            }

            function handleMouseLeave() {
                if (!cell.classList.contains('disabled')) {
                    cell.classList.remove('x', 'o');
                }
                
            }
            cell.addEventListener('mouseenter', handleMouseEnter);
            cell.addEventListener('mouseleave', handleMouseLeave);

            function handleClick() {
                if (!cell.classList.contains('disabled')) {
                    if (Game.getCurrentPlayer() === 'X') cell.classList.add('x');
                    else cell.classList.add('o');
    
                    Game.playTurn(cell.id);
                    currentPlayer = Game.getCurrentPlayer();
    
                    cell.classList.add('disabled');
                }
            }

            cell.addEventListener('click', handleClick);
        });
    };

    const initGameOverControls = () => {
        // Add event listeners for game over popup buttons
        document.getElementById('next-round-btn').addEventListener('click', () => {
            hideGameOverPopup();
            Game.resetGame();
        });
        
        document.getElementById('go-home-btn').addEventListener('click', () => {
            location.reload();
        });
    };

    const showGameOverPopup = (winner, scores) => {
        const popup = document.getElementById('game-over-popup');
        const announcement = document.getElementById('winner-announcement');
        
        // Get player names
        const playerXName = document.getElementById('playerXName').textContent;
        const playerOName = document.getElementById('playerOName').textContent;
        
        // Set the winner announcement text
        if (winner === 'draw') {
            announcement.innerHTML = `It's a Draw!<br>${playerXName}: ${scores.X} - ${playerOName}: ${scores.O}`;
        } else if (winner === 'X') {
            announcement.innerHTML = `${playerXName} Wins!<br>${playerXName}: ${scores.X} - ${playerOName}: ${scores.O}`;
        } else {
            announcement.innerHTML = `${playerOName} Wins!<br>${playerXName}: ${scores.X} - ${playerOName}: ${scores.O}`;
        }
        
        // Show the popup
        popup.classList.remove('hidden');
    };
    
    const showOverallResultPopup = (winner, scores) => {
        const popup = document.getElementById('game-over-popup');
        const announcement = document.getElementById('winner-announcement');
        
        // Get player names
        const playerXName = document.getElementById('playerXName').textContent;
        const playerOName = document.getElementById('playerOName').textContent;
        
        // Set the overall winner announcement text
        if (winner === 'draw') {
            announcement.innerHTML = `It's a Tie!<br>${playerXName}: ${scores.X} - ${playerOName}: ${scores.O}`;
        } else if (winner === 'X') {
            announcement.innerHTML = `${playerXName} Leads!<br>${playerXName}: ${scores.X} - ${playerOName}: ${scores.O}`;
        } else {
            announcement.innerHTML = `${playerOName} Leads!<br>${playerXName}: ${scores.X} - ${playerOName}: ${scores.O}`;
        }
        
        // Show the popup
        popup.classList.remove('hidden');
    };
    
    const hideGameOverPopup = () => {
        document.getElementById('game-over-popup').classList.add('hidden');
    };

    const toggleTheme = () => {
        document.body.classList.toggle("light");
    };

    const togglePopup = () => {
        elements.popupOverlay.classList.toggle("hidden");
    };

    const updatePlayers = (selectedMark) => {
        player1 = selectedMark;
        player2 = player1 === "X" ? "O" : "X";
    };

    const switchGameMode = (mode) => {
        gameMode = mode;
        const difficultySelector = document.getElementById('difficulty-selector');
        const player2 = document.querySelector('.player2');
        const isAiMode = (gameMode === 'ai');

        difficultySelector.classList.toggle('hidden', !isAiMode);
        player2.classList.toggle('hidden', isAiMode);
    };

    const updateDifficulty = () => {
        difficulty = elements.difficultySelect.value;
    };

    const getSettings = () => ({
        player1,
        player1Name,
        player2,
        player2Name,
        gameMode,
        difficulty,
    });

    return { initUI, getSettings, showGameOverPopup, hideGameOverPopup };
})();

// Initialize UI and pass necessary elements
UI.initUI({
    themeSwitch: document.getElementById("themeSwitch"),
    popupOverlay: document.querySelector(".translucent-overlay"),
    popupConfirmBtn: document.getElementById("confirm-popup-btn"),
    popupCancelBtn: document.getElementById("cancel-popup-btn"),
    markBtns: document.querySelectorAll(".mark"),
    modeBtns: document.querySelectorAll(".modeSelectorBtns"),
    difficultySelect: document.getElementById("difficulty-selector"),
    startBtn: document.querySelector('.start-btn'),
    boardCells: document.querySelectorAll('.cell'),
    resetBtn: document.getElementById('reset'),
    resultBtn: document.getElementById('result'),
    homeBtn: document.getElementById('home'),
});