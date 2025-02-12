class MovableObject extends DrawableObject {
  speed = 0.2;
  otherDirection = false;
  speedY = 0;
  acceleration = 2.5;
  energy = 100;
  lastHit = 0;

  applyGravity() {
    intervalIds.push(
      setInterval(() => {
        if (this instanceof ThrowableObject) {
          if (this.y >= 400) {
            this.y = 400;
            this.speedY = 0;
          } else {
            this.y -= this.speedY;
            this.speedY -= this.acceleration * 0.3;
          }
        } else {
          if (this.isAboveGround() || this.speedY > 0) {
            this.y -= this.speedY;
            this.speedY -= this.acceleration;
          }
        }
      }, 1000 / 25)
    );
  }

  isAboveGround() {
    if (this instanceof ThrowableObject) {
      return this.y < 150;
    } else {
      return this.y < 150;
    }
  }

  offset = {
    top: 5,
    left: 5,
    right: 10,
    bottom: 10,
  };

  isColliding(mo) {
    if (!mo || mo.isDead) return false;

    return (
      this.x + this.width - this.offset.right > mo.x + mo.offset.left &&
      this.x + this.offset.left < mo.x + mo.width - mo.offset.right &&
      this.y + this.height - this.offset.bottom > mo.y + mo.offset.top &&
      this.y + this.offset.top < mo.y + mo.height - mo.offset.bottom
    );
  }

  hit() {
    this.energy -= 5;
    if (this.energy < 0) {
      this.energy = 0;
      gameOver();
    } else {
      this.lastHit = new Date().getTime();
    }
  }

  isHurt() {
    let timepassed = new Date().getTime() - this.lastHit; // Difference in ms
    timepassed = timepassed / 1000; // Difference in s
    return timepassed < 1;
  }

  isDead() {
    return this.energy == 0;
  }

  playAnimation(images) {
    let i = this.currentImage % images.length;
    let path = images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }

  moveRight() {
    this.x += this.speed;
  }

  moveLeft() {
    this.x -= this.speed;
  }

  jump() {
    this.speedY = 30;
  }

  setWorld(world) {
    if (!this.world) {
        this.world = world;
        console.log(`🌍 Welt zugewiesen an ${this.constructor.name} bei (${this.x}, ${this.y})`);
    }
}
}
