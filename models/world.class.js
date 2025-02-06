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

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.bottleBar = new BottleBar();
    this.bottleBar.setPercentage(0);
    this.coinBar = new CoinBar();
    this.coinBar.setPercentage(0);
    this.spawnBottle();
    this.draw();
    this.setWorld();
    this.run();
    registerSound(this.hit_Sound);
    registerSound(this.bottle_sound);
    registerSound(this.coin_sound);
    registerSound(this.endboss_sound);
  }

  setWorld() {
    this.character.world = this;
  }

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

  startGameLoop() {
    if (this.gameLoopActive) return; // Verhindert doppeltes Starten der Schleife
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

  checkAllSmallEnemiesDead() {
    const remainingSmallEnemies = this.level.enemies.filter(
      (enemy) =>
        (enemy instanceof Chicken || enemy instanceof Littlechicken) &&
        !enemy.isDead
    );
    if (remainingSmallEnemies.length === 0 && !this.endbossSpawned) {
      this.spawnEndboss();
    }
  }

  spawnEndboss() {
    const endboss = new Endboss();
    this.level.enemies.push(endboss);
    this.endbossSpawned = true;
    this.endboss_sound.play();
    this.endboss_sound.volume = 0.5;
    this.endboss_sound.loop = true;
    this.bossBar = new BossBar();
  }

  checkCollision() {
    this.level.enemies.forEach((enemy) => {
      if (
        !enemy.isDead &&
        enemy.y > 0 &&
        enemy.x + enemy.width > 0 &&
        this.character.isColliding(enemy)
      ) {
        this.character.hit();
        this.statusBar.setPercentage(this.character.energy);
      }
    });
  }

  checkCollisionBottle() {
    this.level.bottles.forEach((bottle, index) => {
      if (this.character.isColliding(bottle)) {
        this.bottle_sound.play();
        this.level.bottles.splice(index, 1);
        this.character.collectBottle();
      }
    });
  }

  checkCollisionCoin() {
    this.level.coins.forEach((coin, index) => {
      if (this.character.isColliding(coin)) {
        this.coin_sound.play();
        this.level.coins.splice(index, 1);
        this.character.collectCoin();
      }
    });
  }

  checkBottleEnemyCollision() {
    this.throwableObjects.forEach((bottle, bottleIndex) => {
      this.level.enemies.forEach((enemy) => {
        if (!bottle.isColliding(enemy) || bottle.hasHitGround) return;
        bottle.hasHitGround = true;
        bottle.playSplashAnimation();
        if (enemy instanceof Endboss) {
          this.handleEndbossCollision(enemy);
        } else {
          enemy instanceof Chicken || enemy instanceof Littlechicken
            ? this.handleChickenCollision(enemy)
            : null;
        }
        setTimeout(() => this.throwableObjects.splice(bottleIndex, 1), 600);
      });
    });
  }

  handleChickenCollision(enemy) {
    if (!enemy.isDead) {
      enemy.isDead = true;
      enemy.img = enemy.imageCache[enemy.IMAGES_DEAD[0]];
      setTimeout(() => {
        const index = this.level.enemies.indexOf(enemy);
        if (index > -1) {
          this.level.enemies.splice(index, 1);
        }
      }, 1000);
    }
  }

  handleEndbossCollision(enemy) {
    enemy.hits = (enemy.hits || 0) + 1;
    if (this.bossBar) {
      this.bossBar.setPercentage(enemy.hits);
    }
    if (enemy.hits === 3) {
      enemy.img = enemy.imageCache[enemy.IMAGES_HURT[0]];
      enemy.playAnimation(enemy.IMAGES_HURT);
    }
    if (enemy.hits >= 7) {
      enemy.isDead = true;
      enemy.img = enemy.imageCache[enemy.IMAGES_DEAD[0]];
      enemy.playAnimation(enemy.IMAGES_DEAD);
      setTimeout(() => {
        const enemyIndex = this.level.enemies.indexOf(enemy);
        if (enemyIndex > -1) {
          this.level.enemies.splice(enemyIndex, 1);
          this.endboss_sound.pause();
        }
      }, 1000);
    }
  }

  collectCoin() {
    this.coins += 1;
    const percentage = Math.min((this.coins / this.totalCoins) * 100, 100);
    this.world.coinBar.setPercentage(percentage);
  }

  collectBottle() {
    this.bottles += 1;
    const percentage = Math.min((this.bottles / this.totalBottles) * 100, 100);
    this.world.bottleBar.setPercentage(percentage);
  }

  throwBottle() {
    if (this.keyboard && this.keyboard.D && this.character.bottles > 0) {
      this.character.throwBottle();
      const bottle = new ThrowableObject(
        this.character.x + 100,
        this.character.y + 100
      );
      this.throwableObjects.push(bottle);
    }
  }

  spawnBottle() {
    intervalIds.push(
      setInterval(() => {
        const randomX = 100 + Math.random() * 500;
        const newBottle = new Bottle(randomX);
        this.level.bottles.push(newBottle);
      }, 5000)
    );
  }

  checkWinCondition() {
    const remainingEnemies = this.level.enemies.filter(
      (enemy) => !enemy.isDead
    );
    if (remainingEnemies.length === 0 && !winScreenDisplayed) {
      winScreenDisplayed = true;
      stopAllIntervals();
      let drawLoopId = requestAnimationFrame(() => {});
      cancelAnimationFrame(drawLoopId);
      document.getElementById("canvas").remove();
      document.getElementById("game-controls").remove();
      setTimeout(() => {
        showWinningScreen();
      }, 100);
    }
  }

  checkGameOver() {
    if (this.character.energy <= 0 && !this.gameOverDisplayed) {
      this.gameOverDisplayed = true;
      stopAllIntervals();
      let drawLoopId = requestAnimationFrame(() => {});
      cancelAnimationFrame(drawLoopId);
      document.getElementById("canvas")?.remove();
      document.getElementById("game-controls")?.remove();
      setTimeout(() => {
        showGameOverScreen();
      }, 100);
    }
  }

  draw() {
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

  addObjectsToMap(objects) {
    objects.forEach((o) => {
      this.addToMap(o);
    });
  }

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

  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
  }

  flipImageBack(mo) {
    mo.x = mo.x * -1;
    this.ctx.restore();
  }
}
