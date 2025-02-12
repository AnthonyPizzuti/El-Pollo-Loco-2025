/**
 * Klasse `Cloud` repräsentiert eine Wolke im Spielhintergrund.
 * Die Wolken bewegen sich kontinuierlich nach links, um eine Parallax-Scrolling-Illusion zu erzeugen.
 *
 * @extends MovableObject
 */
class Cloud extends MovableObject {
  y = 20;
  height = 250;
  width = 500;
  speed = 0.2;

  /**
   * Erstellt eine neue Instanz einer Wolke.
   * Lädt das Bild für die Wolke und setzt eine zufällige X-Position.
   */
  constructor() {
    super().loadImage("img/5_background/layers/4_clouds/1.png");
    this.x = Math.random() * 500;
    this.animate();
  }

  /**
   * Startet die Animation der Wolke.
   * Die Wolke bewegt sich kontinuierlich nach links.
   */
  animate() {
    intervalIds.push(
      setInterval(() => {
        this.moveLeft();
      }, 1000 / 60)
    );
  }
}
