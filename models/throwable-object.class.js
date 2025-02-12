class ThrowableObject extends MovableObject {
  offset = {
    top: 5,
    bottom: 5,
    left: 5,
    right: 5,
  };

  IMAGES_BOTTLE = [
    "img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png",
  ];

  IMAGES_SPLASH = [
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png",
  ];
  throw_sound = new Audio("audio/throw.mp3");
  splash_sound = new Audio("audio/bottle_break.mp3");
  hasHitGround = false;

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

  playThrowSound() {
    if (!isMuted) {
      this.throw_sound.volume = 0.5;
      this.throw_sound.play();
    }
  }

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

  removeBottle() {
    if (!this.level || !this.level.throwableObjects) {
      return;
    }
    this.level.throwableObjects = this.level.throwableObjects.filter(
      (bottle) => bottle !== this
    );
  }
}
