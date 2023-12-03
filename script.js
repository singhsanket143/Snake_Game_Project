document.addEventListener("DOMContentLoaded", () => {
    const gameArena = document.getElementById("game-arena");
    const arenaSize = 600;
    const cellSize = 20;
    let score = 0;
    let gameStarted = false;
    let food = {x: 300, y: 200};
    let snake = [{x: 160, y: 200}, {x: 140, y: 200}, {x: 120, y: 200}];
    let dx = cellSize; // displacement on x axis
    let dy = 0; // displacement on y axis


    function drawScoreBoard() {
        const scoreBoard = document.getElementById('score-board');
        scoreBoard.textContent = `Score : ${score}`;
    }

    function drawDiv(x, y, className) {
        const div = document.createElement('div');
        div.classList.add(className);
        div.style.top = `${y}px`;
        div.style.left = `${x}px`;
        return div;
    }

    function drawFoodAndSnake() {
        gameArena.innerHTML = ''; // if previously something is drawn remove it
        // Wipe out everything and redraw with new coordinates when snake moves

        snake.forEach((snakeCell) => {
            const element = drawDiv(snakeCell.x, snakeCell.y, 'snake');
            gameArena.appendChild(element);
        })

        const foodElement = drawDiv(food.x, food.y, 'food');
        gameArena.appendChild(foodElement);

    }

    function moveFood() {
        let newX, newY;
        do {
            newX = Math.floor(Math.random() * ((arenaSize - cellSize)/cellSize) * cellSize);
            newY = Math.floor(Math.random() * ((arenaSize - cellSize)/cellSize) * cellSize);
        } while(snake.some(snakeCell => snakeCell.x === newX && snakeCell.y === newY));

        food = {x: newX, y: newY};
    }

    function updateSnake() {
        // 1. Calculate new coordinate the snake head will go to
        const newHead = {x: snake[0].x + dx, y: snake[0].y + dy}
        snake.unshift(newHead); // add the new head
        if(newHead.x === food.x && newHead.y === food.y) {
            // collision
            score += 5;
            // dont pop the tail
            moveFood();
            // move the food
        } else {
            snake.pop(); // remove the last cell
        }
    }

    function gameLoop() {
        setInterval(() => {
            updateSnake();
            drawScoreBoard();
            drawFoodAndSnake();
        }, 1000);
    }

    function runGame() {
        gameStarted = true;
        gameLoop();
    }


    function initiateGame() {
        const scoreBoard = document.createElement('div');
        scoreBoard.id = 'score-board';
        document.body.insertBefore(scoreBoard, gameArena);


        const startButton = document.createElement('button');
        startButton.textContent = 'Start Game';
        startButton.classList.add('start-button');
        document.body.appendChild(startButton);

        startButton.addEventListener('click', () => {
            startButton.style.display = 'none';
            runGame();
        })

    }


    initiateGame(); // this is the first function to be executed so that we prepare the ui


});