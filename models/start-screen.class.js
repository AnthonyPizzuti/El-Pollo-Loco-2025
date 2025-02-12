/**
 * Repräsentiert den Startbildschirm des Spiels.
 * Lädt das Hintergrundbild, spielt die Startmusik ab und startet das Spiel bei Klick.
 */
class StartScreen {
  canvas;
  ctx;
  startImage = new Image();
  playButton;
  startSound = new Audio("audio/startmusic.mp3");

  /**
   * Erstellt eine neue Instanz des Startbildschirms.
   * @param {string} canvasId - Die ID des Canvas-Elements.
   * @param {string} imagePath - Der Pfad zum Hintergrundbild.
   * @param {string} buttonId - Die ID des Start-Buttons.
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
   * Initialisiert den Startbildschirm.
   * Lädt das Hintergrundbild und spielt Musik ab.
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
   * Zeichnet das Hintergrundbild auf das Canvas.
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
   * Spielt die Startmusik in einer Dauerschleife ab.
   */
  playMusic() {
    this.startSound.loop = true;
    this.startSound.play().catch(() => {});
    this.startSound.volume = 0.5;
  }

  /**
   * Stoppt die Startmusik und setzt sie zurück.
   */
  stopMusic() {
    this.startSound.pause();
    this.startSound.currentTime = 0;
  }

  /**
   * Startet das Spiel, blendet den Startbutton aus und ruft `init()` auf.
   */
  startGame() {
    this.stopMusic();
    this.playButton.style.display = "none";
    init();
  }
}
