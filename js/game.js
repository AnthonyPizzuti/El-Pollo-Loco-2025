let canvas;
let ctx;
let world;
window.keyboard = {};
if (document.getElementById("canvas")) {
  window.keyboard = new Keyboard();
}
let gameStarted = false;
let winScreenDisplayed = false;
let intervalIds = [];
let gameOverDisplayed = false;
let isMuted = false;
let allGameSounds = [];
let gamePaused = false;
let pausedIntervals = [];

function showStartScreen() {
  new StartScreen(
    "canvas",
    "img/9_intro_outro_screens/start/startscreen_2.png",
    "playButton"
  );
  document.getElementById("playButton").addEventListener("click", () => {
    gameStarted = true;
    document.getElementById("impressum-icon").style.display = "none";
    document.getElementById("game-controls").classList.remove("hidden");
    document.getElementById("playButton").classList.add("hidden");
    document.getElementById("pause-btn").style.display = "block";
    let pauseBtn = document.getElementById("pause-btn");
    pauseBtn.style.display = "block";
    pauseBtn.style.pointerEvents = "auto";
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
  if (!gameStarted) return;

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

  if (e.keyCode == 80) {
    togglePause();
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

function closeImpressum() {
  if (window.opener) {
    window.close();
  } else {
    window.location.href = "index.html";
  }
}

function stopAllIntervals() {
  intervalIds.forEach(clearInterval);
  intervalIds = [];
  if (world && world.animationFrame) {
    cancelAnimationFrame(world.animationFrame);
    world.animationFrame = null;
  }
}

function restartIntervals() {
  if (!world) return;
  world.draw();
  world.setWorld();
  world.run();
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

function showGameOverScreen() {
  let gameOverScreen = new GameOverScreen("restartButton");
  setTimeout(() => {
    let checkDiv = document.getElementById("game-over-screen");
    if (!checkDiv) {
    } else {
    }
  }, 1000);
}

function toggleFullscreen() {
  let container = document.getElementById("game-container");
  if (!document.fullscreenElement) {
    if (container.requestFullscreen) {
      container.requestFullscreen();
    } else if (container.msRequestFullscreen) {
      container.msRequestFullscreen();
    } else if (container.webkitRequestFullscreen) {
      container.webkitRequestFullscreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  }
}

function enterFullscreen(element) {
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.msRequestFullscreen) {
    element.msRequestFullscreen();
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  }
}

function exitFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }
}
document.addEventListener("DOMContentLoaded", () => {
  let fullscreenBtn = document.getElementById("fullscreen-btn");
  if (fullscreenBtn) {
    fullscreenBtn.addEventListener("click", toggleFullscreen);
  } else {
  }
});

function toggleMute() {
  isMuted = !isMuted;
  let muteButton = document.getElementById("mute-btn").querySelector("img");
  if (isMuted) {
    muteButton.src = "./img/controll/mute.png";
  } else {
    muteButton.src = "./img/controll/ton.png";
  }
  muteAllSounds();
}

function muteAllSounds() {
  allGameSounds.forEach((sound) => {
    if (sound) {
      if (isMuted) {
        sound.muted = true;
        sound.pause();
      } else {
        sound.muted = false;
        if (sound.loop && !sound.isStartSound) {
          sound.play().catch(() => {});
        }
      }
    }
  });
}

function registerSound(sound, isStartSound = false) {
  if (sound && !allGameSounds.includes(sound)) {
    sound.isStartSound = isStartSound;
    sound.muted = isMuted;
    allGameSounds.push(sound);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  let muteBtn = document.getElementById("mute-btn");
  if (muteBtn) {
    muteBtn.addEventListener("click", toggleMute);
  } else {
  }
});

function togglePause() {
  gamePaused = !gamePaused;
  let pauseScreen = document.getElementById("pause-screen");
  if (gamePaused) {
    isMuted = true;
    muteAllSounds();
    pauseScreen.classList.remove("hidden");
  } else {
    isMuted = false;
    muteAllSounds();
    pauseScreen.classList.add("hidden");
  }
}

function resumeGame() {
  gamePaused = false;
  isMuted = false;
  document.getElementById("pause-screen").classList.add("hidden");
  muteAllSounds(false);
}

function restartGame() {
  location.reload();
}

document.addEventListener("DOMContentLoaded", () => {
  let resumeBtn = document.getElementById("resume-btn");
  let restartBtn = document.getElementById("restart-btn");
  let pauseBtn = document.getElementById("pause-btn");
  if (resumeBtn) {
    resumeBtn.addEventListener("click", resumeGame);
  }
  if (restartBtn) {
    restartBtn.addEventListener("click", restartGame);
  }
  if (pauseBtn) {
    pauseBtn.addEventListener("click", togglePause);
  }
  checkOrientation();
  window.addEventListener("resize", checkOrientation);
  window.addEventListener("orientationchange", checkOrientation);
});

function checkOrientation() {
  const overlay = document.getElementById("orientation-overlay");
  const pauseScreen = document.getElementById("pause-screen");
  if (!overlay || !pauseScreen) return;
  if (isMobile()) {
    if (window.innerHeight > window.innerWidth) {
      overlay.style.display = "flex";
      if (gameStarted && !gamePaused) {
        gamePaused = true;
        isMuted = true;
        muteAllSounds();
        pauseScreen.classList.remove("hidden");
      }
    } else {
      overlay.style.display = "none";
      if (gamePaused && gameStarted) {
        gamePaused = false;
        isMuted = false;
        muteAllSounds();
        pauseScreen.classList.add("hidden");
      }
    }
  } else {
    overlay.style.display = "none";
  }
}

function isMobile() {
  return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}
