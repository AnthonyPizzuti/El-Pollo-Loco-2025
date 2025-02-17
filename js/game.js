/**
 * @file game.js - Main controller for the game, initializes the playing field,
 * manages controls, game state, sound, and fullscreen options.
 */
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
let backgroundMusic = new Audio("audio/backgroud-music.mp3");
let startMusic = new Audio("audio/startmusic.mp3");
let previousMuteState = false;
let gameControlsTemplate = null;


/**
 * Displays the start screen and sets up the Play button.
 */
function showStartScreen() {
    new StartScreen("canvas", "img/9_intro_outro_screens/start/startscreen_2.png", "playButton");
    let playButton = document.getElementById("playButton");
    if (playButton) { playButton.classList.remove("hidden"); playButton.style.display = "block"; playButton.addEventListener("click", startGame);
      }
      let impressumIcon = document.getElementById('impressum-icon'); if (impressumIcon) { impressumIcon.style.display = "block";
      }
      let instructionsBtn = document.getElementById('instructions-btn'); if (instructionsBtn) { instructionsBtn.style.display = "block";
      }
      let pauseBtn = document.getElementById('pause-btn'); if (pauseBtn) { pauseBtn.style.display = "none";
      }
      let gameControls = document.getElementById('game-controls'); if (gameControls) { gameControls.classList.add("hidden"); gameControls.style.display = "none";
      }
      showReadMeOverlay();
    }

/**
 * Starts the game.
 */
  function startGame() {
    gameStarted = true;
    let playButton = document.getElementById("playButton");
    if (playButton) { playButton.classList.add("hidden");}
    document.getElementById("impressum-icon").style.display = "none";
    let pauseBtn = document.getElementById("pause-btn");
    pauseBtn.style.display = "block";
    pauseBtn.style.pointerEvents = "auto";
    document.getElementById("instructions-btn").style.display = "none";
    const gameControls = document.getElementById("game-controls");
    if (gameControls) { gameControls.classList.remove("hidden");gameControls.style.display = "flex";} 
    init();
  }

/**
 * Initializes the game, creates the playing field and sets control event listeners.
 */
function init() {
  if (!world) {
    initLevel();
    canvas = document.getElementById("canvas");
    world = new World(canvas, keyboard);
    world.setLevel(level1);
    addTouchControls();
    addKeydownControls();
    addKeyupControls();
    if (startMusic) { startMusic.pause(); startMusic.currentTime = 0;
    }
    backgroundMusic.loop = true; backgroundMusic.volume = 0.05;
    if (!isMuted) backgroundMusic.play();
  }
}

/**
 * Sets up all touch controls for the buttons.
 */
function addTouchControls() {
    const leftBtn = document.getElementById("left-btn");
    const rightBtn = document.getElementById("right-btn");
    const jumpBtn = document.getElementById("jump-btn");
    const throwBtn = document.getElementById("throw-btn");
    leftBtn?.addEventListener("touchstart", e => { e.preventDefault(); keyboard.LEFT = true; });
    leftBtn?.addEventListener("touchend", () => { keyboard.LEFT = false; });
    rightBtn?.addEventListener("touchstart", e => { e.preventDefault(); keyboard.RIGHT = true; });
    rightBtn?.addEventListener("touchend", () => { keyboard.RIGHT = false; });
    jumpBtn?.addEventListener("touchstart", e => { e.preventDefault(); keyboard.SPACE = true; });
    jumpBtn?.addEventListener("touchend", () => { keyboard.SPACE = false; });
    throwBtn?.addEventListener("touchstart", e => { e.preventDefault(); keyboard.D = true; });
    throwBtn?.addEventListener("touchend", () => { keyboard.D = false; });
    }
  
/** 
 * Adds keydown events for game controls.
 */
function addKeydownControls() {
    document.addEventListener("keydown", e => {
      if (!gameStarted) return;
      if (e.keyCode == 39) keyboard.RIGHT = true;
      if (e.keyCode == 37) keyboard.LEFT = true;
      if (e.keyCode == 38) keyboard.UP = true;
      if (e.keyCode == 40) keyboard.DOWN = true;
      if (e.keyCode == 32) keyboard.SPACE = true;
      if (e.keyCode == 68) keyboard.D = true;
      if (e.keyCode == 80) togglePause();
    });
  }

/** 
 * Adds keyup events for game controls.
 */
function addKeyupControls() {
    document.addEventListener("keyup", e => {
      if (e.keyCode == 39) keyboard.RIGHT = false;
      if (e.keyCode == 37) keyboard.LEFT = false;
      if (e.keyCode == 38) keyboard.UP = false;
      if (e.keyCode == 40) keyboard.DOWN = false;
      if (e.keyCode == 32) keyboard.SPACE = false;
      if (e.keyCode == 68) { keyboard.D = false;
        world.character.canThrow = true;
      }
    });
  }

/**
 * Starts the background music when the game begins.
 */
function playBackgroundMusic() {
  if (!isMuted && gameStarted) {
    backgroundMusic.play().catch();
  }
}

/**
 * Ensures that the music is muted when the game is set to "Mute".
 */
function updateBackgroundMusic() {
  backgroundMusic.muted = isMuted;
  if (!isMuted) { backgroundMusic.play();
  } else { backgroundMusic.pause();
  }
}

/**
 * Closes the impressum and returns to the game.
 */
document.addEventListener("DOMContentLoaded", () => {
    let impressumLink = document.getElementById("impressum-icon");
    if (impressumLink) { impressumLink.addEventListener("click", function (event) { event.preventDefault(); window.open("impressum.html", "_blank");
        });
    }
});

/**
 * Stops all intervals and terminates the world's rendering.
 */
function stopAllIntervals() {
  intervalIds.forEach(clearInterval);
  intervalIds = [];
  if (world && world.animationFrame) {
    cancelAnimationFrame(world.animationFrame);
    world.animationFrame = null;
  }
}

/**
 * Restarts all necessary intervals.
 */
function restartIntervals() {
  if (!world) return;
  world.draw();
  world.setWorld();
  world.run();
}

/**
 * Displays the winning screen.
 */
function showWinningScreen() {
  if (world && world.endboss_sound) {
    world.endboss_sound.pause();
    world.endboss_sound.currentTime = 0;
  }
  let winningScreen = new WinningScreen("restartButton");
  setTimeout(() => {}, 1000);
}

/**
 * Displays the game-over screen and stops the rendering.
 */
function gameOver() {
  world.stopDrawing();
  showGameOverScreen();
}

/**
 * Displays the game-over screen.
 */
function showGameOverScreen() {
  stopAllIntervals();
  stopAllSounds();
  muteAllSounds();
  let gameOverScreen = new GameOverScreen("restartButton");
  setTimeout(() => {}, 1000);
}

/**
 * Toggles between fullscreen and windowed mode.
 */
function toggleFullscreen() { let container = document.getElementById("game-container");
  if (!document.fullscreenElement) { container.requestFullscreen?.();
  } else { document.exitFullscreen?.();
  }
}

/**
 * Enables fullscreen mode for the specified HTML element.
 * Supports various browser-specific methods for fullscreen.
 *
 * @param {HTMLElement} element - The HTML element to be set to fullscreen.
 */
function enterFullscreen(element) { if (element.requestFullscreen) { element.requestFullscreen();
  } else if (element.msRequestFullscreen) { element.msRequestFullscreen();
  } else if (element.webkitRequestFullscreen) { element.webkitRequestFullscreen();
  }
}

/**
 * Exits fullscreen mode if it is active.
 */
function exitFullscreen() { if (document.exitFullscreen) { document.exitFullscreen();
  } else if (document.webkitExitFullscreen) { document.webkitExitFullscreen();
  }
}

/**
 * Waits until the DOM is fully loaded, then adds an event listener to the fullscreen button.
 */
document.addEventListener("DOMContentLoaded", () => {
  let fullscreenBtn = document.getElementById("fullscreen-btn");
  if (fullscreenBtn) { fullscreenBtn.addEventListener("click", toggleFullscreen);
  }
});

/**
 * Toggles between muting and unmuting sound.
 */
function toggleMute() {
  isMuted = !isMuted;
  document.getElementById("mute-btn").querySelector("img").src = isMuted ? "./img/controll/mute.png" : "./img/controll/ton.png";
  muteAllSounds();
  if (!gameStarted && startMusic) { startMusic.muted = isMuted; if (!isMuted && startMusic.paused) (startMusic.volume = 0.5), startMusic.play();
  } else { startMusic?.pause(), (startMusic.currentTime = 0); if (backgroundMusic) { backgroundMusic.muted = isMuted;
      if (!isMuted && backgroundMusic.paused)
         (backgroundMusic.volume = 0.05), backgroundMusic.play();
    }
  }
  registerSound(backgroundMusic, true);
}

/**
 * Ensures that all sounds are adjusted according to the mute setting.
 */
function muteAllSounds() { allGameSounds.forEach((sound) => { if (sound) { if (isMuted) { sound.muted = true; sound.pause();
      } else { sound.muted = false; if (sound.loop && !sound.isStartSound) { sound.play().catch(() => {});
        }}}
  });
}

/**
 * Stop all Sounds.
 */
function stopAllSounds() { allGameSounds.forEach(sound => { if (sound) { sound.pause(); sound.currentTime = 0;
      }
    });
  }

/**
 * Registers a sound and adds it to the global sound list if not already present.
 * Additionally, the mute status is applied.
 *
 * @param {HTMLAudioElement} sound - The sound object to be registered.
 * @param {boolean} [isStartSound=false] - Indicates if the sound is a start sound.
 */
function registerSound(sound, isStartSound = false) { if (sound && !allGameSounds.includes(sound)) { sound.isStartSound = isStartSound; sound.muted = isMuted; allGameSounds.push(sound);
  }
}

/**
 * Waits until the DOM is fully loaded, then adds an event listener to the mute button.
 */
document.addEventListener("DOMContentLoaded", () => {
  let muteBtn = document.getElementById("mute-btn");
  if (muteBtn) { muteBtn.addEventListener("click", toggleMute);
  }
});

/**
 * Starts or stops pausing the game.
 */
function togglePause() { gamePaused = !gamePaused;
  let pauseScreen = document.getElementById("pause-screen");
  let muteBtn = document.getElementById("mute-btn");
  if (gamePaused) { previousMuteState = isMuted; isMuted = true; muteAllSounds(); pauseScreen.classList.remove("hidden"); world.stopAllMovement(); muteBtn.style.pointerEvents = "none"; muteBtn.style.opacity = "0.5";
  } else { pauseScreen.classList.add("hidden"); world.resumeAllMovement(); isMuted = previousMuteState; muteAllSounds(); updateBackgroundMusic(); muteBtn.style.pointerEvents = "auto"; muteBtn.style.opacity = "1";
  }
}

/**
 * Resumes the game after a pause by hiding the pause screen,
 * restoring the mute status, and resuming game movements.
 */
function resumeGame() { gamePaused = false; document.getElementById("pause-screen").classList.add("hidden"); isMuted = previousMuteState; muteAllSounds(); world.resumeAllMovement(); updateBackgroundMusic();
  let muteBtn = document.getElementById("mute-btn"); muteBtn.style.pointerEvents = "auto"; muteBtn.style.opacity = "1";
}

/**
 * Restarts the game.
 */
function restartGame() {
    stopAllIntervals(); stopAllSounds(); if (world) world.stopDrawing();
    world = null; gameStarted = winScreenDisplayed = gameOverDisplayed = gamePaused = false;
    document.getElementById('pause-screen')?.classList.add('hidden');
    document.getElementById('canvas')?.remove();
    const container = document.getElementById('game-container');
    if (container) { const newCanvas = document.createElement('canvas'); newCanvas.id = 'canvas'; newCanvas.width = 720; newCanvas.height = 480; container.appendChild(newCanvas);
    if (!document.getElementById('game-controls') && gameControlsTemplate) { container.appendChild(gameControlsTemplate.cloneNode(true)); addTouchControls(); addKeydownControls(); addKeyupControls(); }
    } allGameSounds = allGameSounds.filter(sound => !(sound.src && sound.src.includes("endboss.mp3")));
    startGame(); isMuted = previousMuteState; muteAllSounds(); if (!isMuted) { backgroundMusic.play(); } let muteBtn = document.getElementById("mute-btn"); muteBtn.style.pointerEvents = "auto"; muteBtn.style.opacity = "1";
  }

  /**
 * Resets the game state and shows the start screen.
 */
  function goToHomeScreen() {
    stopAllIntervals(); stopAllSounds(); if (world) world.stopDrawing();
    world = null; gameStarted = winScreenDisplayed = gameOverDisplayed = gamePaused = false;
    document.getElementById('pause-screen')?.classList.add('hidden');
    document.getElementById('canvas')?.remove();
    const container = document.getElementById('game-container');
    if (container) { const newCanvas = document.createElement('canvas'); newCanvas.id = 'canvas'; newCanvas.width = 720; newCanvas.height = 480; container.appendChild(newCanvas);
    if (!document.getElementById('game-controls') && gameControlsTemplate) { container.appendChild(gameControlsTemplate.cloneNode(true)); addTouchControls(); addKeydownControls(); addKeyupControls(); }
    } allGameSounds = allGameSounds.filter(sound => !(sound.src && sound.src.includes("endboss.mp3")));
    showStartScreen(); isMuted = previousMuteState; muteAllSounds(); let muteBtn = document.getElementById("mute-btn"); muteBtn.style.pointerEvents = "auto"; muteBtn.style.opacity = "1";
  }
  
/**
 * Waits until the DOM is fully loaded, then adds event listeners to the control buttons (Resume, Restart, Pause)
 * and checks for orientation changes.
 */
document.addEventListener("DOMContentLoaded", () => {
    const instructionsBtn = document.getElementById("instructions-btn"), instructionsModal = document.getElementById("instructions-modal"), closeModalBtn = document.getElementById("close-modal");
    if (instructionsBtn && instructionsModal) instructionsBtn.addEventListener("click", () => instructionsModal.classList.remove("hidden"));
    if (closeModalBtn && instructionsModal) closeModalBtn.addEventListener("click", () => instructionsModal.classList.add("hidden"));
    let resumeBtn = document.getElementById("resume-btn"), restartBtn = document.getElementById("restart-btn"), pauseBtn = document.getElementById("pause-btn"), homeBtn = document.getElementById("home-btn");
    if (resumeBtn) resumeBtn.addEventListener("click", resumeGame); if (restartBtn) restartBtn.addEventListener("click", restartGame); if (pauseBtn) pauseBtn.addEventListener("click", togglePause); if (homeBtn) homeBtn.addEventListener("click", goToHomeScreen);
    let closeImpressumBtn = document.getElementById("close-impressum-btn"); if (closeImpressumBtn) closeImpressumBtn.addEventListener("click", closeImpressum);
    const gc = document.getElementById("game-controls"); if (gc) gameControlsTemplate = gc.cloneNode(true);
    checkOrientation(); window.addEventListener("resize", checkOrientation); window.addEventListener("orientationchange", checkOrientation);
  });
  
/**
 * Checks if the current device is a mobile device.
 * @returns {boolean} `true` if the device is mobile, otherwise `false`.
 */
function isMobile() { return (/Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || (navigator.userAgent.includes("Macintosh") && navigator.maxTouchPoints && navigator.maxTouchPoints > 1));
}

/**
 * Checks the device orientation and pauses the game if necessary.
 */
function checkOrientation() {
    const overlay = document.getElementById("orientation-overlay");
    const pauseScreen = document.getElementById("pause-screen");
    if (!overlay || !pauseScreen) return; if (isMobile()) { if (window.innerHeight > window.innerWidth) { overlay.classList.remove("hidden"); if (gameStarted && !gamePaused) { gamePaused = true; localStorage.setItem("previousMuteState", isMuted); isMuted = true; muteAllSounds(); pauseScreen.classList.remove("hidden");
        }} else { overlay.classList.add("hidden"); if (gamePaused && gameStarted) { gamePaused = false; isMuted = localStorage.getItem("previousMuteState") === "true"; muteAllSounds(); pauseScreen.classList.add("hidden");
        }}} else { overlay.classList.add("hidden");
    }}
  
  /**
 * Displays the "Read Me First" overlay on the start screen.
 * Disables the Play button until the user closes the overlay.
 * The overlay element (with id "read-me-overlay") is shown,
 * the Play button is disabled and given a "disabled" class.
 * When the close button (with id "close-readme") is clicked,
 * the overlay is hidden and the Play button is re-enabled.
 */
  function showReadMeOverlay() {
    const overlay = document.getElementById("read-me-overlay");
    const closeBtn = document.getElementById("close-readme");
    const playButton = document.getElementById("playButton");
    if (!overlay || !closeBtn || !playButton) return; overlay.classList.remove("hidden"); playButton.disabled = true; playButton.classList.add("disabled"); closeBtn.addEventListener("click", () => { overlay.classList.add("hidden"); playButton.disabled = false; playButton.classList.remove("disabled");
    });
  }
  
  
  
