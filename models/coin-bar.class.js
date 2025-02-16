/**
 * The `CoinBar` class represents the status bar for collected coins.
 * It displays the progress based on the current coin count.
 *
 * @extends DrawableObject
 */
class CoinBar extends DrawableObject {
 /**
   * Contains the various status images for the coin bar based on progress.
   * @type {string[]}
   */
  IMAGES_COIN = [
    "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/0.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/20.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/40.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/60.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/80.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/100.png",
  ];

  /**
   * The current progress of the coin bar in percentage.
   * @type {number}
   */
  percentage = 0;

  /**
   * Creates a new instance of the `CoinBar` class.
   * Loads the images for the coin bar and sets the initial position and size of the display.
   */
  constructor() {
    super();
    this.loadImages(this.IMAGES_COIN);
    this.setPercentage(0);
    this.x = 20;
    this.y = 50;
    this.width = 200;
    this.height = 60;
  }

  /**
   * Updates the status bar based on the current coin progress.
   *
   * @param {number} percentage - The new progress value (between 0 and 100).
   */
  setPercentage(percentage) {
    this.percentage = percentage;
    const index = Math.min(
      Math.floor(this.percentage / 20),
      this.IMAGES_COIN.length - 1
    );
    this.img = this.imageCache[this.IMAGES_COIN[index]];
  }
}
