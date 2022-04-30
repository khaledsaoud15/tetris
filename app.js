document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".grid");
  const width = 10;
  let nextRandom = 0;
  const ScroeDisplay = document.querySelector("#score");
  const startButton = document.querySelector("#start-button");
  let squares = Array.from(document.querySelectorAll(".grid div"));
  let timeId;
  let score = 0;
  const colors = ["orange", "red", "green", "yellow", "blue"];

  //   the tetrominos
  const lTetromino = [
    [1, width + 1, width * 2 + 1, 2],
    [width, width + 1, width + 2, width * 2 + 2],
    [1, width + 1, width * 2 + 1, width * 2],
    [width, width * 2, width * 2 + 1, width * 2 + 2],
  ];
  const zTetromino = [
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
  ];
  const tTetromino = [
    [1, width, width + 1, width + 2],
    [1, width + 1, width + 2, width * 2 + 1],
    [width, width + 1, width + 2, width * 2 + 1],
    [1, width, width + 1, width * 2 + 1],
  ];
  const oTetromino = [
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
  ];
  const iTetromino = [
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
  ];

  const tetrominos = [
    lTetromino,
    zTetromino,
    tTetromino,
    oTetromino,
    iTetromino,
  ];
  let currPosition = 4;
  let currRotation = 0;

  // select the tetrominos randomly
  let random = Math.floor(Math.random() * tetrominos.length);
  let curr = tetrominos[random][currRotation];

  // assign functions to keycodes
  const control = (e) => {
    const move = e.keyCode;
    if (move === 81) {
      moveLeft();
    } else if (move === 32) {
      rotate();
    } else if (move === 68) {
      moveRight();
    } else if (move === 83) {
      // move faster
      moveDown();
    }
  };

  document.addEventListener("keyup", control);

  // draw the first rotation in the first tetromino
  const draw = () => {
    curr.forEach((index) => {
      squares[currPosition + index].classList.add("tetromino");
      squares[currPosition + index].style.backgroundColor = colors[random];
    });
  };

  // undraw the tetromino
  const unDraw = () => {
    curr.forEach((index) => {
      squares[currPosition + index].classList.remove("tetromino");
      squares[currPosition + index].style.backgroundColor = "";
    });
  };
  // write a freez function to freez the tetris whenever it touches the bottom surface
  const freez = () => {
    if (
      curr.some((index) =>
        squares[currPosition + index + width].classList.contains("taken")
      )
    ) {
      curr.forEach((index) =>
        squares[currPosition + index].classList.add("taken")
      );
      // start a new tetris falling
      random = nextRandom;
      nextRandom = Math.floor(Math.random() * tetrominos.length);
      curr = tetrominos[random][currRotation];
      currPosition = 4;
      draw();
      displayShape();
      addScore();
      gameOver();
    }
  };

  // move down funcionality
  const moveDown = () => {
    unDraw();
    currPosition += width;
    draw();
    freez();
  };
  // move the tetromino move left ,unless is at the edge or there is a blockage
  const moveLeft = () => {
    unDraw();
    const isLeftEdge = curr.some(
      (index) => (currPosition + index) % width === 0
    );
    if (!isLeftEdge) {
      currPosition -= 1;
    }

    if (
      curr.some((index) =>
        squares[currPosition + index].classList.contains("taken")
      )
    ) {
      currPosition += 1;
    }
    draw();
  };
  // move the tetromino move right ,unless is at the edge or there is a blockage
  const moveRight = () => {
    unDraw();
    const isRightEdge = curr.some(
      (index) => (currPosition + index) % width === width - 1
    );
    if (!isRightEdge) {
      currPosition += 1;
    }

    if (
      curr.some((index) =>
        squares[currPosition + index].classList.contains("taken")
      )
    ) {
      currPosition -= 1;
    }
    draw();
  };

  // rotet the tetromino
  const rotate = () => {
    unDraw();
    currRotation++;
    if (currRotation == curr.length) {
      //if the current rotation gets to 4,make it back to 0
      currRotation = 0;
    }
    curr = tetrominos[random][currRotation];
    draw();
  };

  // show up-Next tetromino in mini-grid display
  const displaySquars = document.querySelectorAll(".mini-grid div");
  const displayWidth = 4;
  let displayIndex = 0;

  // the tetrominos without rotation

  const upNextTetrominos = [
    [1, displayWidth + 1, displayWidth * 2 + 1, 2], //lTetromino
    [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1], //ztetromino
    [1, displayWidth, displayWidth + 1, displayWidth + 2], //tTetromino
    [0, 1, displayWidth, displayWidth + 1], //oTetromino
    [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1], //iTetromino
  ];

  // display the shape in the mini grid

  const displayShape = () => {
    //removing the class from the tetromino
    displaySquars.forEach((square) => {
      square.classList.remove("tetromino");
      square.style.backgroundColor = "";
    });
    upNextTetrominos[nextRandom].forEach((index) => {
      displaySquars[displayIndex + index].classList.add("tetromino");
      displaySquars[displayIndex + index].style.backgroundColor =
        colors[nextRandom];
    });
  };

  // add funcionality to the button
  startButton.addEventListener("click", () => {
    if (timeId) {
      clearInterval(timeId);
      timeId = null;
    } else {
      // make the tetrominos move down every 1s
      timeId = setInterval(moveDown, 1000);
      nextRandom = Math.floor(Math.random() * tetrominos.length);
      displayShape();
    }
  });

  const addScore = () => {
    for (let i = 0; i < 199; i += width) {
      const row = [
        i,
        i + 1,
        i + 2,
        i + 3,
        i + 4,
        i + 5,
        i + 6,
        i + 7,
        i + 8,
        i + 9,
      ];

      if (row.every((index) => squares[index].classList.contains("taken"))) {
        score += 10;
        ScroeDisplay.innerHTML = score;
        row.forEach((index) => {
          squares[index].classList.remove("taken");
          squares[index].classList.remove("tetromino");
          squares[index].style.backgroundColor = "";
        });
        const squaresRemoved = squares.splice(i, width);
        squares = squaresRemoved.concat(squares);
        squares.forEach((cell) => grid.appendChild(cell));
      }
    }
  };

  // game over function
  const gameOver = () => {
    const over = curr.some((index) =>
      squares[currPosition + index].classList.contains("taken")
    );
    if (over) {
      ScroeDisplay.innerHTML = "end";
      clearInterval(timeId);
    }
  };
});
