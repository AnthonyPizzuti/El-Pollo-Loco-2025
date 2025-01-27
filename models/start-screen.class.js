class StartScreen {
  canvas;
  ctx;
  startImage = new Image();
  playButton;
  musicSound = new Audio("audio/music.mp3");

  constructor(canvasId, imagePath, buttonId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext("2d");
    this.startImage.src = imagePath;
    this.playButton = document.getElementById(buttonId);
    this.init();
  }

  init() {
    this.startImage.onload = () => {
      this.drawBackground();
      this.playMusic();
    };
    this.startImage.onerror = () => {};
    this.playButton.addEventListener("click", () => this.startGame());
  }

  drawBackground() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.drawImage(
      this.startImage,
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );
  }

  playMusic() {
    this.musicSound.loop = true;
    this.musicSound.play().catch(() => {});
    this.musicSound.volume = 0.5;
  }

  stopMusic() {
    this.musicSound.pause();
    this.musicSound.currentTime = 0;
  }

  startGame() {
    this.stopMusic();
    this.playButton.style.display = "none";
    init();
  }
}
