/**
 * Repräsentiert ein bewegliches Objekt im Spiel.
 * Erbt von `DrawableObject` und implementiert Funktionen zur Bewegung und Kollisionserkennung.
 */
class MovableObject extends DrawableObject {
  speed = 0.2;
  otherDirection = false;
  speedY = 0;
  acceleration = 2.5;
  energy = 100;
  lastHit = 0;

  /**
   * Wendet die Schwerkraft auf das Objekt an.
   * Falls das Objekt sich über dem Boden befindet, wird die y-Position angepasst.
   */
  applyGravity() {
    intervalIds.push(
      setInterval(() => {
        if (this instanceof ThrowableObject) {
          this.y = this.y >= 400 ? 400 : this.y - this.speedY;
          this.speedY =
            this.y >= 400 ? 0 : this.speedY - this.acceleration * 0.7;
        } else if (this.isAboveGround() || this.speedY > 0) {
          this.y -= this.speedY;
          this.speedY -= this.acceleration;
        }
      }, 1000 / 30)
    );
  }

  /**
   * Überprüft, ob sich das Objekt über dem Boden befindet.
   * @returns {boolean} `true`, wenn das Objekt über dem Boden ist, sonst `false`.
   */
  isAboveGround() {
    if (this instanceof ThrowableObject) {
      return this.y < 150;
    } else {
      return this.y < 150;
    }
  }

  /**
   * Hitbox-Offsets für genauere Kollisionserkennung.
   * @type {{top: number, left: number, right: number, bottom: number}}
   */
  offset = {
    top: 5,
    left: 5,
    right: 10,
    bottom: 10,
  };

  /**
   * Überprüft, ob das Objekt mit einem anderen `MovableObject` kollidiert.
   * @param {MovableObject} mo - Das zu überprüfende Objekt.
   * @returns {boolean} `true`, wenn eine Kollision stattfindet, sonst `false`.
   */
  isColliding(mo) {
    if (!mo || mo.isDead) return false;
    return (
      this.x + this.width - this.offset.right > mo.x + mo.offset.left &&
      this.x + this.offset.left < mo.x + mo.width - mo.offset.right &&
      this.y + this.height - this.offset.bottom > mo.y + mo.offset.top &&
      this.y + this.offset.top < mo.y + mo.height - mo.offset.bottom
    );
  }

  /**
   * Reduziert die Energie des Objekts bei einem Treffer.
   * Falls die Energie unter 0 fällt, wird `gameOver()` aufgerufen.
   */
  hit() {
    if (this.isHurt()) return; 
    this.energy -= 5;
    if (this.energy < 0) {
      this.energy = 0;
      gameOver();
    } else {
      this.lastHit = new Date().getTime();
    }
  }

  /**
   * Überprüft, ob das Objekt kürzlich getroffen wurde.
   * @returns {boolean} `true`, wenn das Objekt innerhalb einer Sekunde nach dem Treffer unverwundbar ist.
   */
  isHurt() {
    let timepassed = new Date().getTime() - this.lastHit; // Difference in ms
    timepassed = timepassed
    return timepassed < 200;
  }

  /**
   * Überprüft, ob das Objekt gestorben ist (Energie == 0).
   * @returns {boolean} `true`, wenn das Objekt tot ist, sonst `false`.
   */
  isDead() {
    return this.energy == 0;
  }

  /**
   * Spielt eine Animation, indem die Bildquelle des Objekts geändert wird.
   * @param {string[]} images - Ein Array mit den Bildpfaden für die Animation.
   */
  playAnimation(images) {
    let i = this.currentImage % images.length;
    let path = images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }

  /**
   * Bewegt das Objekt nach rechts.
   */
  moveRight() {
    this.x += this.speed;
  }

  /**
   * Bewegt das Objekt nach links.
   */
  moveLeft() {
    this.x -= this.speed;
  }

  /**
   * Lässt das Objekt springen, indem die vertikale Geschwindigkeit gesetzt wird.
   */
  jump() {
    this.speedY = 30;
  }

  /**
   * Setzt die Welt des Objekts, falls noch nicht gesetzt.
   * @param {World} world - Die Welt, in der sich das Objekt befindet.
   */
  setWorld(world) {
    if (!this.world) {
      this.world = world;
    }
  }
}
