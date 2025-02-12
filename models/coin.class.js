/**
 * Die `Coin`-Klasse repräsentiert eine sammelbare Münze im Spiel.
 * Sie kollidiert mit dem Charakter, wenn dieser sie berührt.
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
   * Enthält die Animationsbilder der Münze.
   * @type {string[]}
   */
  IMAGES_COIN = ["img/8_coin/coin_1.png", "img/8_coin/coin_2.png"];

  /**
   * Erstellt eine neue Instanz einer Münze.
   * Lädt das Bild und setzt die Position der Münze.
   *
   * @param {number} x - Die X-Position der Münze.
   */
  constructor(x) {
    super().loadImage("img/8_coin/coin_1.png");
    this.loadImages(this.IMAGES_COIN);
    this.x = x;
    this.y = this.y || 350;
  }

  /**
   * Hitbox-Offsets zur genauen Kollisionsberechnung.
   * @type {Object}
   * @property {number} top - Obere Offset-Anpassung
   * @property {number} left - Linke Offset-Anpassung
   * @property {number} right - Rechte Offset-Anpassung
   * @property {number} bottom - Untere Offset-Anpassung
   */
  offset = {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  };

  /**
   * Überprüft, ob die Münze mit einem anderen Objekt kollidiert.
   *
   * @param {MovableObject} mo - Das Objekt, mit dem die Kollision überprüft wird.
   * @returns {boolean} `true`, wenn eine Kollision erkannt wurde, sonst `false`.
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
