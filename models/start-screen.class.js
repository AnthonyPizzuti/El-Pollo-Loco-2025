/**
 * Represents the start screen of the game.
 * Loads the background image, plays the start music, and starts the game on click.
 */
class StartScreen {
  canvas;
  ctx;
  startImage = new Image();
  playButton;
  startSound = new Audio("audio/startmusic.mp3");

  /**
   * Creates a new instance of the start screen.
   * @param {string} canvasId - The ID of the canvas element.
   * @param {string} imagePath - The path to the background image.
   * @param {string} buttonId - The ID of the start button.
   */
  constructor(canvasId, imagePath, buttonId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext("2d");
    this.startImage.src = imagePath;
    this.playButton = document.getElementById(buttonId);
    this.init();
    registerSound(this.startSound, true);
  }

  /**
   * Initializes the start screen.
   * Loads the background image and plays the music.
   */
  init() {
    this.startImage.onload = () => {
      this.drawBackground();
      this.playMusic();
    };
    this.startImage.onerror = () => {};
    this.playButton.addEventListener("click", () => this.startGame());
  }

  /**
   * Draws the background image on the canvas.
   */
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

  /**
   * Plays the start music in a loop.
   */
  playMusic() {
    this.startSound.loop = true;
    this.startSound.play().catch(() => {});
    this.startSound.volume = 0.5;
  }

  /**
   * Stops the start music and resets it.
   */
  stopMusic() {
    this.startSound.pause();
    this.startSound.currentTime = 0;
  }

  /**
   * Starts the game, hides the start button, and calls `init()`.
   */
  startGame() {
    this.stopMusic();
    this.playButton.style.display = "none";
    init();
  }
}
