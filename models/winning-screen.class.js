/**
 * Represents the winning screen that appears when the player wins the game.
 * This class creates the win overlay, plays the winning sound,
 * and allows the game to be restarted.
 */
class WinningScreen {

  /**
   * Creates a new instance of the winning screen.
   * @param {string} buttonId - The ID of the restart button.
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
      registerSound(this.playWinMusic);
    }
  }

/**
 * Creates the overlay for the winning screen, displays the win image,
 * and shows both a Restart and a Home Screen button side by side.
 */
drawBackground() {
    let winningScreenDiv = document.createElement("div"); winningScreenDiv.id = "winning-screen"; winningScreenDiv.classList.add("overlay"); 
    let winImageElement = document.createElement("img"); winImageElement.src = this.winImage.src;
    let restartButton = document.createElement("button"); restartButton.innerText = "Restart"; restartButton.addEventListener("click", () => { winningScreenDiv.remove(); restartGame();
    });
    let homeButton = document.createElement("button"); homeButton.innerText = "Home Screen"; homeButton.addEventListener("click", () => { winningScreenDiv.remove(); goToHomeScreen();
    });
    let buttonsContainer = document.createElement("div"); buttonsContainer.classList.add("buttons-container"); buttonsContainer.appendChild(restartButton); buttonsContainer.appendChild(homeButton);
    winningScreenDiv.appendChild(winImageElement); winningScreenDiv.appendChild(buttonsContainer);
    let container = document.getElementById("game-container");
    if (container) { container.appendChild(winningScreenDiv);
    } else { document.body.appendChild(winningScreenDiv);
    }
  }

  /**
   * Plays the winning music when the game is won.
   */
  playWinMusic() {
    if (isMuted) return;
    this.winSound.play().catch(() => {});
    this.winSound.volume = 0.2;
  }
}
