/**
 * Represents a movable object in the game.
 * Inherits from `DrawableObject` and implements functions for movement and collision detection.
 */
class MovableObject extends DrawableObject {
  speed = 0.2;
  otherDirection = false;
  speedY = 0;
  acceleration = 2.5;
  energy = 100;
  lastHit = 0;

  /**
   * Applies gravity to the object.
   * If the object is above the ground, its y-position is adjusted.
   */
  applyGravity() {
    intervalIds.push(
      setInterval(() => {
        if (this instanceof ThrowableObject) {
          this.y = this.y >= 400 ? 400 : this.y - this.speedY;
          this.speedY =
            this.y >= 400 ? 0 : this.speedY - this.acceleration * 0.7;
        } else if (this.isAboveGround() || this.speedY > 0) {
          this.y -= this.speedY;
          this.speedY -= this.acceleration;
        }
      }, 1000 / 30)
    );
  }

  /**
   * Checks whether the object is above the ground.
   * @returns {boolean} `true` if the object is above the ground, otherwise `false`.
   */
  isAboveGround() {
    if (this instanceof ThrowableObject) {
      return this.y < 150;
    } else {
      return this.y < 150;
    }
  }

  /**
   * Hitbox offsets for more precise collision detection.
   * @type {{top: number, left: number, right: number, bottom: number}}
   */
  offset = {
    top: 5,
    left: 5,
    right: 10,
    bottom: 10,
  };

  /**
   * Checks whether the object collides with another `MovableObject`.
   * @param {MovableObject} mo - The object to check collision with.
   * @returns {boolean} `true` if a collision occurs, otherwise `false`.
   */
  isColliding(mo) {
    if (!mo || mo.isDead) return false;
    return (
      this.x + this.width - this.offset.right > mo.x + mo.offset.left &&
      this.x + this.offset.left < mo.x + mo.width - mo.offset.right &&
      this.y + this.height - this.offset.bottom > mo.y + mo.offset.top &&
      this.y + this.offset.top < mo.y + mo.height - mo.offset.bottom
    );
  }

  /**
   * Reduces the object's energy when hit.
   * If the energy falls below 0, `gameOver()` is called.
   */
  hit() {
    if (this.isHurt()) return; 
    this.energy -= 5;
    if (this.energy < 0) {
      this.energy = 0;
      gameOver();
    } else {
      this.lastHit = new Date().getTime();
    }
  }

  /**
   * Checks if the object was hit recently.
   * @returns {boolean} `true` if the object is invulnerable within one second after being hit.
   */
  isHurt() {
    let timepassed = new Date().getTime() - this.lastHit; // Difference in ms
    timepassed = timepassed
    return timepassed < 200;
  }

  /**
   * Checks if the object is dead (energy == 0).
   * @returns {boolean} `true` if the object is dead, otherwise `false`.
   */
  isDead() {
    return this.energy == 0;
  }

  /**
   * Plays an animation by changing the object's image source.
   * @param {string[]} images - An array of image paths for the animation.
   */
  playAnimation(images) {
    let i = this.currentImage % images.length;
    let path = images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }

/**
   * Moves the object to the right.
   */
  moveRight() {
    this.x += this.speed;
  }

/**
   * Moves the object to the left.
   */
  moveLeft() {
    this.x -= this.speed;
  }

   /**
   * Makes the object jump by setting its vertical speed.
   */
  jump() {
    this.speedY = 30;
  }

 /**
   * Sets the world of the object if not already set.
   * @param {World} world - The world in which the object resides.
   */
  setWorld(world) {
    if (!this.world) {
      this.world = world;
    }
  }
}
