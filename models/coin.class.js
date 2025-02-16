/**
 * Represents a collectible coin in the game.
 * It collides with the character when touched.
 *
 * @extends DrawableObject
 */
class Coin extends DrawableObject {
  height = 100;
  width = 100;
  y = 50;
  x = 250;
  isCollected = false;

  /**
   * Contains the animation images for the coin.
   * @type {string[]}
   */
  IMAGES_COIN = ["img/8_coin/coin_1.png", "img/8_coin/coin_2.png"];

  /**
   * Creates a new instance of a coin.
   * Loads the image and sets the coin's position.
   *
   * @param {number} x - The x-coordinate of the coin.
   */
  constructor(x) {
    super().loadImage("img/8_coin/coin_1.png");
    this.loadImages(this.IMAGES_COIN);
    this.x = x;
    this.y = this.y || 350;
  }

  /**
   * Hitbox offsets for precise collision detection.
   * @type {Object}
   * @property {number} top - Top offset adjustment
   * @property {number} left - Left offset adjustment
   * @property {number} right - Right offset adjustment
   * @property {number} bottom - Bottom offset adjustment
   */
  offset = {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  };

  /**
   * Checks if the coin collides with another object.
   *
   * @param {MovableObject} mo - The object to check collision with.
   * @returns {boolean} `true` if a collision is detected, otherwise `false`.
   */
  isColliding(mo) {
    if (!mo || mo.isDead) return false;
    let collision =
      this.x + this.width - this.offset.right > mo.x + mo.offset.left &&
      this.y + this.height - this.offset.bottom > mo.y + mo.offset.top &&
      this.x + this.offset.left < mo.x + mo.width - mo.offset.right &&
      this.y + this.offset.top < mo.y + mo.height - mo.offset.bottom;
    return collision;
  }
}
