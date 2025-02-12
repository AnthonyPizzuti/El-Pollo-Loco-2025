/**
 * Die StatusBar zeigt die Lebensenergie des Spielers an.
 * Sie wechselt zwischen verschiedenen Bildern, um den aktuellen Gesundheitszustand darzustellen.
 */
class StatusBar extends DrawableObject {
  /**
   * Array mit Bildpfaden für die verschiedenen Statusanzeigen der Lebensleiste.
   * @type {string[]}
   */
  IMAGES = [
    "img/7_statusbars/1_statusbar/2_statusbar_health/green/0.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/green/20.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/green/40.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/green/60.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/green/80.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/green/100.png",
  ];

  /**
   * Prozentuale Lebensanzeige des Spielers.
   * Wertebereich: 0 - 100%.
   * @type {number}
   */
  percentage = 100;

  /**
   * Erstellt eine neue Instanz der StatusBar.
   * Setzt die Position, Größe und lädt die entsprechenden Bilder.
   */
  constructor() {
    super();
    this.loadImages(this.IMAGES);
    this.x = 20;
    this.y = 0;
    this.width = 200;
    this.height = 60;
    this.setPercentage(100);
  }

  /**
   * Setzt die aktuelle Prozentzahl der Lebensanzeige und aktualisiert das Bild entsprechend.
   * @param {number} percentage - Die neue Prozentzahl der Lebensleiste.
   */
  setPercentage(percentage) {
    this.percentage = percentage;
    let path = this.IMAGES[this.resolveImageIndex()];
    this.img = this.imageCache[path];
  }

  /**
   * Bestimmt den Index des Statusbildes basierend auf der aktuellen Lebensanzeige.
   * @returns {number} Der Index des Bildes im `IMAGES`-Array.
   */
  resolveImageIndex() {
    if (this.percentage == 100) {
      return 5;
    } else if (this.percentage > 80) {
      return 4;
    } else if (this.percentage > 60) {
      return 3;
    } else if (this.percentage > 40) {
      return 2;
    } else if (this.percentage > 20) {
      return 1;
    } else {
      return 0;
    }
  }
}
