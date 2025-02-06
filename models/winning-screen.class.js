class WinningScreen {
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
  
    drawBackground() {
      let winningScreenDiv = document.createElement("div");
      winningScreenDiv.id = "winning-screen";
      let winImageElement = document.createElement("img");
      winImageElement.src = this.winImage.src;
      let restartButton = document.createElement("button");
      restartButton.innerText = "Neustart";
      restartButton.addEventListener("click", () => location.reload());
      winningScreenDiv.appendChild(winImageElement);
      winningScreenDiv.appendChild(restartButton);
      document.body.appendChild(winningScreenDiv);
    }
  
    playWinMusic() {
      this.winSound.play().catch(() => {});
      this.winSound.volume = 0.5;
    }
  }
  