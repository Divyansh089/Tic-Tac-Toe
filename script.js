document.addEventListener('DOMContentLoaded', () => {
    // Game state
    let gameActive = true;
    let currentPlayer = 'X';
    let gameState = ['', '', '', '', '', '', '', '', ''];
    let scores = { X: 0, O: 0 };

    // DOM elements
    const statusDisplay = document.getElementById('status');
    const winningMessageElement = document.getElementById('winning-message');
    const winningMessageTextElement = document.getElementById('winning-message-text');
    const scoreX = document.getElementById('score-x');
    const scoreO = document.getElementById('score-o');
    const playerX = document.querySelector('.player-x');
    const playerO = document.querySelector('.player-o');

    // Messages
    const winningMessage = () => `Player ${currentPlayer} wins!`;
    const drawMessage = () => `Game ended in a draw!`;
    const currentPlayerTurn = () => `Player ${currentPlayer}'s turn`;

    // Winning conditions
    const winningConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    // Set initial status
    statusDisplay.innerHTML = currentPlayerTurn();

    // Handle cell click
    function handleCellClick(clickedCellEvent) {
        const clickedCell = clickedCellEvent.target;
        const clickedCellIndex = parseInt(clickedCell.getAttribute('data-cell-index'));

        // Ignore if cell is already played or game is inactive
        if (gameState[clickedCellIndex] !== '' || !gameActive) {
            return;
        }

        // Update game state and UI
        handleCellPlayed(clickedCell, clickedCellIndex);
        handleResultValidation();
    }

    // Update the clicked cell with the current player's mark
    function handleCellPlayed(clickedCell, clickedCellIndex) {
        gameState[clickedCellIndex] = currentPlayer;
        // The class added (either "x" or "o") will trigger our CSS rules
        clickedCell.classList.add(currentPlayer.toLowerCase());
    }

    // Check whether someone has won or it's a draw
    function handleResultValidation() {
        let roundWon = false;
        let winningLine = null;

        for (let i = 0; i < winningConditions.length; i++) {
            const [a, b, c] = winningConditions[i];
            const condition = gameState[a] === gameState[b] &&
                              gameState[b] === gameState[c] &&
                              gameState[a] !== '';

            if (condition) {
                roundWon = true;
                winningLine = winningConditions[i];
                break;
            }
        }

        if (roundWon) {
            statusDisplay.innerHTML = winningMessage();
            gameActive = false;

            // Highlight winning cells
            winningLine.forEach(index => {
                document.querySelector(`[data-cell-index="${index}"]`).classList.add('win');
            });

            // Update score and display winning message
            scores[currentPlayer]++;
            updateScoreDisplay();

            setTimeout(() => {
                winningMessageTextElement.innerHTML = winningMessage();
                winningMessageElement.classList.add('show');
            }, 1000);
            return;
        }

        const roundDraw = !gameState.includes('');
        if (roundDraw) {
            statusDisplay.innerHTML = drawMessage();
            gameActive = false;
            setTimeout(() => {
                winningMessageTextElement.innerHTML = drawMessage();
                winningMessageElement.classList.add('show');
            }, 1000);
            return;
        }

        // Switch player if no win or draw
        handlePlayerChange();
    }

    function handlePlayerChange() {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        statusDisplay.innerHTML = currentPlayerTurn();

        if (currentPlayer === 'X') {
            playerX.classList.add('active');
            playerO.classList.remove('active');
        } else {
            playerO.classList.add('active');
            playerX.classList.remove('active');
        }
    }

    // Reset only the game board (keeping scores)
    function handleRestartGame() {
        gameActive = true;
        currentPlayer = 'X';
        gameState = ['', '', '', '', '', '', '', '', ''];
        statusDisplay.innerHTML = currentPlayerTurn();

        document.querySelectorAll('.cell').forEach(cell => {
            cell.classList.remove('x', 'o', 'win');
        });

        winningMessageElement.classList.remove('show');

        playerX.classList.add('active');
        playerO.classList.remove('active');
    }

    // Reset both game board and scores
    function handleResetScores() {
        scores = { X: 0, O: 0 };
        updateScoreDisplay();
    }

    function updateScoreDisplay() {
        scoreX.textContent = scores.X;
        scoreO.textContent = scores.O;
    }

    // Attach event listeners
    document.querySelectorAll('.cell').forEach(cell => {
        cell.addEventListener('click', handleCellClick);
    });

    document.getElementById('reset-game').addEventListener('click', handleRestartGame);
    document.getElementById('reset-scores').addEventListener('click', handleResetScores);
    document.getElementById('restart-button').addEventListener('click', handleRestartGame);
});
