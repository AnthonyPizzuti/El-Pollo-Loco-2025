/**
 * Repräsentiert die Flaschen-Leiste im Spiel.
 * Zeigt an, wie viele Flaschen der Spieler gesammelt hat.
 * Erbt von `DrawableObject`.
 */
class BottleBar extends DrawableObject {
  /**
   * Enthält die Bildpfade für die verschiedenen Stufen der Flaschenanzeige.
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
   * Aktueller Prozentsatz der gesammelten Flaschen.
   * @type {number}
   */
  percentage = 0;

  /**
   * Erstellt eine neue Flaschen-Leiste mit Startwert 0.
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
   * Aktualisiert die Flaschen-Leiste basierend auf der Anzahl der gesammelten Flaschen.
   *
   * @param {number} percentage - Der neue Prozentsatz der Flaschen.
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
   * Bestimmt den Index des anzuzeigenden Bildes basierend auf der aktuellen Flaschenmenge.
   *
   * @returns {number} Der Index des Bildes aus `IMAGES_BOTTLE`.
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
