/**
 * Represents the game world and handles the main logic, rendering, and interactions.
 */
class World {
  character = new Character();
  level = level1;
  canvas;
  ctx;
  keyboard;
  camera_x = 0;
  statusBar = new StatusBar();
  botte = new Bottle();
  coin = new Coin();
  throwableObjects = [];
  hit_Sound = new Audio("audio/hit.mp3");
  bottle_sound = new Audio("audio/glass.mp3");
  coin_sound = new Audio("audio/coin.mp3");
  endboss_sound = new Audio("audio/endboss.mp3");
  endboss_attack_sound = new Audio("audio/endboss-attack.mp3");
  endbossSpawned = false;
  winScreenDisplayed = false;
  gameOverDisplayed = false;
  bossBar = null;

  /**
   * Creates an instance of World.
   * @param {HTMLCanvasElement} canvas - The game's canvas element.
   * @param {Keyboard} keyboard - The keyboard input handler.
   */
  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.rendering = new Rendering(this);
    this.throwableObjects = [];
    this.bottleBar = new BottleBar();
    this.bottleBar.setPercentage(0);
    this.coinBar = new CoinBar();
    this.coinBar.setPercentage(0);
    this.spawnBottle();
    this.setWorld();
    this.run();
    this.assignWorldToEnemies();
    this.initializeEnemies();
    registerSound(this.hit_Sound);
    registerSound(this.bottle_sound);
    registerSound(this.coin_sound);
    registerSound(this.endboss_sound);
    registerSound(this.backgroundMusic);
    registerSound(this.endboss_attack_sound);
  }

  /**
   * Assigns this world instance to the character.
   */
  setWorld() {
    this.character.world = this;
  }

  /**
   * Runs the game logic in intervals.
   */
  run() {
    intervalIds.push(
      setInterval(() => {
        if (gamePaused) return;
        this.checkBottleEnemyCollision();
        this.checkJumpOnEnemy();
        this.checkColliding();
        this.throwBottle();
        this.checkCollisionCoin();
        this.checkCollisionBottle();
        this.checkAllSmallEnemiesDead();
        this.checkWinCondition();
        this.checkGameOver();
      }, 1000 / 60)
    );
  }

  /**
   * Sets the current level and initializes enemies.
   * @param {Object} level - The level data.
   */
  setLevel(level) {
    this.level = level;
    this.level.enemies = [...level.enemies];
    this.initializeEnemies();
  }

  /**
   * Starts the main game loop if not already active.
   * The loop periodically checks various game states like collisions,
   * bottle throwing, and win or game-over conditions.
   */
  startGameLoop() {
    if (this.gameLoopActive) return;
    this.gameLoopActive = true;
    this.gameLoop = setInterval(() => {
      this.rendering.draw();
      this.checkCollisionCoin();
      this.checkCollisionBottle();
      this.checkAllSmallEnemiesDead();
      this.checkWinCondition();
      this.checkGameOver();
    }, 1000 / 60);
  }

  /**
   * Stops all movement in the game.
   */
  stopAllMovement() {
    this.level.enemies.forEach((enemy) => { enemy.storedSpeed = enemy.speed; enemy.speed = 0;
    });
    this.throwableObjects.forEach((bottle) => { bottle.storedSpeedX = bottle.speedX; bottle.speedX = 0;
    });
    this.character.storedSpeedX = this.character.speedX;
    this.character.speedX = 0;
  }

  /**
   * Resumes all movement in the game.
   */
  resumeAllMovement() {
    this.level.enemies.forEach((enemy) => { enemy.speed = enemy.storedSpeed || 1;
    });
    this.throwableObjects.forEach((bottle) => { bottle.speedX = bottle.storedSpeedX || (bottle.otherDirection ? -5 : 5);
    });
    this.character.speedX = this.character.storedSpeedX || 0;
  }

  /**
   * Assigns the world instance to all enemies.
   */
  assignWorldToEnemies() {
    if (!this.enemiesAssigned) {
      this.level.enemies.forEach((enemy) => {
        if (!enemy.world) { enemy.setWorld(this);
        }
      });
      this.enemiesAssigned = true;
    }
  }

  /**
   * Initializes the enemies in the level.
   */
  initializeEnemies() {
    if (!this.level.enemies || this.level.enemies.length === 0) {
      this.level.enemies = [];
      this.level.enemies = [
        new Chicken(this),
        new Chicken(this),
        new Chicken(this),
        new Littlechicken(this),
        new Littlechicken(this),
        new Littlechicken(this),
        new Endboss(),
      ];
    }
  }

  /**
   * Checks if all small enemies are dead and spawns the end boss if necessary.
   */
  checkAllSmallEnemiesDead() {
    const remainingSmallEnemies = this.level.enemies.filter(
      (enemy) => (enemy instanceof Chicken || enemy instanceof Littlechicken) && !enemy.isDead
    );
    if (remainingSmallEnemies.length === 0 && !this.endbossSpawned) {
      this.spawnEndboss();
    }
  }

  /**
   * Spawns the Endboss when all small enemies are defeated.
   */
  spawnEndboss() {
    const endboss = new Endboss();
    this.level.enemies.push(endboss);
    this.endbossSpawned = true;
    if (backgroundMusic) { backgroundMusic.pause();
    }
    this.endboss_sound.play();
    this.endboss_sound.volume = 0.2;
    this.endboss_sound.loop = true;
    this.bossBar = new BossBar();
  }

  /**
   * Checks whether a thrown bottle collides with an enemy.
   * @returns {void}
   */
checkBottleEnemyCollision() {
    this.throwableObjects.forEach((bottle, bottleIndex) => { if (bottle.hasHitGround) return;
      for (let i = 0; i < this.level.enemies.length; i++) { const enemy = this.level.enemies[i];
        if (!enemy.isDead && bottle.isColliding(enemy)) { enemy.hitByBottle = true;
          if (enemy instanceof Endboss) { this.handleEndbossCollision(enemy);
          } else { this.handleChickenCollision(enemy);
          }
          bottle.hasHitGround = true;
          this.throwableObjects.splice(bottleIndex, 1);
          setTimeout(() => { enemy.hitByBottle = false; }, 500);
          return;
        }
      }
    });
  }
  
  /**
   * Checks if the character is jumping on an enemy.
   * @returns {void}
   */
  checkJumpOnEnemy() {
    this.level.enemies.forEach((enemy) => {
      if (enemy.isDead || enemy.hitByBottle) return;
      if (this.character.isColliding(enemy)) { const isJumpCollision = this.character.speedY < -5 &&
          (this.character.y + this.character.height - this.character.offset.bottom < enemy.y + enemy.offset.top + (enemy instanceof Littlechicken ? enemy.height : enemy.height * 0.6));
        if (isJumpCollision) { this.character.speedY = 15;
          this.character.isJumping = false;
          if (enemy instanceof Endboss) { this.handleEndbossCollision(enemy);
          } else { this.handleChickenCollision(enemy);
          }
        }
      }
    });
  }
  
  /**
   * Checks if there is a normal (frontal) collision between the character and an enemy.
   * @returns {void}
   */
  checkColliding() {
    this.level.enemies.forEach((enemy) => { if (enemy.isDead || enemy.hitByBottle) return;
      if (this.character.isColliding(enemy)) { const isJumpCollision = this.character.speedY < -5 &&
          (this.character.y + this.character.height - this.character.offset.bottom < enemy.y + enemy.offset.top + (enemy instanceof Littlechicken ? enemy.height : enemy.height * 0.6));
        if (!isJumpCollision) { this.character.hit();
          this.statusBar.setPercentage(this.character.energy);
        }
      }
    });
  }
  
  /**
   * Checks for collision between the character and bottles.
   */
  checkCollisionBottle() {
    this.level.bottles.forEach((bottle, index) => {
      if (this.character.isColliding(bottle)) {
        this.bottle_sound.play();
        this.bottle_sound.volume = 0.1;
        this.level.bottles.splice(index, 1);
        this.character.collectBottle();
      }
    });
  }

  /**
   * Checks for collision between the character and coins.
   */
  checkCollisionCoin() {
    this.level.coins.forEach((coin, index) => {
      if (this.character.isColliding(coin)) {
        this.coin_sound.play();
        this.level.coins.splice(index, 1);
        this.character.collectCoin();
      }
    });
  }

  /**
   * Handles collision between a bottle and a chicken.
   * @param {Object} enemy - The enemy object.
   */
  handleChickenCollision(enemy) {
    if (!enemy.isDead) {
      enemy.isDead = true;
      enemy.img = enemy.imageCache[enemy.IMAGES_DEAD[0]];
      setTimeout(() => { const index = this.level.enemies.indexOf(enemy);
        if (index > -1) { this.level.enemies.splice(index, 1);
        }
      }, 1000);
    }
  }

  /**
   * Handles collision between a bottle and the Endboss.
   * @param {Object} enemy - The Endboss object.
   */
  handleEndbossCollision(enemy) {
    enemy.hits = (enemy.hits || 0) + 1;
    this.bossBar?.setPercentage(enemy.hits);
    this.endboss_attack_sound.volume = 0.8;
    this.endboss_attack_sound.play();
    if (enemy.hits < 5) {
        enemy.playAnimation(enemy.IMAGES_HURT);
        setTimeout(() => { enemy.playAnimation(enemy.IMAGES_WALK); }, 2000);
        } else {
          enemy.die();
          setTimeout(() => {
            this.checkWinCondition();
          }, 3000);
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

  /**
   * Increases the number of collected bottles and updates the bottle bar.
   */
  collectBottle() {
    this.bottles += 1;
    const percentage = Math.min((this.bottles / this.totalBottles) * 100, 100);
    this.world.bottleBar.setPercentage(percentage);
  }

  /**
   * Checks if the player can throw a bottle and adds a thrown bottle.
   */
  throwBottle() {
    if (this.keyboard && this.keyboard.D && this.character.bottles > 0) {
      this.character.throwBottle();
    }
  }
  
  /**
   * Creates new bottles at random positions in the level at regular intervals.
   */
  spawnBottle() {
    intervalIds.push(setInterval(() => {
        const randomX = 100 + Math.random() * 500;
        const newBottle = new Bottle(randomX);
        this.level.bottles.push(newBottle);
      }, 5000)
    );
  }

  /**
   * Checks if all enemies have been defeated.
   * If so, stops the game and displays the winning screen.
   */
  checkWinCondition() {
    const remainingEnemies = this.level.enemies.filter((enemy) => !enemy.isDead);
    if (remainingEnemies.length === 0 && !winScreenDisplayed) { winScreenDisplayed = true;
      stopAllIntervals();
      let drawLoopId = requestAnimationFrame(() => {});
      cancelAnimationFrame(drawLoopId);
      setTimeout(() => { document.getElementById("canvas").remove(); document.getElementById("game-controls").remove();
      showWinningScreen();
      }, 3000);
    }
  }

  /**
   * Checks if the player has no more life.
   * If so, stops the game and displays the game over screen.
   */
  checkGameOver() {
    if (this.character.energy <= 0 && !this.gameOverDisplayed) { this.gameOverDisplayed = true;
        if (backgroundMusic) { backgroundMusic.pause();
            backgroundMusic.currentTime = 0;
    }
      stopAllIntervals();
      let drawLoopId = requestAnimationFrame(() => {});
      cancelAnimationFrame(drawLoopId);
      document.getElementById("canvas")?.remove();
      document.getElementById("game-controls")?.remove();
      setTimeout(() => { showGameOverScreen();
      }, 100);
    }
  }

  /**
   * Stops the drawing loop by setting the stopped flag to true.
   * This prevents the game from continuously rendering new frames.
   */
  stopDrawing() {
    this.stopped = true;
  }
}
