/**
 * Die `CoinBar`-Klasse repräsentiert die Statusleiste für gesammelte Münzen.
 * Sie zeigt den Fortschritt basierend auf dem aktuellen Münzbestand.
 *
 * @extends DrawableObject
 */
class CoinBar extends DrawableObject {
  /**
   * Enthält die verschiedenen Statusbilder für die Coin-Bar basierend auf dem Fortschritt.
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
   * Der aktuelle Fortschritt der Münzleiste in Prozent.
   * @type {number}
   */
  percentage = 0;

  /**
   * Erstellt eine neue Instanz der `CoinBar`-Klasse.
   * Lädt die Bilder für die Coin-Bar und setzt die Startposition sowie die Größe der Anzeige.
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
   * Aktualisiert die Statusleiste basierend auf dem aktuellen Münz-Fortschritt.
   *
   * @param {number} percentage - Der neue Fortschrittswert (zwischen 0 und 100).
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
