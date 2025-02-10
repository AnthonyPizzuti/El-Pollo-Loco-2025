class Character extends MovableObject {
  height = 280;
  y = 80;
  speed = 15;
  bottles = 0;
  totalBottles = 16;
  coins = 0;
  totalCoins = 5;
  isSleepingActive = false;
  lastMovementTime = new Date().getTime();
  sleepTimer = null;

  IMAGES_IDLE = [
    "img/2_character_pepe/1_idle/idle/I-1.png",
    "img/2_character_pepe/1_idle/idle/I-2.png",
    "img/2_character_pepe/1_idle/idle/I-3.png",
    "img/2_character_pepe/1_idle/idle/I-4.png",
    "img/2_character_pepe/1_idle/idle/I-5.png",
    "img/2_character_pepe/1_idle/idle/I-6.png",
    "img/2_character_pepe/1_idle/idle/I-7.png",
    "img/2_character_pepe/1_idle/idle/I-8.png",
    "img/2_character_pepe/1_idle/idle/I-9.png",
    "img/2_character_pepe/1_idle/idle/I-10.png",
  ];

  IMAGES_LONG_IDLE = [
    "img/2_character_pepe/1_idle/long_idle/I-11.png",
    "img/2_character_pepe/1_idle/long_idle/I-12.png",
    "img/2_character_pepe/1_idle/long_idle/I-13.png",
    "img/2_character_pepe/1_idle/long_idle/I-14.png",
    "img/2_character_pepe/1_idle/long_idle/I-15.png",
    "img/2_character_pepe/1_idle/long_idle/I-16.png",
    "img/2_character_pepe/1_idle/long_idle/I-17.png",
    "img/2_character_pepe/1_idle/long_idle/I-18.png",
    "img/2_character_pepe/1_idle/long_idle/I-19.png",
    "img/2_character_pepe/1_idle/long_idle/I-20.png",
  ];

  IMAGES_WALKING = [
    "img/2_character_pepe/2_walk/W-21.png",
    "img/2_character_pepe/2_walk/W-22.png",
    "img/2_character_pepe/2_walk/W-23.png",
    "img/2_character_pepe/2_walk/W-24.png",
    "img/2_character_pepe/2_walk/W-25.png",
    "img/2_character_pepe/2_walk/W-26.png",
  ];

  IMAGES_JUMPING = [
    "img/2_character_pepe/3_jump/J-31.png",
    "img/2_character_pepe/3_jump/J-32.png",
    "img/2_character_pepe/3_jump/J-33.png",
    "img/2_character_pepe/3_jump/J-34.png",
    "img/2_character_pepe/3_jump/J-35.png",
    "img/2_character_pepe/3_jump/J-36.png",
    "img/2_character_pepe/3_jump/J-37.png",
    "img/2_character_pepe/3_jump/J-38.png",
    "img/2_character_pepe/3_jump/J-39.png",
  ];

  IMAGES_DEAD = [
    "img/2_character_pepe/5_dead/D-51.png",
    "img/2_character_pepe/5_dead/D-52.png",
    "img/2_character_pepe/5_dead/D-53.png",
    "img/2_character_pepe/5_dead/D-54.png",
    "img/2_character_pepe/5_dead/D-55.png",
    "img/2_character_pepe/5_dead/D-56.png",
    "img/2_character_pepe/5_dead/D-57.png",
  ];

  IMAGES_HURT = [
    "img/2_character_pepe/4_hurt/H-41.png",
    "img/2_character_pepe/4_hurt/H-42.png",
    "img/2_character_pepe/4_hurt/H-43.png",
  ];

  world;
  walking_sound = new Audio("audio/running.mp3");
  jumping_sound = new Audio("audio/jump.mp3");
  throwing_sound = new Audio("audio/throw.mp3");
  dead_sound = new Audio("audio/dead.mp3");
  hurt_sound = new Audio("audio/hurt.mp3");
  sleep_sound = new Audio("audio/sleep.mp3");

  constructor() {
    super().loadImage("img/2_character_pepe/1_idle/idle/I-1.png");
    this.loadImages(this.IMAGES_IDLE);
    this.loadImages(this.IMAGES_LONG_IDLE);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_JUMPING);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImages(this.IMAGES_HURT);
    this.applyGravity();
    this.animate();
    registerSound(this.walking_sound);
    registerSound(this.jumping_sound);
    registerSound(this.throwing_sound);
    registerSound(this.dead_sound);
    registerSound(this.hurt_sound);
    registerSound(this.sleep_sound);
  }

  animate() {
    intervalIds.push(setInterval(() => this.moveCharacter(), 1000 / 60));
    intervalIds.push(setInterval(() => this.playCharacter(), 50));
  }

  moveCharacter() {
    this.walking_sound.pause();
    this.jumping_sound.pause();
    if (this.canMoveRight()) {
      this.moveRight();
      this.otherDirection = false;
      this.updateLastMovement();
      this.walking_sound.play();
    }
    if (this.canMoveLeft()) {
      this.moveLeft();
      this.otherDirection = true;
      this.updateLastMovement();
      this.walking_sound.play();
    }
    if (this.canJump()) {
      this.jump();
      this.updateLastMovement();
      this.jumping_sound.play();
    }
    this.world.camera_x = -this.x + 100;
    this.checkSleeping();
  }

  canMoveRight() {
    return this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x;
  }

  canMoveLeft() {
    return this.world.keyboard.LEFT && this.x > 0;
  }

  canJump() {
    return this.world.keyboard.SPACE && !this.isAboveGround();
  }

  playCharacter() {
    if (this.isDead()) {
      this.playAnimation(this.IMAGES_DEAD);
      this.dead_sound.play();
    } else if (this.isHurt()) {
      this.playAnimation(this.IMAGES_HURT);
      this.hurt_sound.play();
    } else if (this.isAboveGround()) {
      this.playAnimation(this.IMAGES_JUMPING);
    } else {
      if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
        this.playAnimation(this.IMAGES_WALKING);
      }
    }
  }

  jump() {
    this.speedY = 30;
  }

  checkSleeping() {
    const now = new Date().getTime();
    if (
      this.world.keyboard.RIGHT ||
      this.world.keyboard.LEFT ||
      this.world.keyboard.D
    ) {
      this.updateLastMovement();
    }
    if (now - this.lastMovementTime >= 5000 && !this.isSleepingActive) {
      this.isSleepingActive = true;
      this.isSleeping();
    }
  }

  updateLastMovement() {
    this.lastMovementTime = new Date().getTime();
    if (this.isSleepingActive) {
      this.isSleepingActive = false;
      this.stopSleeping();
    }
  }

  stopSleeping() {
    this.playAnimation(this.IMAGES_IDLE);
    this.sleep_sound.pause();
  }

  isSleeping() {
    this.playAnimation(this.IMAGES_LONG_IDLE);
    this.sleep_sound.play();
  }

  collectBottle() {
    this.bottles += 1;
    const percentage = Math.min((this.bottles / this.totalBottles) * 100, 100);
    this.world.bottleBar.setPercentage(percentage);
  }

  throwBottle() {
    if (this.bottles > 0) {
      this.bottles -= 1;
      const percentage = Math.max((this.bottles / this.totalBottles) * 100, 0);
      this.world.bottleBar.setPercentage(percentage);
      let bottleX = this.x + 100;
      let bottleY = this.y + 100;
      let bottle = new ThrowableObject(bottleX, bottleY);
      bottle.otherDirection = this.otherDirection;
      bottle.speedY = 5;
      bottle.speedX = this.otherDirection ? -5 : 5;
      this.world.throwableObjects.push(bottle);
      bottle.applyGravity();
      bottle.trow();
    }
  }

  collectCoin() {
    this.coins += 1;
    const percentage = Math.min((this.coins / this.totalCoins) * 100, 100);
    this.world.coinBar.setPercentage(percentage);
  }
}
