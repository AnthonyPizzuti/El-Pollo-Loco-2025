class Rendering {
  /**
   * Erstellt eine Rendering-Instanz für das Spiel.
   * @param {World} world - Die aktuelle Spielwelt.
   */
  constructor(world) {
    this.world = world;
    this.ctx = world.ctx;
    this.draw();
  }

  /**
   * Zeichnet das gesamte Spiel, einschließlich aller Objekte und Statusleisten.
   */
  draw() {
    if (this.world.stopped) return;
    requestAnimationFrame(() => this.draw());
    if (gamePaused) return;
    this.ctx.clearRect(0, 0, this.world.canvas.width, this.world.canvas.height);
    this.ctx.translate(this.world.camera_x, 0);
    this.addObjectsToMap(this.world.level.backgroundObject);
    this.ctx.translate(-this.world.camera_x, 0);
    // Feste UI-Elemente
    this.addToMap(this.world.statusBar);
    this.addToMap(this.world.bottleBar);
    this.addToMap(this.world.coinBar);
    if (this.world.bossBar) {
      this.addToMap(this.world.bossBar);
    }
    this.ctx.translate(this.world.camera_x, 0);
    this.addToMap(this.world.character);
    this.addObjectsToMap(this.world.level.clouds);
    this.addObjectsToMap(this.world.level.enemies);
    this.addObjectsToMap(this.world.level.bottles);
    this.addObjectsToMap(this.world.throwableObjects);
    this.addObjectsToMap(this.world.level.coins);
    this.ctx.translate(-this.world.camera_x, 0);
  }

  /**
   * Fügt mehrere Objekte zur Karte hinzu.
   * @param {Array} objects - Array von Objekten, die gezeichnet werden sollen.
   */
  addObjectsToMap(objects) {
    objects.forEach((o) => this.addToMap(o));
  }

  /**
   * Zeichnet ein einzelnes Objekt auf die Karte.
   * @param {MovableObject} mo - Das zu zeichnende Objekt.
   */
  addToMap(mo) {
    if (!mo) return;
    if (mo.otherDirection) {
      this.flipImage(mo);
    }

    mo.draw(this.ctx);
    mo.drawFrame(this.ctx);

    if (mo.otherDirection) {
      this.flipImageBack(mo);
    }
  }

  /**
   * Spiegelt das Bild für Links-Rechts-Bewegung.
   * @param {MovableObject} mo - Das zu spiegelnde Objekt.
   */
  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x *= -1;
  }

  /**
   * Stellt das gespiegelte Bild wieder richtig dar.
   * @param {MovableObject} mo - Das wiederherzustellende Objekt.
   */
  flipImageBack(mo) {
    mo.x *= -1;
    this.ctx.restore();
  }
}
