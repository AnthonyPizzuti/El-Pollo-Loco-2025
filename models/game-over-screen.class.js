/**
 * Repräsentiert den Game-Over-Bildschirm des Spiels.
 * Diese Klasse erzeugt ein Game-Over-Overlay und spielt die entsprechende Musik ab.
 */
class GameOverScreen {
  /**
   * Erstellt eine neue Instanz des Game-Over-Screens.
   * @param {string} buttonId - Die ID des Neustart-Buttons.
   */
  constructor(buttonId) {
    this.restartButton = document.getElementById(buttonId);
    if (!this.restartButton) {
      return;
    }
    this.restartButton.classList.remove("hidden");
    this.restartButton.style.display = "block";
    this.gameOverImage = new Image();
    this.gameOverImage.src =
      "img/9_intro_outro_screens/game_over/game_over.png";
    this.gameOverSound = new Audio("audio/gameover.mp3");
    this.gameOverImage.onload = () => {
      this.drawBackground();
      this.playGameOverMusic();
    };
    if (this.gameOverImage.complete) {
      this.drawBackground();
      this.playGameOverMusic();
    }
  }

  /**
   * Erstellt den Game-Over-Hintergrund und fügt ihn zum Dokument hinzu.
   */
  drawBackground() {
    let gameOverScreenDiv = document.createElement("div");
    gameOverScreenDiv.id = "game-over-screen";
    gameOverScreenDiv.classList.add("overlay");
    let gameOverImageElement = document.createElement("img");
    gameOverImageElement.src = this.gameOverImage.src;
    let restartButton = document.createElement("button");
    restartButton.innerText = "Neustart";
    restartButton.addEventListener("click", () => { gameOverScreenDiv.remove(); restartGame(); });
    gameOverScreenDiv.appendChild(gameOverImageElement);
    gameOverScreenDiv.appendChild(restartButton);
    let container = document.getElementById("game-container");
    if (container) { container.appendChild(gameOverScreenDiv); } else { document.body.appendChild(gameOverScreenDiv); }
  }
  

  /**
   * Spielt die Game-Over-Musik ab, falls das Spiel nicht gemutet ist.
   */
  playGameOverMusic() {
    if (!isMuted) {
      this.gameOverSound.volume = 0.3;
      this.gameOverSound.play().catch(() => {});
    }
  }
}
