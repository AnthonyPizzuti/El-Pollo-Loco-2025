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
    winningScreenDiv.style.position = "fixed";
    winningScreenDiv.style.top = "0";
    winningScreenDiv.style.left = "0";
    winningScreenDiv.style.width = "100vw";
    winningScreenDiv.style.height = "100vh";
    winningScreenDiv.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
    winningScreenDiv.style.display = "flex";
    winningScreenDiv.style.flexDirection = "column";
    winningScreenDiv.style.justifyContent = "center";
    winningScreenDiv.style.alignItems = "center";
    winningScreenDiv.style.zIndex = "9999";

    let winImageElement = document.createElement("img");
    winImageElement.src = this.winImage.src;
    winImageElement.style.maxWidth = "90vw";
    winImageElement.style.maxHeight = "90vh";

    let restartButton = document.createElement("button");
    restartButton.innerText = "Neustart";
    restartButton.style.padding = "10px 20px";
    restartButton.style.fontSize = "18px";
    restartButton.style.color = "white";
    restartButton.style.backgroundColor = "#28a745";
    restartButton.style.border = "none";
    restartButton.style.borderRadius = "8px";
    restartButton.style.cursor = "pointer";
    restartButton.style.marginTop = "20px";
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
