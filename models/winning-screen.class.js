/**
 * Repräsentiert den Gewinn-Bildschirm, der erscheint, wenn der Spieler das Spiel gewinnt.
 * Diese Klasse erstellt das Gewinn-Overlay, spielt den Gewinn-Sound ab
 * und ermöglicht das Neustarten des Spiels.
 */
class WinningScreen {
  /**
   * Erstellt eine neue Instanz des Gewinn-Bildschirms.
   * @param {string} buttonId - Die ID des Neustart-Buttons.
   */
  constructor(buttonId) {
    this.restartButton = document.getElementById(buttonId);
    if (!this.restartButton) {
      return;
    }
    this.restartButton.classList.remove("hidden");
    this.restartButton.style.display = "block";
    this.winImage = new Image();
    this.winImage.src = "img/9_intro_outro_screens/win/win_2.png";
    this.winSound = new Audio("audio/winning.mp3");
    this.winImage.onload = () => {
      this.drawBackground();
      this.playWinMusic();
    };
    if (this.winImage.complete) {
      this.drawBackground();
      this.playWinMusic();
    }
  }

  /**
   * Erstellt das Overlay für den Gewinn-Bildschirm und zeigt das Gewinnbild an.
   */
  drawBackground() {
    let winningScreenDiv = document.createElement("div");
    winningScreenDiv.id = "winning-screen";
    winningScreenDiv.classList.add("overlay");
    let winImageElement = document.createElement("img");
    winImageElement.src = this.winImage.src;
    let restartButton = document.createElement("button");
    restartButton.innerText = "Neustart";
    restartButton.addEventListener("click", () => location.reload());
    winningScreenDiv.appendChild(winImageElement);
    winningScreenDiv.appendChild(restartButton);
    let container = document.getElementById("game-container");
    if (container) {
      container.appendChild(winningScreenDiv);
    } else {
      document.body.appendChild(winningScreenDiv);
    }
  }

  /**
   * Spielt die Gewinn-Musik ab, wenn das Spiel gewonnen wurde.
   */
  playWinMusic() {
    this.winSound.play().catch(() => {});
    this.winSound.volume = 0.3;
  }
}
