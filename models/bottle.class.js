/**
 * Represents a bottle in the game that the player can collect.
 * Inherits from `DrawableObject`.
 */
class Bottle extends DrawableObject {
  height = 80;
  width = 40;
  y = 350;

 /**
   * Defines the hitbox offsets for more precise collision detection.
   * @type {{ top: number, bottom: number, left: number, right: number }}
   */
  offset = {
    top: 5,
    bottom: 5,
    left: 5,
    right: 5,
  };

  /**
   * Stores the image paths for the bottle sprites.
   * @type {string[]}
   */
  IMAGES_BOTTLE = [
    "img/6_salsa_bottle/1_salsa_bottle_on_ground.png",
    "img/6_salsa_bottle/2_salsa_bottle_on_ground.png",
  ];

  /**
   * Creates a new bottle at a specified x-coordinate.
   *
   * @param {number} x - The x-coordinate of the bottle on the map.
   */
  constructor(x) {
    super().loadImage("img/6_salsa_bottle/1_salsa_bottle_on_ground.png");
    this.loadImages(this.IMAGES_BOTTLE);
    this.x = x;
    this.y = this.y || 350;
  }
}
