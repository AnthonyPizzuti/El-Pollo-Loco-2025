/**
 * Represents a background object in the game.
 * Inherits from `MovableObject` and is used for rendering the background.
 */
class BackgroundObject extends MovableObject {
  width = 720;
  height = 480;

/**
 * Creates a new background object with an image and an x-coordinate.
 *
 * @param {string} imagePath - The path to the background object's image.
 * @param {number} x - The x-coordinate of the background object on the map.
 */
  constructor(imagePath, x) {
    super().loadImage(imagePath);
    this.x = x;
    this.y = 480 - this.height;
  }
}
