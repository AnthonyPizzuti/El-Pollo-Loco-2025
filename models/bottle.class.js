/**
 * Repräsentiert eine Flasche im Spiel, die der Spieler einsammeln kann.
 * Erbt von `DrawableObject`.
 */
class Bottle extends DrawableObject {
  height = 80;
  width = 40;
  y = 350;

    /**
   * Definiert die Hitbox-Versätze der Flasche für genauere Kollisionen.
   * @type {{ top: number, bottom: number, left: number, right: number }}
   */
  offset = {
    top: 5,
    bottom: 5,
    left: 5,
    right: 5,
  };

  /**
   * Speichert die Bildpfade der Flaschen-Sprites.
   * @type {string[]}
   */
  IMAGES_BOTTLE = [
    "img/6_salsa_bottle/1_salsa_bottle_on_ground.png",
    "img/6_salsa_bottle/2_salsa_bottle_on_ground.png",
  ];

   /**
   * Erstellt eine neue Flasche an einer bestimmten X-Position.
   *
   * @param {number} x - Die X-Koordinate der Flasche auf der Karte.
   */
  constructor(x) {
    super().loadImage("img/6_salsa_bottle/1_salsa_bottle_on_ground.png");
    this.loadImages(this.IMAGES_BOTTLE);
    this.x = x;
    this.y = this.y || 350;
  }
}
