/**
 * Repräsentiert die Lebensanzeige des Endbosses.
 * Erbt von `DrawableObject` und aktualisiert sich je nach Trefferanzahl.
 */
class BossBar extends DrawableObject {

      /**
   * Enthält die Bildpfade für die verschiedenen Stufen der Lebensanzeige des Bosses.
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
   * Erstellt eine neue Boss-Lebensanzeige und setzt die Startwerte.
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
     * Setzt die Lebensanzeige des Bosses.
     * @param {number} hits - Anzahl der Treffer, die der Boss erhalten hat.
     */
    setPercentage(hits) {
      this.percentage = Math.max(0, 100 - hits * 20);
      this.updateImage();
    }
  
    /**
     * Wählt das richtige Bild basierend auf der Lebensanzeige.
     */
    updateImage() {
      let index = Math.round(this.percentage / 20);
      index = Math.max(0, Math.min(index, this.IMAGES_BOSS.length - 1));
      this.img = this.imageCache[this.IMAGES_BOSS[index]];
    }
  }
  