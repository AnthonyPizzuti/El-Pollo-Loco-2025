class WinningScreen {
  canvas;
  ctx;
  winImage = new Image();
  winSound = new Audio("audio/winning.mp3");

  constructor(canvasId, imagePath) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext("2d");
    this.winImage.src = imagePath;
  }

  init() {
    this.winImage.onload = () => {
      this.drawBackground();
      this.playWinMusic();
    };
    this.winImage.onerror = () => {};
  }

  drawBackground() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.drawImage(
      this.winImage,
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );
  }

  playWinMusic() {
    this.winSound.loop = false;
    this.winSound.play().catch(() => {});
    this.winSound.volume = 0.5;
  }
}
