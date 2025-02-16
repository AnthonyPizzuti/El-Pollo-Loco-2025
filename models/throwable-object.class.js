/**
 * Represents a throwable object (bottle) in the game.
 * Extends `MovableObject` and contains logic for throwing,
 * flight path, ground impact, and bottle breaking.
 */
class ThrowableObject extends MovableObject {

  /**
   * Hitbox offsets for the bottle.
   * @type {{ top: number, bottom: number, left: number, right: number }}
   */
  offset = {
    top: 5,
    bottom: 5,
    left: 5,
    right: 5,
  };

/**
   * Image paths for the bottle's rotation animation during flight.
   * @type {string[]}
   */
  IMAGES_BOTTLE = [
    "img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png",
  ];

  /**
   * Image paths for the splash animation when the bottle breaks.
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
   * Sound effect for throwing the bottle.
   * @type {HTMLAudioElement}
   */
  throw_sound = new Audio("audio/throw.mp3");
  splash_sound = new Audio("audio/bottle_break.mp3");

  /**
   * Indicates whether the bottle has already hit the ground.
   * @type {boolean}
   */
  hasHitGround = false;

  /**
   * Creates a new `ThrowableObject` (bottle).
   * @param {number} x - The starting x-coordinate of the bottle.
   * @param {number} y - The starting y-coordinate of the bottle.
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
   * Throws the bottle in one direction and starts the throwing animation.
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
   * Plays the throwing sound if the game is not muted.
   */
  playThrowSound() {
    if (!isMuted) {
      this.throw_sound.volume = 0.5;
      this.throw_sound.play();
    }
  }

  /**
   * Checks if the bottle hits the ground and starts the splash animation.
   * @param {number} flightInterval - The ID of the animation interval.
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
   * Plays the splash animation when the bottle hits the ground and breaks.
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
   * Removes the bottle from the game once it has broken.
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
