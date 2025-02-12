/**
 * Die `DrawableObject`-Klasse ist die Basisklasse für alle Objekte,
 * die auf dem Canvas gezeichnet werden können.
 */
class DrawableObject {
  img;
  imageCache = {};
  currentImage = 0;
  x = 120;
  y = 280;
  height = 150;
  width = 100;

  /**
   * Lädt ein einzelnes Bild für das Objekt.
   *
   * @param {string} path - Der Pfad zum Bild.
   */
  // loadImage('img/test.png);
  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  /**
   * Zeichnet das aktuelle Bild des Objekts auf das übergebene Canvas-Rendering-Context.
   *
   * @param {CanvasRenderingContext2D} ctx - Der Rendering-Kontext des Canvas.
   */
  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  /**
   * Zeichnet einen Rahmen um das Objekt (aktuell nicht implementiert).
   *
   * @param {CanvasRenderingContext2D} ctx - Der Rendering-Kontext des Canvas.
   */
  drawFrame(ctx) {}

  /**
   * Lädt mehrere Bilder in den `imageCache`, um sie später in Animationen zu verwenden.
   *
   * @param {string[]} arr - Ein Array von Bildpfaden.
   */
  loadImages(arr) {
    arr.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }
}
