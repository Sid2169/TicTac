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

    const checkWinner = () => {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6]             // Diagonals
        ];

        for (let pattern of winPatterns) {
            const [a, b, c] = pattern;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return board[a]; // Return 'X' or 'O' as winner
            }
        }
        return board.includes(null) ? null : 'draw'; // Game or draw
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
        if (isGameOver) return false;
        if (!Board.makeMove(index, currentPlayer)) return false;

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