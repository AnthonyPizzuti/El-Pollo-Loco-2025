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
  }

  setWorld() {
    this.character.world = this;
  }

  run() {
    setInterval(() => {
      this.checkCollision();
      this.throwBottle();
      this.checkCollisionCoin();
      this.checkCollisionBottle();
      this.checkBottleEnemyCollision();
    }, 200);
  }

  checkCollision() {
    this.level.enemies.forEach((enemy) => {
      if (
        !enemy.isDead &&
        enemy.x + enemy.width > 0 &&
        this.character.isColliding(enemy)
      ) {
        console.log("Kollision mit lebendem Gegner:", enemy);
        this.character.hit();
        this.statusBar.setPercentage(this.character.energy);
        if (!this.character.isDead) {
          this.hit_Sound.play();
        }
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
          console.log("Chicken aus dem Level entfernt:", enemy);
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
    setInterval(() => {
      const randomX = 100 + Math.random() * 500;
      const newBottle = new Bottle(randomX);
      this.level.bottles.push(newBottle);
    }, 5000);
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.level.backgroundObject);

    this.ctx.translate(-this.camera_x, 0);
    // ------ Space for fixed objects ------ //
    this.addToMap(this.statusBar);
    this.addToMap(this.bottleBar);
    this.addToMap(this.coinBar);
    this.ctx.translate(this.camera_x, 0);

    this.addToMap(this.character);
    this.addObjectsToMap(this.level.clouds);
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.level.bottles);
    this.addObjectsToMap(this.throwableObjects);
    this.addObjectsToMap(this.level.coins);

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
