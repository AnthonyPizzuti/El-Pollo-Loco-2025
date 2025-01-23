class World {
  character = new Character();
  level = level1;
  canvas;
  ctx;
  keyboard;
  camera_x = 0;
  statusBar = new StatusBar();
  coinBar = new CoinBar();
  bottleBar = new BottleBar();
  bottle = new Bottle();
  coin = new Coin();
  throwableObjects = [];
  hit_Sound = new Audio("audio/hit.mp3");
  collectedBottles = 0;

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.draw();
    this.setWorld();
    this.run();
  }

  setWorld() {
    this.character.world = this;
  }

  run() {
    setInterval(() => {
      this.checkCollision();
      this.checkThrowObjects();
      this.checkBottleCollision();
      this.checkCoinCollision();
      this.checkBottleEnemyCollision();
    }, 200);
  }

  checkThrowObjects() {
    if (this.keyboard.D && this.collectedBottles > 0) {
      this.collectedBottles--;
      const percentage = Math.max(
        (this.collectedBottles / this.totalBottles) * 100,
        0
      );
      this.bottleBar.setPercentage(percentage);
      let bottle = new ThrowableObject(
        this.character.x + 100,
        this.character.y + 100
      );
      this.throwableObjects.push(bottle);
      bottle.playThrowSound();
    } else if (this.keyboard.D) {
    }
  }

  checkCollision() {
    this.level.enemies.forEach((enemy) => {
      if (this.character.isColliding(enemy)) {
        this.character.hit();
        this.statusBar.setPercentage(this.character.energy);
      if (this.character.isColliding(object)) {
          this.coinBar.setPercentage(this.character.coins);
          this.bottleBar.setPercentage(this.character.bottles);
        }
      }
    });
  }

  checkBottleEnemyCollision() {
    this.throwableObjects.forEach((bottle, bottleIndex) => {
      this.level.enemies.forEach((enemy) => {
        if (bottle.isColliding(enemy)) {
          this.throwableObjects.splice(bottleIndex, 1);
          if (enemy instanceof Chicken || enemy instanceof Littlechicken) {
            this.handleChickenCollision(enemy);
          } else if (enemy instanceof Endboss) {
            this.handleEndbossCollision(enemy);
          }
        }
      });
    });
  }

  handleChickenCollision(enemy) {
    if (!enemy.isDead) {
      enemy.isDead = true;
      enemy.img = enemy.imageCache[enemy.IMAGES_DEAD[0]];
      setTimeout(() => {
        const enemyIndex = this.level.enemies.indexOf(enemy);
        if (enemyIndex > -1) {
          this.level.enemies.splice(enemyIndex, 1);
        }
      }, 1000);
    }
  }

  handleEndbossCollision(enemy) {
    enemy.hits = (enemy.hits || 0) + 1;
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
        }
      }, 2000);
    }
  }

  checkBottleCollision() {
    this.level.bottles.forEach((bottle, index) => {
      console.log("Prüfe Flasche:", bottle);
      if (this.character.isColliding(bottle)) {
        console.log("Flasche erkannt:", bottle);
        this.collectBottle(); // Einsammeln
        this.level.bottles.splice(index, 1); // Entfernen
        console.log("Flasche entfernt.");
      }
    });
  }
  

  checkCoinCollision() {
    this.level.coins.forEach((coin, index) => {
      if (this.character.isColliding(coin) && coin instanceof Coin) {
        console.log("Objekt erkannt als: Münze", coin);
        this.collectCoin(); // Münze einsammeln
        this.level.coins.splice(index, 1); // Münze aus dem Level entfernen
      }
    });
  }

  collectCoin() {
    this.collectedCoins = (this.collectedCoins || 0) + 1;
    const percentage = Math.min(
      (this.collectedCoins / this.totalCoins) * 100,
      100
    );
    this.coinBar.setPercentage(percentage);
  }

  collectBottle() {
    this.collectedBottles = (this.collectedBottles || 0) + 1; // Anzahl erhöhen
    const percentage = Math.min(
      (this.collectedBottles / this.totalBottles) * 100,
      100
    );
    this.bottleBar.setPercentage(percentage); // Aktualisiere die BottleBar
    console.log("BottleBar aktualisiert:", percentage + "%");
  }

  throwBottle() {
    if (this.collectedBottles > 0) {
      this.collectedBottles--;
      const percentage = Math.max(
        (this.collectedBottles / this.totalBottles) * 100,
        0
      );
      this.bottleBar.setPercentage(percentage);
      let bottle = new ThrowableObject(
        this.character.x + 100,
        this.character.y + 100
      );
      this.throwableObjects.push(bottle);
    } else {
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.level.backgroundObject);

    this.ctx.translate(-this.camera_x, 0);
    // ------ Space for fixed objects ------ //
    this.addToMap(this.statusBar);
    this.addToMap(this.coinBar);
    this.addToMap(this.bottleBar);
    this.ctx.translate(this.camera_x, 0);

    this.addToMap(this.character);
    this.addObjectsToMap(this.level.clouds);
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.throwableObjects);
    this.addObjectsToMap(this.level.coins);
    this.addObjectsToMap(this.level.bottles);

    this.ctx.translate(-this.camera_x, 0);

    // Draw() wird immer wieder aufgerufen
    let self = this;
    requestAnimationFrame(function () {
      self.draw();
    });
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
