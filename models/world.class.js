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

  setLevel(level) {
    console.log("♻️ Setze Level zurück...");
    this.level = level;
    this.level.enemies = [...level.enemies]; // ✅ Kopiert nur die Originalgegner
    this.initializeEnemies();
  }

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

  assignWorldToEnemies() {
    console.log("🔄 Weisen Gegnern die Welt zu...");
    if (!this.enemiesAssigned) {
      // ✅ Verhindert mehrfaches Ausführen
      this.level.enemies.forEach((enemy) => {
        if (!enemy.world) {
          enemy.setWorld(this);
        }
      });
      this.enemiesAssigned = true;
    }
  }

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
      if (enemy.isDead) return;
      if (this.character.isColliding(enemy)) {
        this.character.hit();
        console.log(this.character, enemy);
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
      if (bottle.hasHitGround) return;
      for (let i = 0; i < this.level.enemies.length; i++) {
        let enemy = this.level.enemies[i];
        if (!enemy.isDead && bottle.isColliding(enemy)) {
          if (enemy instanceof Endboss) {
            this.handleEndbossCollision(enemy);
          } else {
            this.handleChickenCollision(enemy);
          }
          bottle.hasHitGround = true;
          this.throwableObjects.splice(bottleIndex, 1);
          return;
        }
      }
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
    this.bossBar?.setPercentage(enemy.hits);
    if (enemy.hits === 3) {
      enemy.img = enemy.imageCache[enemy.IMAGES_HURT[0]];
      enemy.playAnimation(enemy.IMAGES_HURT);
    }
    if (enemy.hits >= 7) {
      enemy.isDead = true;
      enemy.img = enemy.imageCache[enemy.IMAGES_DEAD[0]];
      enemy.playAnimation(enemy.IMAGES_DEAD);
      setTimeout(() => {
        let i = this.level.enemies.indexOf(enemy);
        if (i > -1) this.level.enemies.splice(i, 1), this.endboss_sound.pause();
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
      const bottle = new ThrowableObject();
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

    this.level.enemies.forEach((enemy) => {
      let isCollidingWithCharacter = this.character.isColliding(enemy);

      // 🔵 Äußere Umrandung (Gesamte Objektgröße)
      this.ctx.strokeStyle = isCollidingWithCharacter ? "green" : "blue";
      this.ctx.lineWidth = 2;
      this.ctx.strokeRect(enemy.x, enemy.y, enemy.width, enemy.height);

      // 🔴 Innere Umrandung (angepasste Hitbox)
      if (enemy.offset) {
        // ✅ Sicherstellen, dass `offset` existiert
        this.ctx.strokeStyle = "orange"; // 🔥 Innere Hitbox-Umrandung
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(
          enemy.x + enemy.offset.left,
          enemy.y + enemy.offset.top,
          enemy.width - enemy.offset.right,
          enemy.height - enemy.offset.bottom
        );
      }
    });

    // 🔥 Überprüfe, ob der Charakter mit einem Gegner kollidiert
    let isCharacterColliding = this.level.enemies.some((enemy) =>
      this.character.isColliding(enemy)
    );

    // 🟥 Äußere Umrandung des Charakters (Standard)
    this.ctx.strokeStyle = isCharacterColliding ? "yellow" : "red";
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(
      this.character.x,
      this.character.y,
      this.character.width,
      this.character.height
    );

    // 🟠 Innere Umrandung des Charakters (angepasste Hitbox)
    if (this.character.offset) {
      // ✅ Sicherstellen, dass `offset` existiert
      this.ctx.strokeStyle = "purple"; // 🔥 Charakter Innere Hitbox-Umrandung
      this.ctx.lineWidth = 2;
      this.ctx.strokeRect(
        this.character.x + this.character.offset.left,
        this.character.y + this.character.offset.top,
        this.character.width - this.character.offset.right,
        this.character.height - this.character.offset.bottom
      );
    }

    this.addObjectsToMap(this.level.coins);

    this.ctx.translate(-this.camera_x, 0);
  }

  stopDrawing() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
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
