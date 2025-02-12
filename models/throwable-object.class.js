/**
 * Klasse für Objekte, die geworfen werden können (Flaschen).
 * Diese Klasse erweitert `MovableObject` und enthält Logik für das Werfen,
 * die Flugbahn, das Auftreffen auf den Boden und das Zerbrechen der Flasche.
 */
class ThrowableObject extends MovableObject {
  /**
   * Offset für die Hitbox-Anpassung der Flasche.
   * @type {{ top: number, bottom: number, left: number, right: number }}
   */
  offset = {
    top: 5,
    bottom: 5,
    left: 5,
    right: 5,
  };

  /**
   * Bildpfade für die Rotationsanimation der Flasche während des Fluges.
   * @type {string[]}
   */
  IMAGES_BOTTLE = [
    "img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png",
  ];

  /**
   * Bildpfade für die Animation, wenn die Flasche zerbricht.
   * @type {string[]}
   */
  IMAGES_SPLASH = [
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png",
  ];

  /**
   * Soundeffekt für das Werfen der Flasche.
   * @type {HTMLAudioElement}
   */
  throw_sound = new Audio("audio/throw.mp3");
  splash_sound = new Audio("audio/bottle_break.mp3");

  /**
   * Gibt an, ob die Flasche bereits den Boden erreicht hat.
   * @type {boolean}
   */
  hasHitGround = false;

  /**
   * Erstellt ein neues `ThrowableObject` (Flasche).
   * @param {number} x - Die Startposition der Flasche auf der X-Achse.
   * @param {number} y - Die Startposition der Flasche auf der Y-Achse.
   */
  constructor(x, y) {
    super().loadImage(this.IMAGES_BOTTLE[0]);
    this.loadImages(this.IMAGES_BOTTLE);
    this.loadImages(this.IMAGES_SPLASH);
    this.x = x;
    this.y = y;
    this.height = 60;
    this.width = 50;
    this.groundLevel = 400;
    this.trow();
    registerSound(this.throw_sound);
    registerSound(this.splash_sound);
  }

  /**
   * Lässt die Flasche in eine Richtung fliegen und startet die Wurf-Animation.
   */
  trow() {
    this.playThrowSound();
    this.speedY = 18;
    this.applyGravity();
    let flightInterval = setInterval(() => {
      if (!this.hasHitGround) {
        this.playAnimation(this.IMAGES_BOTTLE);
        this.x += this.otherDirection ? -10 : 10;
        this.checkGroundCollision(flightInterval);
      }
    }, 50);
    intervalIds.push(flightInterval);
  }

  /**
   * Spielt den Wurf-Sound ab, falls das Spiel nicht gemutet ist.
   */
  playThrowSound() {
    if (!isMuted) {
      this.throw_sound.volume = 0.5;
      this.throw_sound.play();
    }
  }

  /**
   * Überprüft, ob die Flasche auf dem Boden auftrifft und startet die Zersplitter-Animation.
   * @param {number} flightInterval - Die ID des Animations-Intervals.
   */
  checkGroundCollision(flightInterval) {
    if (this.y >= this.groundLevel && !this.hasHitGround) {
      this.hasHitGround = true;
      clearInterval(flightInterval);
      this.y = this.groundLevel;
      this.speedY = 0;
      this.x = this.x;
      this.playSplashAnimation();
    }
  }

  /**
   * Spielt die Animation ab, wenn die Flasche auf den Boden auftrifft und zerbricht.
   */
  playSplashAnimation() {
    if (!isMuted) {
      this.splash_sound.volume = 0.5;
      this.splash_sound.play();
    }
    let splashInterval = setInterval(() => {
      this.playAnimation(this.IMAGES_SPLASH);
    }, 100);
    setTimeout(() => {
      clearInterval(splashInterval);
      this.removeBottle();
    }, 600);
  }

  /**
   * Entfernt die Flasche aus dem Spiel, sobald sie zersplittert ist.
   */
  removeBottle() {
    if (!this.level || !this.level.throwableObjects) {
      return;
    }
    this.level.throwableObjects = this.level.throwableObjects.filter(
      (bottle) => bottle !== this
    );
  }
}
