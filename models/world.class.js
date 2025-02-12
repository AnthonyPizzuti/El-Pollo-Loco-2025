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
    this.throwableObjects = [];
    this.bottleBar = new BottleBar();
    this.bottleBar.setPercentage(0);
    this.coinBar = new CoinBar();
    this.coinBar.setPercentage(0);
    this.spawnBottle();
    this.draw();
    this.setWorld();
    this.run();
    this.assignWorldToEnemies();
    this.initializeEnemies();
    registerSound(this.hit_Sound);
    registerSound(this.bottle_sound);
    registerSound(this.coin_sound);
    registerSound(this.endboss_sound);
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
        this.checkCollision();
        this.throwBottle();
        this.checkCollisionCoin();
        this.checkCollisionBottle();
        this.checkBottleEnemyCollision();
        this.checkAllSmallEnemiesDead();
        this.checkWinCondition();
        this.checkGameOver();
      }, 200)
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
 * Startet die Hauptspiel-Schleife, falls sie nicht bereits aktiv ist.
 * Die Schleife überprüft in regelmäßigen Abständen verschiedene Spielzustände 
 * wie Kollisionen, das Werfen von Flaschen und Sieg- oder Niederlagenbedingungen.
 */
  startGameLoop() {
    if (this.gameLoopActive) return;
    this.gameLoopActive = true;
    this.gameLoop = setInterval(() => {
      this.checkCollision();
      this.throwBottle();
      this.checkCollisionCoin();
      this.checkCollisionBottle();
      this.checkBottleEnemyCollision();
      this.checkAllSmallEnemiesDead();
      this.checkWinCondition();
      this.checkGameOver();
    }, 1000 / 60);
  }

  /**
   * Stops all movement in the game.
   */
  stopAllMovement() {
    this.level.enemies.forEach((enemy) => {
      enemy.storedSpeed = enemy.speed;
      enemy.speed = 0;
    });
    this.throwableObjects.forEach((bottle) => {
      bottle.storedSpeedX = bottle.speedX;
      bottle.speedX = 0;
    });
    this.character.storedSpeedX = this.character.speedX;
    this.character.speedX = 0;
  }

  /**
   * Resumes all movement in the game.
   */
  resumeAllMovement() {
    this.level.enemies.forEach((enemy) => {
      enemy.speed = enemy.storedSpeed || 1;
    });
    this.throwableObjects.forEach((bottle) => {
      bottle.speedX = bottle.storedSpeedX || (bottle.otherDirection ? -5 : 5);
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
      (enemy) => (enemy instanceof Chicken || enemy instanceof Littlechicken) &&
        !enemy.isDead
    );
    if (remainingSmallEnemies.length === 0 && !this.endbossSpawned) { this.spawnEndboss();
    }
  }

  /**
   * Spawns the Endboss when all small enemies are defeated.
   */
  spawnEndboss() {
    const endboss = new Endboss();
    this.level.enemies.push(endboss);
    this.endbossSpawned = true;
    this.endboss_sound.play();
    this.endboss_sound.volume = 0.3;
    this.endboss_sound.loop = true;
    this.bossBar = new BossBar();
  }

  /**
   * Checks for collision between the character and enemies.
   */
  checkCollision() {
    this.level.enemies.forEach((enemy) => {
      if (enemy.isDead) return;
      if (this.character.isColliding(enemy)) { this.character.hit();
        this.statusBar.setPercentage(this.character.energy);
      }
    });
  }

  /**
   * Checks for collision between the character and bottles.
   */
  checkCollisionBottle() {
    this.level.bottles.forEach((bottle, index) => {
      if (this.character.isColliding(bottle)) { this.bottle_sound.play();
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
      if (this.character.isColliding(coin)) { this.coin_sound.play();
        this.level.coins.splice(index, 1);
        this.character.collectCoin();
      }
    });
  }

  /**
   * Checks for collision between throwable objects and enemies.
   */
  checkBottleEnemyCollision() {
    this.throwableObjects.forEach((bottle, bottleIndex) => {
      if (bottle.hasHitGround) return;
      for (let i = 0; i < this.level.enemies.length; i++) { let enemy = this.level.enemies[i];
        if (!enemy.isDead && bottle.isColliding(enemy)) { if (enemy instanceof Endboss) { this.handleEndbossCollision(enemy);
          } else { this.handleChickenCollision(enemy);
          }
          bottle.hasHitGround = true;
          this.throwableObjects.splice(bottleIndex, 1);
          return;
        }
      }
    });
  }

  /**
   * Handles collision between a bottle and a chicken.
   * @param {Object} enemy - The enemy object.
   */
  handleChickenCollision(enemy) {
    if (!enemy.isDead) { enemy.isDead = true;
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
    if (enemy.hits === 3) { enemy.img = enemy.imageCache[enemy.IMAGES_HURT[0]];
      enemy.playAnimation(enemy.IMAGES_HURT);
    }
    if (enemy.hits >= 5) { enemy.isDead = true;
      enemy.img = enemy.imageCache[enemy.IMAGES_DEAD[0]];
      enemy.playAnimation(enemy.IMAGES_DEAD);
      setTimeout(() => { let i = this.level.enemies.indexOf(enemy);
      if (i > -1) this.level.enemies.splice(i, 1), this.endboss_sound.pause();
      }, 1000);
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

  /**
 * Erhöht die Anzahl gesammelter Flaschen und aktualisiert die Flaschenleiste.
 */
  collectBottle() {
    this.bottles += 1;
    const percentage = Math.min((this.bottles / this.totalBottles) * 100, 100);
    this.world.bottleBar.setPercentage(percentage);
  }

  /**
 * Prüft, ob der Spieler eine Flasche werfen kann und fügt eine geworfene Flasche hinzu.
 */
  throwBottle() {
    if (this.keyboard && this.keyboard.D && this.character.bottles > 0) {
      this.character.throwBottle();
      const bottle = new ThrowableObject();
      this.throwableObjects.push(bottle);
    }
  }

  /**
 * Erstellt in regelmäßigen Abständen neue Flaschen an zufälligen Positionen im Level.
 */
  spawnBottle() {
    intervalIds.push( setInterval(() => {
        const randomX = 100 + Math.random() * 500;
        const newBottle = new Bottle(randomX);
        this.level.bottles.push(newBottle);
      }, 5000)
    );
  }

  /**
 * Überprüft, ob alle Gegner besiegt wurden. Falls ja, stoppt das Spiel
 * und zeigt den Gewinnbildschirm an.
 */
  checkWinCondition() {
    const remainingEnemies = this.level.enemies.filter((enemy) => !enemy.isDead);
    if (remainingEnemies.length === 0 && !winScreenDisplayed) {
      winScreenDisplayed = true;
      stopAllIntervals();
      let drawLoopId = requestAnimationFrame(() => {});
      cancelAnimationFrame(drawLoopId);
      document.getElementById("canvas").remove();
      document.getElementById("game-controls").remove();
      setTimeout(() => { showWinningScreen();
      }, 100);
    }
  }

  /**
 * Überprüft, ob der Spieler kein Leben mehr hat. Falls ja, wird das Spiel
 * gestoppt und der Game-Over-Bildschirm angezeigt.
 */
  checkGameOver() {
    if (this.character.energy <= 0 && !this.gameOverDisplayed) {
      this.gameOverDisplayed = true;
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
   * Zeichnet alle Spielobjekte auf das Canvas und aktualisiert den Frame.
   * Falls das Spiel pausiert oder gestoppt ist, wird das Zeichnen unterbrochen.
   */
  draw() {
    if (this.stopped) return;
    requestAnimationFrame(() => this.draw());
    if (gamePaused) {
    return;
    }
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.level.backgroundObject);
    this.ctx.translate(-this.camera_x, 0);
    // ------ Space for fixed objects ------ //
    this.addToMap(this.statusBar);
    this.addToMap(this.bottleBar);
    this.addToMap(this.coinBar);
    if (this.bossBar) {
      this.addToMap(this.bossBar);
    }
    this.ctx.translate(this.camera_x, 0);
    this.addToMap(this.character);
    this.addObjectsToMap(this.level.clouds);
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.level.bottles);
    this.addObjectsToMap(this.throwableObjects);
    this.addObjectsToMap(this.level.coins);
    this.ctx.translate(-this.camera_x, 0);
  }

  /**
   * Stops the rendering loop of the game.
   */
  stopDrawing() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  /**
   * Fügt eine Liste von Objekten zur Karte hinzu.
   * @param {Array<Object>} objects - Eine Liste von Objekten, die zur Karte hinzugefügt werden sollen.
   */
  addObjectsToMap(objects) {
    objects.forEach((o) => {
      this.addToMap(o);
    });
  }

  /**
   * Fügt ein einzelnes Objekt zur Karte hinzu und behandelt das Zeichnen, einschließlich Spiegelung.
   * @param {Object} mo - Das darzustellende Objekt.
   */
  addToMap(mo) {
    if (mo.otherDirection) {
      this.flipImage(mo);
    }

    mo.draw(this.ctx);
    mo.drawFrame(this.ctx);

    if (mo.otherDirection) {
      this.flipImageBack(mo);
    }
  }

  /**
   * Spiegelt das Objekt horizontal, indem die Zeichenfläche entsprechend transformiert wird.
   * @param {Object} mo - Das zu spiegelnde Objekt.
   */
  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
  }

  /**
   * Stellt das gespiegelte Objekt wieder zurück in seine ursprüngliche Position.
   * @param {Object} mo - Das Objekt, das zurückgesetzt wird.
   */
  flipImageBack(mo) {
    mo.x = mo.x * -1;
    this.ctx.restore();
  }
}
