/**
 * @file game.js - Hauptsteuerung für das Spiel, initialisiert das Spielfeld,
 * verwaltet die Steuerung, den Spielstatus, den Sound und die Fullscreen-Optionen.
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

/**
 * Zeigt den Startbildschirm an und startet das Spiel bei Klick auf "Play".
 */
function showStartScreen() {
  new StartScreen(
    "canvas",
    "img/9_intro_outro_screens/start/startscreen_2.png",
    "playButton"
  );
  document.getElementById("playButton").addEventListener("click", () => {
    gameStarted = true;
    document.getElementById("impressum-icon").style.display = "none";
    document.getElementById("playButton").classList.add("hidden");
    document.getElementById("pause-btn").style.display = "block";
    let pauseBtn = document.getElementById("pause-btn");
    pauseBtn.style.display = "block";
    pauseBtn.style.pointerEvents = "auto";
    document.getElementById("instructions-btn").style.display = "none";
    document.getElementById("game-controls").classList.remove("hidden");
    document.getElementById("game-controls").style.display = "flex";
    init();
  });
}

/**
 * Initialisiert das Spiel, erstellt das Spielfeld und setzt Event-Listener für Steuerung.
 */
function init() {
  if (!world) {
    initLevel();
    canvas = document.getElementById("canvas");
    world = new World(canvas, keyboard);
    world.setLevel(level1);
    if (startMusic) {
      startMusic.pause();
      startMusic.currentTime = 0;
    }
    backgroundMusic.loop = true;
    backgroundMusic.volume = 0.05;
    if (!isMuted) backgroundMusic.play();
  }

  /**
   * Fügt Event-Listener für die Touch-Steuerung hinzu.
   */
  document.getElementById("left-btn").addEventListener("touchstart", (event) => { event.preventDefault(); keyboard.LEFT = true;
    });
  document.getElementById("left-btn").addEventListener("touchend", () => { keyboard.LEFT = false;
  });
  document.getElementById("right-btn").addEventListener("touchstart", (event) => { event.preventDefault(); keyboard.RIGHT = true;
    });
  document.getElementById("right-btn").addEventListener("touchend", () => { keyboard.RIGHT = false;
  });
  document.getElementById("jump-btn").addEventListener("touchstart", (event) => { event.preventDefault(); keyboard.SPACE = true;
    });
  document.getElementById("jump-btn").addEventListener("touchend", () => { keyboard.SPACE = false;
  });
  document.getElementById("throw-btn").addEventListener("touchstart", (event) => { event.preventDefault(); keyboard.D = true;
    });
  document.getElementById("throw-btn").addEventListener("touchend", () => { keyboard.D = false;
  });
}

/**
 * Behandelt Tastendruck-Ereignisse.
 * @param {KeyboardEvent} e - Das Keydown-Event.
 */
document.addEventListener("keydown", (e) => {
  if (!gameStarted) return;
  if (e.keyCode == 39) { keyboard.RIGHT = true;
  }
  if (e.keyCode == 37) { keyboard.LEFT = true;
  }
  if (e.keyCode == 38) { keyboard.UP = true;
  }
  if (e.keyCode == 40) { keyboard.DOWN = true;
  }
  if (e.keyCode == 32) { keyboard.SPACE = true;
  }
  if (e.keyCode == 68) { keyboard.D = true;
  }
  if (e.keyCode == 80) { togglePause();
  }
});

/**
 * Behandelt das Loslassen einer Taste.
 * @param {KeyboardEvent} e - Das Keyup-Event.
 */
document.addEventListener("keyup", (e) => {
  if (e.keyCode == 39) { keyboard.RIGHT = false;
  }
  if (e.keyCode == 37) { keyboard.LEFT = false;
  }
  if (e.keyCode == 38) { keyboard.UP = false;
  }
  if (e.keyCode == 40) { keyboard.DOWN = false;
  }
  if (e.keyCode == 32) { keyboard.SPACE = false;
  }
  if (e.keyCode == 68) { keyboard.D = false;
    world.character.canThrow = true;
  }
});

/**
 * Startet die Hintergrundmusik, wenn das Spiel beginnt.
 */
function playBackgroundMusic() {
  if (!isMuted && gameStarted) {
    backgroundMusic.play().catch();
  }
}

/**
 * Stellt sicher, dass die Musik stummgeschaltet wird, wenn das Spiel auf "Mute" ist.
 */
function updateBackgroundMusic() {
  backgroundMusic.muted = isMuted;
  if (!isMuted) { backgroundMusic.play();
  } else { backgroundMusic.pause();
  }
}

/**
 * Registriere den Hintergrundsound, damit er von der Mute-Funktion berücksichtigt wird.
 */
registerSound(backgroundMusic, true);

/**
 * Schließt das Impressum und kehrt zum Spiel zurück.
 */
document.addEventListener("DOMContentLoaded", () => {
    let impressumLink = document.getElementById("impressum-icon");
    if (impressumLink) { impressumLink.addEventListener("click", function (event) { event.preventDefault(); window.open("impressum.html", "_blank");
        });
    }
});

/**
 * Stoppt alle gesetzten Intervalle und beendet das Zeichnen der Welt.
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
 * Startet alle notwendigen Intervalle neu.
 */
function restartIntervals() {
  if (!world) return;
  world.draw();
  world.setWorld();
  world.run();
}

/**
 * Zeigt den Gewinnbildschirm an.
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
 * Zeigt den Game-Over-Bildschirm an und stoppt das Zeichnen.
 */
function gameOver() {
  world.stopDrawing();
  showGameOverScreen();
}

/**
 * Zeigt den Game-Over-Bildschirm an.
 */
function showGameOverScreen() {
  let gameOverScreen = new GameOverScreen("restartButton");
  setTimeout(() => {}, 1000);
}

/**
 * Schaltet zwischen Vollbild- und Fenstermodus.
 */
function toggleFullscreen() {
  let container = document.getElementById("game-container");
  if (!document.fullscreenElement) { container.requestFullscreen?.();
  } else { document.exitFullscreen?.();
  }
}

/**
 * Aktiviert den Vollbildmodus für das angegebene HTML-Element.
 * Unterstützt verschiedene Browser-spezifische Methoden für Fullscreen.
 *
 * @param {HTMLElement} element - Das HTML-Element, das in den Vollbildmodus gesetzt werden soll.
 */
function enterFullscreen(element) {
  if (element.requestFullscreen) { element.requestFullscreen();
  } else if (element.msRequestFullscreen) { element.msRequestFullscreen();
  } else if (element.webkitRequestFullscreen) { element.webkitRequestFullscreen();
  }
}

/**
 * Beendet den Vollbildmodus, falls dieser aktiv ist.
 * Unterstützt verschiedene Browser-spezifische Methoden zum Verlassen des Fullscreen-Modus.
 */
function exitFullscreen() {
  if (document.exitFullscreen) { document.exitFullscreen();
  } else if (document.webkitExitFullscreen) { document.webkitExitFullscreen();
  }
}

/**
 * Wartet darauf, dass das DOM vollständig geladen ist,
 * und fügt dann einen Event-Listener zum Fullscreen-Button hinzu.
 */
document.addEventListener("DOMContentLoaded", () => {
  let fullscreenBtn = document.getElementById("fullscreen-btn");
  if (fullscreenBtn) { fullscreenBtn.addEventListener("click", toggleFullscreen);
  }
});

/**
 * Schaltet zwischen Stummschaltung und Ton an/aus.
 */
function toggleMute() {
  isMuted = !isMuted;
  document.getElementById("mute-btn").querySelector("img").src = isMuted ? "./img/controll/mute.png" : "./img/controll/ton.png";
  muteAllSounds();
  if (!gameStarted && startMusic) { startMusic.muted = isMuted;
    if (!isMuted && startMusic.paused)
      (startMusic.volume = 0.5), startMusic.play();
  } else { startMusic?.pause(), (startMusic.currentTime = 0);
    if (backgroundMusic) { backgroundMusic.muted = isMuted;
      if (!isMuted && backgroundMusic.paused)
        (backgroundMusic.volume = 0.05), backgroundMusic.play();
    }
  }
}

/**
 * Stellt sicher, dass alle Sounds auf die Mute-Einstellung angepasst sind.
 */
function muteAllSounds() {
  allGameSounds.forEach((sound) => {
    if (sound) {
      if (isMuted) { sound.muted = true;
        sound.pause();
      } else { sound.muted = false;
        if (sound.loop && !sound.isStartSound) { sound.play().catch(() => {});
        }
      }
    }
  });
}

/**
 * Registriert einen Sound und fügt ihn zur globalen Sound-Liste hinzu,
 * falls er nicht bereits enthalten ist. Zusätzlich wird der Mute-Status übernommen.
 *
 * @param {HTMLAudioElement} sound - Das Sound-Objekt, das registriert werden soll.
 * @param {boolean} [isStartSound=false] - Gibt an, ob der Sound ein Start-Sound ist.
 */
function registerSound(sound, isStartSound = false) {
  if (sound && !allGameSounds.includes(sound)) {
    sound.isStartSound = isStartSound;
    sound.muted = isMuted;
    allGameSounds.push(sound);
  }
}

/**
 * Wartet darauf, dass das DOM vollständig geladen ist,
 * und fügt dann einen Event-Listener zum Mute-Button hinzu.
 */
document.addEventListener("DOMContentLoaded", () => {
  let muteBtn = document.getElementById("mute-btn");
  if (muteBtn) { muteBtn.addEventListener("click", toggleMute);
  }
});

/**
 * Startet oder beendet das Spiel pausieren.
 */
function togglePause() {
  gamePaused = !gamePaused;
  let pauseScreen = document.getElementById("pause-screen");
  let muteBtn = document.getElementById("mute-btn");
  if (gamePaused) { previousMuteState = isMuted; isMuted = true; muteAllSounds(); pauseScreen.classList.remove("hidden"); world.stopAllMovement(); muteBtn.style.pointerEvents = "none"; muteBtn.style.opacity = "0.5";
  } else { pauseScreen.classList.add("hidden"); world.resumeAllMovement(); isMuted = previousMuteState; muteAllSounds(); updateBackgroundMusic(); muteBtn.style.pointerEvents = "auto"; muteBtn.style.opacity = "1";
  }
}

/**
 * Setzt das Spiel nach einer Pause fort, indem es den Pausenbildschirm ausblendet,
 * den Mute-Status wiederherstellt und die Spielbewegungen fortsetzt.
 */
function resumeGame() {
  gamePaused = false;
  document.getElementById("pause-screen").classList.add("hidden");
  isMuted = previousMuteState;
  muteAllSounds();
  world.resumeAllMovement();
  updateBackgroundMusic();
  let muteBtn = document.getElementById("mute-btn");
  muteBtn.style.pointerEvents = "auto"; muteBtn.style.opacity = "1";
}

/**
 * Startet das Spiel neu.
 */
function restartGame() {
  world.stopDrawing();
  world = new World(canvas, keyboard);
  world.setLevel(level1);
  location.reload();
}

/**
 * Wartet darauf, dass das DOM vollständig geladen ist,
 * und fügt Event-Listener zu den Steuerungs-Buttons (Resume, Restart, Pause) hinzu.
 * Außerdem überprüft es die Bildschirmorientierung und reagiert auf Änderungen.
 */
document.addEventListener("DOMContentLoaded", () => {
  const instructionsBtn = document.getElementById("instructions-btn");
  const instructionsModal = document.getElementById("instructions-modal");
  const closeModalBtn = document.getElementById("close-modal");
  if (instructionsBtn && instructionsModal) { instructionsBtn.addEventListener("click", () => { instructionsModal.classList.remove("hidden");
    });
  } if (closeModalBtn && instructionsModal) { closeModalBtn.addEventListener("click", () => { instructionsModal.classList.add("hidden");
    });
  }
  let resumeBtn = document.getElementById("resume-btn");
  let restartBtn = document.getElementById("restart-btn");
  let pauseBtn = document.getElementById("pause-btn");
  if (resumeBtn) { resumeBtn.addEventListener("click", resumeGame);
  } if (restartBtn) { restartBtn.addEventListener("click", restartGame);
  } if (pauseBtn) { pauseBtn.addEventListener("click", togglePause);
  }
  let closeImpressumBtn = document.getElementById("close-impressum-btn");
  if (closeImpressumBtn) { closeImpressumBtn.addEventListener("click", closeImpressum);
  }
  checkOrientation();
  window.addEventListener("resize", checkOrientation);
  window.addEventListener("orientationchange", checkOrientation);
});

/**
 * Überprüft, ob das aktuelle Gerät ein mobiles Gerät ist.
 *
 * @returns {boolean} `true`, wenn das Gerät ein mobiles Gerät ist, sonst `false`.
 */
function isMobile() { return (/Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || (navigator.userAgent.includes("Macintosh") && navigator.maxTouchPoints && navigator.maxTouchPoints > 1));
}

/**
 * Überprüft die Geräteausrichtung und pausiert das Spiel ggf.
 */
function checkOrientation() {
    const overlay = document.getElementById("orientation-overlay");
    const pauseScreen = document.getElementById("pause-screen");
    if (!overlay || !pauseScreen) return;
    if (isMobile()) { if (window.innerHeight > window.innerWidth) { overlay.classList.remove("hidden");
        if (gameStarted && !gamePaused) { gamePaused = true; localStorage.setItem("previousMuteState", isMuted); isMuted = true; muteAllSounds(); pauseScreen.classList.remove("hidden");
        }
      } else { overlay.classList.add("hidden");
        if (gamePaused && gameStarted) { gamePaused = false; isMuted = localStorage.getItem("previousMuteState") === "true"; muteAllSounds(); pauseScreen.classList.add("hidden");
        }
      }
    } else { overlay.classList.add("hidden");
    }
  }
  
