/**
 * Represents the bottle bar in the game.
 * Displays the number of bottles the player has collected.
 * Inherits from `DrawableObject`.
 */
class BottleBar extends DrawableObject {

 /**
   * Contains the image paths for the various levels of the bottle indicator.
   * @type {string[]}
   */
  IMAGES_BOTTLE = [
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/0.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/20.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/40.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/60.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/80.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/100.png",
  ];

/**
   * The current percentage of collected bottles.
   * @type {number}
   */
  percentage = 0;

 /**
   * Creates a new bottle bar with an initial value of 0.
   */
  constructor() {
    super();
    this.loadImages(this.IMAGES_BOTTLE);
    this.setPercentage(0);
    this.x = 20;
    this.y = 100;
    this.width = 200;
    this.height = 60;
  }

 /**
   * Updates the bottle bar based on the number of collected bottles.
   *
   * @param {number} percentage - The new percentage of bottles.
   */
  setPercentage(percentage) {
    this.percentage = percentage;
    const index = Math.min(
      Math.floor(this.percentage / 6),
      this.IMAGES_BOTTLE.length - 1
    );
    this.img = this.imageCache[this.IMAGES_BOTTLE[index]];
  }

  /**
   * Determines the index of the image to display based on the current bottle count.
   *
   * @returns {number} The index of the image from `IMAGES_BOTTLE`.
   */
  resolveImageIndex() {
    if (this.percentage == 100) {
      return 5;
    } else if (this.percentage > 20) {
      return 4;
    } else if (this.percentage > 40) {
      return 3;
    } else if (this.percentage > 60) {
      return 2;
    } else if (this.percentage > 80) {
      return 1;
    } else {
      return 0;
    }
  }
}
