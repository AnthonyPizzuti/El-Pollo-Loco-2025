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

  isColliding(mo) {
    if (!mo || mo.isDead) {
      return false;
    }
    const bufferX = 10;
    const bufferY = 20;
    return (
      this.x + this.width - bufferX > mo.x &&
      this.y + this.height - bufferY > mo.y - 20 &&
      this.x + bufferX < mo.x + mo.width &&
      this.y + bufferY < mo.y + mo.height + 20
    );
  }

  hit() {
    this.energy -= 5;
    if (this.energy < 0) {
      this.energy = 0;
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
}
