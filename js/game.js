let canvas;
let ctx;
let world;
let keyboard = new Keyboard();
let gameStarted = false;
let winScreenDisplayed = false;
let intervalIds = [];

function showStartScreen() {
  new StartScreen(
    "canvas",
    "img/9_intro_outro_screens/start/startscreen_2.png",
    "playButton"
  );

  document.getElementById("playButton").addEventListener("click", () => {
    document.getElementById("game-controls").classList.remove("hidden");
    document.getElementById("playButton").classList.add("hidden");
    init();
  });
}

function init() {
  initLevel();
  canvas = document.getElementById("canvas");
  world = new World(canvas, keyboard);

  document.getElementById("left-btn").addEventListener("touchstart", () => {
    keyboard.LEFT = true;
  });
  document.getElementById("left-btn").addEventListener("touchend", () => {
    keyboard.LEFT = false;
  });

  document.getElementById("right-btn").addEventListener("touchstart", () => {
    keyboard.RIGHT = true;
  });
  document.getElementById("right-btn").addEventListener("touchend", () => {
    keyboard.RIGHT = false;
  });

  document.getElementById("jump-btn").addEventListener("touchstart", () => {
    keyboard.SPACE = true;
  });
  document.getElementById("jump-btn").addEventListener("touchend", () => {
    keyboard.SPACE = false;
  });

  document.getElementById("throw-btn").addEventListener("touchstart", () => {
    keyboard.D = true;
  });
  document.getElementById("throw-btn").addEventListener("touchend", () => {
    keyboard.D = false;
  });
}

document.addEventListener("keydown", (e) => {
  if (e.keyCode == 39) {
    keyboard.RIGHT = true;
  }

  if (e.keyCode == 37) {
    keyboard.LEFT = true;
  }

  if (e.keyCode == 38) {
    keyboard.UP = true;
  }

  if (e.keyCode == 40) {
    keyboard.DOWN = true;
  }

  if (e.keyCode == 32) {
    keyboard.SPACE = true;
  }

  if (e.keyCode == 68) {
    keyboard.D = true;
  }
});

document.addEventListener("keyup", (e) => {
  if (e.keyCode == 39) {
    keyboard.RIGHT = false;
  }

  if (e.keyCode == 37) {
    keyboard.LEFT = false;
  }

  if (e.keyCode == 38) {
    keyboard.UP = false;
  }

  if (e.keyCode == 40) {
    keyboard.DOWN = false;
  }

  if (e.keyCode == 32) {
    keyboard.SPACE = false;
  }

  if (e.keyCode == 68) {
    keyboard.D = false;
  }
});

function stopAllIntervals() {
  intervalIds.forEach((id) => clearInterval(id));
  intervalIds = [];
}

function showWinningScreen() {
    let winningScreen = new WinningScreen("restartButton");
    setTimeout(() => {
        let checkDiv = document.getElementById("winning-screen");
        if (!checkDiv) {
        } else {
        }
    }, 1000);
}




  
  


