/**
 * Represents the rendering engine for the game.
 * Responsible for drawing the entire game, including all objects and UI elements.
 */
class Rendering {

  /**
   * Creates a Rendering instance for the game.
   * @param {World} world - The current game world.
   */
  constructor(world) {
    this.world = world;
    this.ctx = world.ctx;
    this.draw();
  }

   /**
   * Draws the entire game, including all objects and status bars.
   */
  draw() {
    if (this.world.stopped) return;
    requestAnimationFrame(() => this.draw());
    if (gamePaused) return;
    this.ctx.clearRect(0, 0, this.world.canvas.width, this.world.canvas.height);
    this.ctx.translate(this.world.camera_x, 0);
    this.addObjectsToMap(this.world.level.backgroundObject);
    this.ctx.translate(-this.world.camera_x, 0);
    // Feste UI-Elemente
    this.addToMap(this.world.statusBar);
    this.addToMap(this.world.bottleBar);
    this.addToMap(this.world.coinBar);
    if (this.world.bossBar) {
      this.addToMap(this.world.bossBar);
    }
    this.ctx.translate(this.world.camera_x, 0);
    this.addToMap(this.world.character);
    this.addObjectsToMap(this.world.level.clouds);
    this.addObjectsToMap(this.world.level.enemies);
    this.addObjectsToMap(this.world.level.bottles);
    this.addObjectsToMap(this.world.throwableObjects);
    this.addObjectsToMap(this.world.level.coins);
    this.ctx.translate(-this.world.camera_x, 0);
  }

  /**
   * Adds multiple objects to the map.
   * @param {Array} objects - An array of objects to be drawn.
   */
  addObjectsToMap(objects) {
    objects.forEach((o) => this.addToMap(o));
  }

 /**
   * Draws a single object on the map.
   * @param {MovableObject} mo - The object to be drawn.
   */
  addToMap(mo) {
    if (!mo) return;
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
   * Flips the image horizontally for left-right movement.
   * @param {MovableObject} mo - The object whose image is to be flipped.
   */
  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x *= -1;
  }

  /**
   * Restores the flipped image to its original orientation.
   * @param {MovableObject} mo - The object whose image is to be restored.
   */
  flipImageBack(mo) {
    mo.x *= -1;
    this.ctx.restore();
  }
}
