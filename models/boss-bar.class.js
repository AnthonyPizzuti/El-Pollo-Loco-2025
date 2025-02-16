/**
 * Represents the boss's health bar.
 * Inherits from `DrawableObject` and updates based on the number of hits.
 */
class BossBar extends DrawableObject {

  /**
   * Contains the image paths for the different levels of the boss's health bar.
   * @type {string[]}
   */
    IMAGES_BOSS = [
      "img/7_statusbars/2_statusbar_endboss/green/green0.png",
      "img/7_statusbars/2_statusbar_endboss/green/green20.png",
      "img/7_statusbars/2_statusbar_endboss/green/green40.png",
      "img/7_statusbars/2_statusbar_endboss/green/green60.png",
      "img/7_statusbars/2_statusbar_endboss/green/green80.png",
      "img/7_statusbars/2_statusbar_endboss/green/green100.png"
    ];
  
   /**
   * Creates a new boss health bar and sets the initial values.
   */
    constructor() {
      super();
      this.loadImages(this.IMAGES_BOSS);
      this.x = 500;
      this.y = 60;
      this.width = 200;
      this.height = 60;
      this.percentage = 100;
      this.updateImage();
    }
  
 /**
   * Sets the boss's health bar based on the number of hits received.
   * @param {number} hits - The number of hits the boss has taken.
   */
    setPercentage(hits) {
      this.percentage = Math.max(0, 100 - hits * 20);
      this.updateImage();
    }
  
  /**
   * Chooses the appropriate image based on the current health percentage.
   */
    updateImage() {
      let index = Math.round(this.percentage / 20);
      index = Math.max(0, Math.min(index, this.IMAGES_BOSS.length - 1));
      this.img = this.imageCache[this.IMAGES_BOSS[index]];
    }
  }
  