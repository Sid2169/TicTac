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

    const init = (gameMode = "2-player", difficulty = "easy") => {
        Board.init();
        currentPlayer = "X"; // X always starts
        mode = gameMode;
        aiDifficulty = difficulty;
        isGameOver = false;
    };

    const getCurrentPlayer = () => currentPlayer;

    const playTurn = (index) => {
        if (isGameOver || !Board.makeMove(index, currentPlayer)) return false;

        let winner = Board.checkWinner();
        if (winner) {
            isGameOver = true;
            return { status: "gameover", winner };
        }

        switchTurn();

        if (mode === "ai" && currentPlayer === "O") {
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
        }
    };

    return { init, getCurrentPlayer, playTurn };
})();

// AI module for ai
const AI = (() => {
    // Get available empty spots on the board
    const getAvailableMoves = (board) => board.map((val, index) => val === null ? index : null).filter(val => val !== null);


    // Easy mode: Random move
    const getRandomMove = (board) => {
        const available = getAvailableMoves(board);
        return available.length > 0 ? available[Math.floor(Math.random() * available.length)] : -1;
    };

    // Normal mode: Blocks winning moves
    const getNormalMove = (board) => {
        const available = getAvailableMoves(board);
        for (let move of available) {
            let testBoard = [...board];
            testBoard[move] = "O"; // Simulate AI move
            if (Board.checkWinner(testBoard) === "O") return move;

            testBoard[move] = "X"; // Simulate player move
            if (Board.checkWinner(testBoard) === "X") return move;
        }
        return getRandomMove(board); // If no critical move, pick random
    };

    // Hard mode: Plays optimally with occasional mistakes
    const getHardMove = (board) => {
        return Math.random() > 0.2 ? getUnbeatableMove(board) : getNormalMove(board);
    };

    // Unbeatable mode: Minimax algorithm
    const getUnbeatableMove = (board) => {
        let bestScore = -Infinity;
        let bestMove = -1;
        const available = getAvailableMoves(board);

        for (let move of available) {
            let testBoard = [...board];
            testBoard[move] = "O"; // AI makes a move
            let score = minimax(testBoard, false);
            if (score > bestScore) {
                bestScore = score;
                bestMove = move;
            }
        }
        return bestMove;
    };

    // Minimax Algorithm
    const minimax = (board, isMaximizing) => {
        let winner = Board.checkWinner(board);
        if (winner === "O") return 10;
        if (winner === "X") return -10;
        if (!board.includes(null)) return 0; // Draw

        let bestScore = isMaximizing ? -Infinity : Infinity;
        const available = getAvailableMoves(board);

        for (let move of available) {
            let testBoard = [...board];
            testBoard[move] = isMaximizing ? "O" : "X";
            let score = minimax(testBoard, !isMaximizing);
            bestScore = isMaximizing ? Math.max(bestScore, score) : Math.min(bestScore, score);
        }

        return bestScore;
    };

    // Public function to get best move based on difficulty
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

    return { getBestMove };
})();

const UI = (() => {
    let player1 = "X";
    let player2 = "O";
    let gameMode = "ai";
    let difficulty = "easy";

    // Store references to DOM elements (passed in)
    let elements = {};

    const initUI = ({ themeSwitch, popupBtn, markBtns, modeBtns, difficultySelect }) => {
        elements = { themeSwitch, popupBtn, markBtns, modeBtns, difficultySelect };

        setEventListeners();
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
        player2,
        gameMode,
        difficulty,
    });

    return { initUI, getSettings };
})();

// Initialize UI and pass necessary elements
UI.initUI({
    themeSwitch: document.getElementById("themeSwitch"),
    popupBtn: document.getElementById("cancel-popup-btn"),
    markBtns: document.querySelectorAll(".mark"),
    modeBtns: document.querySelectorAll(".modeSelectorBtns"),
    difficultySelect: document.getElementById("difficulty-selector"),
});
