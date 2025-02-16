/**
 * Represents the playable character (Pepe) in the game.
 * Inherits from `MovableObject` and includes movement, animations, and interactions.
 */
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
  isJumping = false;

  /** @type {Object} Offset for the hitbox */
  offset = {
    top: 120,
    bottom: 30,
    left: 40,
    right: 30,
  };

   /** @type {string[]} Idle Animation */
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

    /** @type {string[]} Long Idle Animation */
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

   /** @type {string[]} Walking Animation */
  IMAGES_WALKING = [
    "img/2_character_pepe/2_walk/W-21.png",
    "img/2_character_pepe/2_walk/W-22.png",
    "img/2_character_pepe/2_walk/W-23.png",
    "img/2_character_pepe/2_walk/W-24.png",
    "img/2_character_pepe/2_walk/W-25.png",
    "img/2_character_pepe/2_walk/W-26.png",
  ];

  /** @type {string[]} Jumping Animation */
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

  /** @type {string[]} Death Animation */
  IMAGES_DEAD = [
    "img/2_character_pepe/5_dead/D-51.png",
    "img/2_character_pepe/5_dead/D-52.png",
    "img/2_character_pepe/5_dead/D-53.png",
    "img/2_character_pepe/5_dead/D-54.png",
    "img/2_character_pepe/5_dead/D-55.png",
    "img/2_character_pepe/5_dead/D-56.png",
    "img/2_character_pepe/5_dead/D-57.png",
  ];

  /** @type {string[]} Hurt Animation */
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

/**
   * Creates the character, loads all images and sounds, and starts the animation.
   */
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
    this.canThrow = true;
    this.jumpingAnimationActive = false;
    this.jumpFrameIndex = 0;
    this.jumpAnimInterval = null;

  }

 /**
   * Animates the character.
   */
  animate() {
    intervalIds.push(setInterval(() => this.moveCharacter(), 1000 / 60));
    intervalIds.push(setInterval(() => this.playCharacter(), 100));
  }

  /**
   * Animates the jump animation.
   */
  startJumpAnimation() {
    if (this.jumpingAnimationActive) return;
    this.jumpingAnimationActive = true;
    this.jumpFrameIndex = 0;
    this.jumpAnimInterval = setInterval(() => {
      if (!this.isAboveGround()) {
        clearInterval(this.jumpAnimInterval);
        this.jumpingAnimationActive = false;
        return;
      }
      this.img = this.imageCache[this.IMAGES_JUMPING[this.jumpFrameIndex % this.IMAGES_JUMPING.length]];
      this.jumpFrameIndex++;
    }, 60);
  }
  
  /**
   * Moves the character based on keyboard input.
   */
  moveCharacter() {
    this.walking_sound.pause();
    this.jumping_sound.pause();
    if (this.canMoveRight()) { this.moveRight(); this.otherDirection = false; this.updateLastMovement(); this.walking_sound.play();
    }
    if (this.canMoveLeft()) { this.moveLeft(); this.otherDirection = true; this.updateLastMovement(); this.walking_sound.play();
    }
    if (this.canJump()) { this.jump(); this.updateLastMovement(); this.jumping_sound.play();
    }
    this.world.camera_x = -this.x + 100;
    this.checkSleeping();
  }

  /**
   * Checks if the character can move to the right.
   * @returns {boolean} `true` if moving right is allowed.
   */
  canMoveRight() {
    return this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x;
  }

  /**
   * Checks if the character can move to the left.
   * The character can only move left if the LEFT key is pressed
   * and he is not already at the left edge of the playing field (`x > 0`).
   *
   * @returns {boolean} `true` if moving left is allowed, otherwise `false`.
   */
  canMoveLeft() {
    return this.world.keyboard.LEFT && this.x > 0;
  }

  /**
   * Checks if the character can jump.
   * The character can only jump if the SPACE key is pressed
   * and he is not already in the air (`!this.isAboveGround()`).
   *
   * @returns {boolean} `true` if the character can jump, otherwise `false`.
   */
  canJump() {
    return this.world.keyboard.SPACE && !this.isAboveGround();
  }

  /**
   * Controls the character's animations based on its current state.
   *
   * - If the character is dead, plays the death animation and the `dead_sound`.
   * - If the character is hurt, plays the hurt animation and the `hurt_sound`.
   * - If the character is in the air, plays the jump animation.
   * - If the character is moving left or right, plays the walking animation.
   * - Otherwise, plays the idle animation.
   */
  playCharacter() {
    if (this.isDead()) {
      this.playAnimation(this.IMAGES_DEAD);
      this.dead_sound.play();
    } else if (this.isSleepingActive) { this.playAnimation(this.IMAGES_LONG_IDLE);
      this.sleep_sound.play();
    } else if (this.isHurt()) { this.playAnimation(this.IMAGES_HURT);
      this.hurt_sound.play();
    } else if (this.isAboveGround()) { this.startJumpAnimation();
    } else if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
      this.playAnimation(this.IMAGES_WALKING);
    } else { this.playAnimation(this.IMAGES_IDLE);
    }
  }

 /**
   * Checks if the character has been inactive for a certain time and then enters sleep mode.
   */
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
      this.isSleeping();
    }
  }

/**
   * Updates the character's last movement time and ends sleep mode if active.
   */
  updateLastMovement() {
    this.lastMovementTime = new Date().getTime();
    if (this.isSleepingActive) {
      this.isSleepingActive = false;
      this.stopSleeping();
    }
  }

  /**
   * Stops the character's sleep animation.
   */
  stopSleeping() {
    this.isSleepingActive = false;
    this.playAnimation(this.IMAGES_IDLE);
    this.sleep_sound.pause();
  }

 /**
   * Starts the character's sleep animation.
   */
  isSleeping() {
    this.isSleepingActive = true;
    this.playAnimation(this.IMAGES_LONG_IDLE);
    this.sleep_sound.play();
  }

   /**
   * Increases the number of collected bottles and updates the bottle bar.
   */
  collectBottle() {
    this.bottles += 1;
    const percentage = Math.min((this.bottles / this.totalBottles) * 100, 100);
    this.world.bottleBar.setPercentage(percentage);
  }

 /**
   * Checks if the character is hit while sleeping.
   */
  hit() {
    if (this.isHurt()) return;
    if (this.isSleepingActive) {
      this.stopSleeping();
      this.lastMovementTime = new Date().getTime();
    }
    super.hit();
    this.playAnimation(this.IMAGES_HURT);
    this.hurt_sound.play();
  }

/**
   * Throws a bottle in the direction the character is facing if he has one.
   */
  throwBottle() {
    if (this.bottles > 0 && this.canThrow) { this.canThrow = false;
      this.bottles -= 1;
      const percentage = Math.max((this.bottles / this.totalBottles) * 100, 0);
      this.world.bottleBar.setPercentage(percentage);
      let bottleX = this.x + (this.otherDirection ? -20 : 100);
      let bottleY = this.y + 70;
      let bottle = new ThrowableObject(bottleX, bottleY);
      bottle.otherDirection = this.otherDirection;
      bottle.speedX = this.otherDirection ? -1 : 1;
      bottle.applyGravity();
      this.world.throwableObjects.push(bottle);
      setTimeout(() => { this.canThrow = true;
      }, 500);
    }
  }

  /**
   * Increases the number of collected coins and updates the coin bar.
   */
  collectCoin() {
    this.coins += 1;
    const percentage = Math.min((this.coins / this.totalCoins) * 100, 100);
    this.world.coinBar.setPercentage(percentage);
  }
}
