document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('board');
    const cells = document.querySelectorAll('.cell');
    const status = document.getElementById('status');
    const resetButton = document.getElementById('reset');
    const body = document.body;
    
    let currentPlayer = 'X';
    let gameState = ['', '', '', '', '', '', '', '', ''];
    let gameActive = true;
    
    const winningConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
        [0, 4, 8], [2, 4, 6]             // diagonals
    ];
    
    // Handle cell click
    function handleCellClick(e) {
        const clickedCell = e.target;
        const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));
        
        if (gameState[clickedCellIndex] !== '' || !gameActive) return;
        
        gameState[clickedCellIndex] = currentPlayer;
        animateCell(clickedCell);
        
        checkResult();
    }
    
    // Animate cell when marked
    function animateCell(cell) {
        cell.textContent = currentPlayer;
        cell.classList.add(currentPlayer.toLowerCase());
        
        // Trigger reflow to restart animation
        void cell.offsetWidth;
        cell.style.animation = 'none';
        void cell.offsetWidth;
        cell.style.animation = '';
    }
    
    // Check game result
    function checkResult() {
        let roundWon = false;
        let winningCombo = [];
        
        for (let i = 0; i < winningConditions.length; i++) {
            const [a, b, c] = winningConditions[i];
            
            if (gameState[a] === '' || gameState[b] === '' || gameState[c] === '') continue;
            
            if (gameState[a] === gameState[b] && gameState[b] === gameState[c]) {
                roundWon = true;
                winningCombo = winningConditions[i];
                break;
            }
        }
        
        if (roundWon) {
            gameActive = false;
            winningCombo.forEach(index => {
                cells[index].classList.add('winning-cell');
            });
            status.textContent = `Player ${currentPlayer} wins!`;
            createConfetti();
            return;
        }
        
        if (!gameState.includes('')) {
            gameActive = false;
            status.textContent = "Game ended in a draw!";
            return;
        }
        
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        status.textContent = `Player ${currentPlayer}'s turn`;
        
        // Animate status change
        status.style.animation = 'none';
        void status.offsetWidth;
        status.style.animation = 'fadeIn 0.5s ease-out';
    }
    
    // Create confetti effect
    function createConfetti() {
        const colors = ['#ff4757', '#2ed573', '#3498db', '#ffa502', '#7bed9f', '#70a1ff'];
        
        for (let i = 0; i < 100; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            
            // Random properties
            const size = Math.random() * 10 + 5;
            const color = colors[Math.floor(Math.random() * colors.length)];
            const left = Math.random() * window.innerWidth;
            const animationDuration = Math.random() * 3 + 2;
            const delay = Math.random() * 2;
            
            // Apply styles
            confetti.style.width = `${size}px`;
            confetti.style.height = `${size}px`;
            confetti.style.backgroundColor = color;
            confetti.style.left = `${left}px`;
            confetti.style.animationDuration = `${animationDuration}s`;
            confetti.style.animationDelay = `${delay}s`;
            
            // Random shape
            if (Math.random() > 0.5) {
                confetti.style.borderRadius = '50%';
            }
            
            document.body.appendChild(confetti);
            
            // Remove after animation
            setTimeout(() => {
                confetti.remove();
            }, (animationDuration + delay) * 1000);
        }
    }
    
    // Reset game
    function resetGame() {
        currentPlayer = 'X';
        gameState = ['', '', '', '', '', '', '', '', ''];
        gameActive = true;
        status.textContent = `Player ${currentPlayer}'s turn`;
        
        cells.forEach(cell => {
            cell.textContent = '';
            cell.className = 'cell';
            cell.style.animation = '';
        });
        
        // Remove any remaining confetti
        document.querySelectorAll('.confetti').forEach(el => el.remove());
        
        // Animate status
        status.style.animation = 'none';
        void status.offsetWidth;
        status.style.animation = 'fadeIn 0.5s ease-out';
    }
    
    // Event listeners
    cells.forEach(cell => cell.addEventListener('click', handleCellClick));
    resetButton.addEventListener('click', resetGame);
});