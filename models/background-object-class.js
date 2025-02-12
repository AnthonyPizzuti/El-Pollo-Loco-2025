/**
 * Repräsentiert ein Hintergrundobjekt im Spiel.
 * Erbt von `MovableObject` und wird zur Darstellung des Hintergrunds verwendet.
 */
class BackgroundObject extends MovableObject {
  width = 720;
  height = 480;

  /**
   * Erstellt ein neues Hintergrundobjekt mit einem Bild und einer X-Position.
   *
   * @param {string} imagePath - Der Pfad zum Bild des Hintergrundobjekts.
   * @param {number} x - Die X-Koordinate des Hintergrundobjekts auf der Karte.
   */
  constructor(imagePath, x) {
    super().loadImage(imagePath);
    this.x = x;
    this.y = 480 - this.height;
  }
}
