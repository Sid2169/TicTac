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

    const init = (gameMode = "2-player", difficulty = "easy", userMark = "X") => {
        Board.init();
        humanPlayer = userMark;
        aiPlayer = userMark === "X" ? "O" : "X"; // AI takes the other mark
        currentPlayer = "X"; // X always starts
        mode = gameMode;
        aiDifficulty = difficulty;
        isGameOver = false;

        AI.setMarks(aiPlayer, humanPlayer); // Tells AI its mark

        // If AI is 'X', it should make the first move
        if (mode === "ai" && aiPlayer === "X") {
            playAITurn();
        }
    };

    const getCurrentPlayer = () => currentPlayer;

    const playTurn = (index) => {
        if (isGameOver || !Board.makeMove(index, currentPlayer)) return false;

        let winner = Board.checkWinner();
        if (winner) {
            isGameOver = true;
            UI.showGameOverPopup(winner);
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

    const resetGame = () => {
        Board.init();
        isGameOver = false;
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

    return { init, getCurrentPlayer, playTurn, resetGame };
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

    const initUI = ({ themeSwitch, popupBtn, markBtns, modeBtns, difficultySelect, startBtn, boardCells }) => {
        elements = { themeSwitch, popupBtn, markBtns, modeBtns, difficultySelect, startBtn, boardCells };

        setEventListeners();
        initGameOverControls();
    };

    const setEventListeners = () => {
        elements.themeSwitch.addEventListener("change", toggleTheme);
        elements.popupBtn.addEventListener("click", togglePopup);
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

    const showGameOverPopup = (winner) => {
        const popup = document.getElementById('game-over-popup');
        const announcement = document.getElementById('winner-announcement');
        
        // Set the winner announcement text
        if (winner === 'draw') {
            announcement.textContent = "It's a Draw!";
        } else if (winner === 'X') {
            const playerName = document.getElementById('playerXName').textContent;
            announcement.textContent = `${playerName} Wins!`;
        } else {
            const playerName = document.getElementById('playerOName').textContent;
            announcement.textContent = `${playerName} Wins!`;
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
        document.querySelector(".translucent-overlay").classList.toggle("hidden");
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
    popupBtn: document.getElementById("cancel-popup-btn"),
    markBtns: document.querySelectorAll(".mark"),
    modeBtns: document.querySelectorAll(".modeSelectorBtns"),
    difficultySelect: document.getElementById("difficulty-selector"),
    startBtn: document.querySelector('.start-btn'),
    boardCells: document.querySelectorAll('.cell'),
});
