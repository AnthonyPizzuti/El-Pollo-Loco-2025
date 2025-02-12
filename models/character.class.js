/**
 * Repräsentiert den spielbaren Charakter (Pepe) im Spiel.
 * Erbt von `MovableObject` und enthält Bewegung, Animationen und Interaktionen.
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

  /** @type {Object} Offset für die Hitbox */
  offset = {
    top: 120,
    bottom: 30,
    left: 40,
    right: 30,
  };

  /** @type {string[]} Idle-Animation */
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

  /** @type {string[]} Lange Idle-Animation */
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

  /** @type {string[]} Geh-Animation */
  IMAGES_WALKING = [
    "img/2_character_pepe/2_walk/W-21.png",
    "img/2_character_pepe/2_walk/W-22.png",
    "img/2_character_pepe/2_walk/W-23.png",
    "img/2_character_pepe/2_walk/W-24.png",
    "img/2_character_pepe/2_walk/W-25.png",
    "img/2_character_pepe/2_walk/W-26.png",
  ];

  /** @type {string[]} Sprung-Animation */
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

  /** @type {string[]} Sterbe-Animation */
  IMAGES_DEAD = [
    "img/2_character_pepe/5_dead/D-51.png",
    "img/2_character_pepe/5_dead/D-52.png",
    "img/2_character_pepe/5_dead/D-53.png",
    "img/2_character_pepe/5_dead/D-54.png",
    "img/2_character_pepe/5_dead/D-55.png",
    "img/2_character_pepe/5_dead/D-56.png",
    "img/2_character_pepe/5_dead/D-57.png",
  ];

  /** @type {string[]} Schaden-Animation */
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
   * Erstellt den Charakter, lädt alle Bilder und Sounds und startet die Animation.
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
  }

  /**
   * Animiert den Charakter.
   */
  animate() {
    intervalIds.push(setInterval(() => this.moveCharacter(), 1000 / 60));
    intervalIds.push(setInterval(() => this.playCharacter(), 50));
  }

  /**
   * Bewegt den Charakter basierend auf der Tasteneingabe.
   */
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

  /**
   * Überprüft, ob der Charakter nach rechts gehen kann.
   * @returns {boolean} `true`, wenn die Bewegung erlaubt ist.
   */
  canMoveRight() {
    return this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x;
  }

  /**
   * Überprüft, ob der Charakter sich nach links bewegen kann.
   * Der Charakter kann sich nur nach links bewegen, wenn die `LEFT`-Taste gedrückt wird
   * und er sich nicht bereits am linken Rand des Spielfeldes (`x > 0`) befindet.
   *
   * @returns {boolean} `true`, wenn die Bewegung nach links möglich ist, sonst `false`.
   */
  canMoveLeft() {
    return this.world.keyboard.LEFT && this.x > 0;
  }

  /**
   * Überprüft, ob der Charakter springen kann.
   * Der Charakter kann nur springen, wenn die `SPACE`-Taste gedrückt wird
   * und er sich nicht bereits in der Luft (`!this.isAboveGround()`) befindet.
   *
   * @returns {boolean} `true`, wenn der Charakter springen kann, sonst `false`.
   */
  canJump() {
    return this.world.keyboard.SPACE && !this.isAboveGround();
  }

  /**
   * Steuert die Animationen des Charakters basierend auf seinem aktuellen Zustand.
   *
   * - Falls der Charakter tot ist, wird die Sterbeanimation abgespielt und der `dead_sound` abgespielt.
   * - Falls der Charakter verletzt ist, wird die Verletzungsanimation abgespielt und der `hurt_sound` abgespielt.
   * - Falls der Charakter in der Luft ist, wird die Sprunganimation abgespielt.
   * - Falls der Charakter sich nach links oder rechts bewegt, wird die Geh-Animation abgespielt.
   */
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

  /**
   * Lässt den Charakter springen, indem eine vertikale Geschwindigkeit gesetzt wird.
   */
  jump() {
    this.speedY = 30;
  }

  /**
   * Überprüft, ob der Charakter für eine gewisse Zeit inaktiv war und wechselt dann in den Schlafmodus.
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
      this.isSleepingActive = true;
      this.isSleeping();
    }
  }

  /**
   * Aktualisiert die letzte Bewegung des Charakters und beendet den Schlafmodus, falls aktiv.
   */
  updateLastMovement() {
    this.lastMovementTime = new Date().getTime();
    if (this.isSleepingActive) {
      this.isSleepingActive = false;
      this.stopSleeping();
    }
  }

  /**
   * Stoppt die Schlafanimation des Charakters.
   */
  stopSleeping() {
    this.playAnimation(this.IMAGES_IDLE);
    this.sleep_sound.pause();
  }

  /**
   * Startet die Schlafanimation des Charakters.
   */
  isSleeping() {
    this.playAnimation(this.IMAGES_LONG_IDLE);
    this.sleep_sound.play();
  }

  /**
   * Erhöht die Anzahl gesammelter Flaschen und aktualisiert die Flaschenleiste.
   */
  collectBottle() {
    this.bottles += 1;
    const percentage = Math.min((this.bottles / this.totalBottles) * 100, 100);
    this.world.bottleBar.setPercentage(percentage);
  }

  /**
   * Lässt den Charakter eine Flasche werfen, wenn er eine besitzt.
   * Die Flasche wird in die Richtung geworfen, in die der Charakter schaut.
   */
  throwBottle() {
    if (this.bottles > 0) {
      this.bottles -= 1;
      const percentage = Math.max((this.bottles / this.totalBottles) * 100, 0);
      this.world.bottleBar.setPercentage(percentage);
      let bottleX = this.x + (this.otherDirection ? -20 : 100);
      let bottleY = this.y + 100;
      let bottle = new ThrowableObject(bottleX, bottleY);
      bottle.otherDirection = this.otherDirection;
      bottle.speedX = this.otherDirection ? -5 : 5;
      bottle.applyGravity();
      if (!this.world.throwableObjects) {
        this.world.throwableObjects = [];
      }
      this.world.throwableObjects.push(bottle);
    }
  }

  /**
   * Erhöht die Anzahl gesammelter Münzen und aktualisiert die Münzleiste.
   */
  collectCoin() {
    this.coins += 1;
    const percentage = Math.min((this.coins / this.totalCoins) * 100, 100);
    this.world.coinBar.setPercentage(percentage);
  }
}
