class GameOverScreen {
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

  drawBackground() {
    let gameOverScreenDiv = document.createElement("div");
    gameOverScreenDiv.id = "game-over-screen";
    gameOverScreenDiv.classList.add("overlay");
    let gameOverImageElement = document.createElement("img");
    gameOverImageElement.src = this.gameOverImage.src;
    let restartButton = document.createElement("button");
    restartButton.innerText = "Neustart";
    restartButton.addEventListener("click", () => location.reload());
    gameOverScreenDiv.appendChild(gameOverImageElement);
    gameOverScreenDiv.appendChild(restartButton);
    let container = document.getElementById("game-container");
    if (container) {
      container.appendChild(gameOverScreenDiv);
    } else {
      document.body.appendChild(gameOverScreenDiv);
    }
  }

  playGameOverMusic() {
    if (!isMuted) {
      this.gameOverSound.volume = 0.5;
      this.gameOverSound.play().catch(() => {});
    }
  }
}
