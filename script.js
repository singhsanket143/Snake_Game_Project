document.addEventListener("DOMContentLoaded", () => {
  const gameArena = document.getElementById("game-arena");
  const playerNameElement = document.getElementById("playerName");

  const continueButton = document.querySelector(".continue-game");
  const quitButton = document.querySelector(".end-game");

  let playerName = "";

  const arenaInitialWidth = gameArena.clientWidth;
  let arenaWidth = Math.floor(arenaInitialWidth / 20) * 20 + 10;
  gameArena.style.width = `${arenaWidth}px`;
  const arenaInitialHeight = gameArena.clientHeight;
  let arenaHeight = Math.floor(arenaInitialHeight / 20) * 20 + 10;
  gameArena.style.height = `${arenaHeight}px`;

  // resize game arena on window resize
  window.addEventListener("resize", resizeGameArena);
  setInterval(resizeGameArena, 1000); // resize game arena every 1 second

  // resize game arena -> utility function
  function resizeGameArena() {
    gameArena.style.width = "100%";
    gameArena.style.height = "100%";
    gameArena.style.minWidth = "270px";
    gameArena.style.minHeight = "270px";

    const arenaInitialWidth = gameArena.clientWidth;
    arenaWidth = Math.floor(arenaInitialWidth / 20) * 20 + 10;
    gameArena.style.width = `${arenaWidth}px`;
    const arenaInitialHeight = gameArena.clientHeight;
    arenaHeight = Math.floor(arenaInitialHeight / 20) * 20 + 10;
    gameArena.style.height = `${arenaHeight}px`;
  }

  const clearHistory = document.querySelector(".clear-history-btn");

  // if clear history btn exists then only add event listener to clear history
  if (clearHistory) {
    clearHistory.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.setItem("scoreBoardList", JSON.stringify([]));
      scoreBoardList = [];
      renderScoreBoard();
      noScoreFound();
    });
  }

  const cellSize = 20;

  let score = 0;
  let scoreBoardList = [];

  // store the score board in local storage
  if (localStorage.getItem("scoreBoardList")) {
    scoreBoardList = JSON.parse(localStorage.getItem("scoreBoardList"));
  } else {
    localStorage.setItem("scoreBoardList", JSON.stringify(scoreBoardList));
  }

  let gameStarted = false;
  let gameOver = false;

  let food = { x: 120, y: 100 };
  let snake = [
    { x: 80, y: 100 },
    { x: 60, y: 100 },
    { x: 40, y: 100 },
  ];

  let dx = cellSize; // displacement on x axis
  let dy = 0; // displacement on y axis
  let gameSpeed = 200;
  let intervalId;

  // format date and time -> utility function
  function formatDateTime(inputDate) {
    const date = new Date(inputDate);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    const formattedDateTime = `${day}/${month}/${year} (${hours}:${minutes})`;

    return formattedDateTime;
  }

  // speed in X terms
  function speedInXTerms(gameSpeed, score) {
    if (gameSpeed == 200) {
      return `Score: ${score} & Speed: 1x 🐌`;
    } else if (gameSpeed >= 150 && gameSpeed < 200) {
      return `Score: ${score} & Speed: 1.5x 🔥`;
    } else if (gameSpeed >= 100 && gameSpeed < 150) {
      return `Score: ${score} & Speed: 2x 🚀`;
    } else {
      return `Score: ${score} & Speed: 2x+ 🤯`;
    }
  }

  // no score found -> utility function
  function noScoreFound() {
    const scoreBoardTableDiv = document.querySelector(".score-board-table-div");
    scoreBoardTableDiv.style.display = "none";
    const clearHistory = document.querySelector(".clear-history");
    const scoreBoardMessageDiv = document.querySelector(
      ".score-board-message-div"
    );
    const scoreBoardMessage = document.querySelector(".score-board-message");

    scoreBoardMessageDiv.style.display = "block";
    scoreBoardMessage.textContent = "No scores yet";
    scoreBoardMessage.style.color = "red";
    clearHistory.style.display = "none";
  }

  // render score board
  function renderScoreBoard() {
    if (scoreBoardList.length === 0) {
      noScoreFound();
      return;
    }

    const scoreBoardMessageDiv = document.querySelector(
      ".score-board-message-div"
    );
    const scoreBoardListElement = document.querySelector(".score-board-list");
    const scoreBoardTableDiv = document.querySelector(".score-board-table-div");
    const clearHistory = document.querySelector(".clear-history");
    scoreBoardMessageDiv.style.display = "none";
    clearHistory.style.display = "block";
    scoreBoardTableDiv.style.display = "block";

    scoreBoardListElement.innerHTML = "";
    scoreBoardList.sort((a, b) => b.score - a.score);
    scoreBoardList.forEach((scoreItem, idx) => {
      if (idx > 14) return;
      const tRow = document.createElement("tr");
      const rankCell = document.createElement("td");
      rankCell.textContent = idx + 1;
      const nameCell = document.createElement("td");
      nameCell.textContent = scoreItem.name;
      const dateCell = document.createElement("td");
      dateCell.textContent = formatDateTime(scoreItem.date);
      const scoreCell = document.createElement("td");
      scoreCell.textContent = scoreItem.score;

      tRow.appendChild(rankCell);
      tRow.appendChild(nameCell);
      tRow.appendChild(dateCell);
      tRow.appendChild(scoreCell);

      scoreBoardListElement.appendChild(tRow);
    });
  }

  // update score board
  function updateScoreBoard(score) {
    const scoreItem = {
      name: playerName,
      date: new Date(),
      score: score,
    };
    scoreBoardList.push(scoreItem);
    renderScoreBoard();
    localStorage.setItem("scoreBoardList", JSON.stringify(scoreBoardList));
    return;
  }

  // reset game -> utility function
  function resetGame() {
    const startButton = document.querySelector(".start-game");
    const gameBtns = document.querySelectorAll(".game-btn");

    playerName = ""; // Reset playerName
    playerNameElement.value = ""; // Reset playerName input field

    gameStarted = false;
    gameOver = false;
    gameArena.innerHTML = "";

    score = 0;
    gameSpeed = 200;
    gameStarted = false;
    food = { x: 120, y: 100 };
    snake = [
      { x: 80, y: 100 },
      { x: 70, y: 100 },
      { x: 60, y: 100 },
    ];
    dx = cellSize;
    dy = 0;

    intervalId = null;

    startButton.style.display = "block";
    startButton.innerHTML = "Restart ";
    gameBtns.forEach((btn) => (btn.style.display = "none"));
  }

  // draw div -> utility function
  function drawDiv(x, y, className) {
    const div = document.createElement("div");
    div.classList.add(className);
    div.style.top = `${y}px`;
    div.style.left = `${x}px`;
    return div;
  }

  // draw food and snake
  function drawFoodAndSnake() {
    gameArena.innerHTML = "";

    snake.forEach((snakeCell) => {
      const element = drawDiv(snakeCell.x, snakeCell.y, "snake");
      gameArena.appendChild(element);
    });

    const foodElement = drawDiv(food.x, food.y, "food");
    foodElement.innerText = "🐸";
    foodElement.style.fontSize = "20px";
    gameArena.appendChild(foodElement);
  }

  // move food
  function moveFood() {
    let newX, newY;
    do {
      newX =
        Math.floor(Math.random() * ((arenaWidth - cellSize) / cellSize)) *
        cellSize;
      newY =
        Math.floor(Math.random() * ((arenaHeight - cellSize) / cellSize)) *
        cellSize;
    } while (
      snake.some((snakeCell) => snakeCell.x === newX && snakeCell.y === newY)
    );

    food = { x: newX, y: newY };
  }

  // update snake
  function updateSnake() {
    // 1. Calculate new coordinate the snake head will go to
    const newHead = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(newHead); // add the new head
    if (newHead.x === food.x && newHead.y === food.y) {
      // play eat.wav audio
      const audio = new Audio("./assets/eat.wav");
      audio.play();
      // collision
      score += 5;
      const showScoreElement = document.querySelector(".game-message");
      showScoreElement.textContent = `${speedInXTerms(gameSpeed, score)}`;
      if (gameSpeed > 30) {
        clearInterval(intervalId);
        gameSpeed -= 10;
        gameLoop();
      }
      // dont pop the tail
      moveFood();
      // move the food
    } else {
      snake.pop(); // remove the last cell
    }
  }

  // game over function
  function gameOverFunction() {
    // play gameOver.wav audio
    const audio = new Audio("./assets/gameOver.wav");
    audio.play();
    // Add the "shake" class to start the animation
    gameArena.classList.add("shake");

    // Remove the "shake" class after 1000 milliseconds (1 second)
    setTimeout(() => {
      gameArena.classList.remove("shake");
    }, 1000);
    const snakes = document.querySelectorAll(".snake");
    snakes.forEach((snake) => {
      snake.style.backgroundColor = "red";
    });
  }

  // game over message -> utility function
  function gameOverMessage(score) {
    const gameMessage = document.querySelector(".game-message");
    if (scoreBoardList.length === 0) {
      gameMessage.innerHTML = `Yahh! 🥳 created new high score : ${score}. Want to continue ?`;
      return;
    }
    scoreBoardList.sort((a, b) => b.score - a.score);
    highScore = scoreBoardList[0].score;
    if (score == highScore) {
      gameMessage.innerHTML = `Yahh! 😍 you mated the high score : ${score}. Want to continue ?`;
    } else if (score > highScore) {
      gameMessage.innerHTML = `Yahh! 🥳 created new high score : ${score}. Want to continue ?`;
    } else {
      gameMessage.innerHTML = `Game Over! Your score is ${score}. Want to continue ?`;
    }
    return;
  }

  // check if game is over
  function isGameOver() {
    // check snake body hit
    for (i = 1; i < snake.length; i++) {
      if (snake[0].x === snake[i].x && snake[0].y === snake[i].y) {
        gameOver = true;
      } // game over
    }

    // check wall collision
    const isHittingLeftWall = snake[0].x < 0;
    const isHittingTopWall = snake[0].y < 0;
    const isHittingRightWall = snake[0].x >= arenaWidth - 10;
    const isHittingDownWall = snake[0].y >= arenaHeight - 10;

    if (
      isHittingDownWall ||
      isHittingLeftWall ||
      isHittingRightWall ||
      isHittingTopWall
    ) {
      // game over
      gameOver = true;
    }

    return gameOver;
  }

  // ask to continue
  function askToContinue() {
    const gameBtns = document.querySelectorAll(".game-btn");
    gameBtns.forEach((btn) => (btn.style.display = "none"));

    continueButton.style.display = "inline-block";
    quitButton.style.display = "inline-block";
  }

  // draw snake to restart game
  function drawSnakeToRestartGame(sX, sY, eX, eY, gap, size) {
    let matrix = [{ x: sX, y: sY }];

    sX -= gap;

    for (let i = 1; i < size; i++) {
      if (sX > 0 && sY < eY) {
        matrix[i] = { x: sX, y: sY };
        sX -= gap;
      } else if (sX == 0 && sY < eY) {
        matrix[i] = { x: sX, y: sY };
        sY += gap;
      } else if (sY == eY && sX < eX) {
        matrix[i] = { x: sX, y: sY };
        sX += gap;
      }
    }

    return matrix;
  }

  // continue button event listener
  continueButton.addEventListener("click", (e) => {
    gameBtns = document.querySelectorAll(".game-btn");
    e.preventDefault();
    const gameMessage = document.querySelector(".game-message");

    gameMessage.innerHTML = `${speedInXTerms(gameSpeed, score)}`;
    gameMessage.style.color = "black";

    continueButton.style.display = "none";
    quitButton.style.display = "none";
    gameBtns.forEach((btn) => (btn.style.display = "block"));

    gameOver = false;
    food = { x: 120, y: 100 };
    snake = drawSnakeToRestartGame(
      80,
      100,
      arenaWidth - 30,
      arenaHeight - 30,
      cellSize,
      snake.length
    );
    dx = cellSize; // displacement on x axis
    dy = 0; // displacement on y axis

    // Restart the game loop
    gameLoop();

    document.addEventListener("keydown", changeDirection);
    gameBtns.forEach((btn) => {
      btn.addEventListener("click", changeDirectionUsingBtn);
    });
  });

  // quit button event listener
  quitButton.addEventListener("click", (e) => {
    gameMessage = document.querySelector(".game-message");
    e.preventDefault();
    gameMessage.style.color = "black";
    continueButton.style.display = "none";
    quitButton.style.display = "none";
    gameMessage.innerHTML = `Lets play again!`;
    updateScoreBoard(score);
    resetGame();
  });

  // game loop
  function gameLoop() {
    intervalId = setInterval(() => {
      if (!gameStarted) return;

      if (isGameOver()) {
        clearInterval(intervalId);
        gameOverMessage(score);
        gameOverFunction();
        askToContinue();
        return;
      } else {
        updateSnake();
        drawFoodAndSnake();
      }
    }, gameSpeed);
  }

  // change direction using keyInput
  function changeDirection(e) {
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;

    const keyPressed = e.keyCode;

    const isGoingUp = dy == -cellSize;
    const isGoingDown = dy == cellSize;
    const isGoingLeft = dx == -cellSize;
    const isGoingRight = dx == cellSize;

    if (keyPressed == LEFT_KEY && !isGoingRight) {
      dy = 0;
      dx = -cellSize;
    }

    if (keyPressed == RIGHT_KEY && !isGoingLeft) {
      dy = 0;
      dx = cellSize;
    }

    if (keyPressed == UP_KEY && !isGoingDown) {
      dy = -cellSize;
      dx = 0;
    }

    if (keyPressed == DOWN_KEY && !isGoingUp) {
      dy = cellSize;
      dx = 0;
    }
  }

  // change direction using button
  function changeDirectionUsingBtn(e) {
    e.preventDefault();
    const btn = e.target;
    const direction = btn.dataset.direction;

    const isGoingUp = dy == -cellSize;
    const isGoingDown = dy == cellSize;
    const isGoingLeft = dx == -cellSize;
    const isGoingRight = dx == cellSize;

    if (direction === "left" && !isGoingRight) {
      dy = 0;
      dx = -cellSize;
    }

    if (direction === "right" && !isGoingLeft) {
      dy = 0;
      dx = cellSize;
    }

    if (direction === "up" && !isGoingDown) {
      dy = -cellSize;
      dx = 0;
    }

    if (direction === "down" && !isGoingUp) {
      dy = cellSize;
      dx = 0;
    }
  }

  //run the game
  function runGame() {
    if (!gameStarted) {
      gameStarted = true;
      gameOver = false;
      gameLoop();
      document.addEventListener("keydown", changeDirection);
      const gameBtns = document.querySelectorAll(".game-btn");

      gameBtns.forEach((btn) => {
        btn.addEventListener("click", changeDirectionUsingBtn);
      });
    }
  }

  // initiate game
  function initiateGame() {
    const gameMessage = document.querySelector(".game-message");
    const startButton = document.querySelector(".start-game");
    const gameBtns = document.querySelectorAll(".game-btn");

    startButton.addEventListener("click", (e) => {
      e.preventDefault();
      playerName = playerNameElement.value.trim();
      if (playerName === "") {
        gameMessage.innerHTML = "⚠️ Enter your name to start";
        gameMessage.style.color = "red";
        return;
      }

      gameStarted = false;
      startButton.style.display = "none";
      gameBtns.forEach((btn) => (btn.style.display = "block"));
      gameMessage.style.color = "black";
      gameMessage.innerHTML = "Use arrow keys to move the 🐍";

      runGame();
    });
  }

  renderScoreBoard();
  initiateGame();
});
