class WinningScreen {
    constructor(buttonId) {
      console.log("📢 WinningScreen-Konstruktor wurde aufgerufen!");
  
      this.restartButton = document.getElementById(buttonId);
      if (!this.restartButton) {
        console.error("❌ Fehler: Restart-Button nicht gefunden!");
        return;
      }
  
      this.restartButton.classList.remove("hidden");
      this.restartButton.style.display = "block";
  
      console.log("📂 Lade Bild...");
      this.winImage = new Image();
      this.winImage.src = "img/9_intro_outro_screens/win/win_2.png";
      this.winSound = new Audio("audio/winning.mp3");
  
      this.winImage.onload = () => {
        console.log("🖼️ Bild geladen, rufe drawBackground() auf...");
        this.drawBackground();
        this.playWinMusic();
      };
  
      if (this.winImage.complete) {
        console.log("✅ Bild war schon geladen, rufe drawBackground() direkt auf!");
        this.drawBackground();
        this.playWinMusic();
      }
    }
  
    drawBackground() {
      console.log("🎨 drawBackground() wurde aufgerufen!");
  
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
  
      console.log("🏆 Winning-Screen wurde erstellt!");
    }
  
    playWinMusic() {
      this.winSound.play().catch(() => {});
      this.winSound.volume = 0.5;
    }
  }
  