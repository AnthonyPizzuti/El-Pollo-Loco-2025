/**
 * Klasse `Chicken` repräsentiert einen gegnerischen Charakter (Huhn) im Spiel.
 * Erbt von `MovableObject` und kann sich nach links bewegen, Animationen abspielen
 * und sterben, wenn er getroffen wird.
 *
 * @extends MovableObject
 */
class Chicken extends MovableObject {
  y = 330;
  height = 100;
  isDead = false;
  deadSoundPlayed = false;

  /**
   * Offset-Werte für die Kollisionserkennung des Chickens.
   * @type {Object}
   */
  offset = {
    top: 2,
    bottom: 2,
    left: 5,
    right: 5,
  };

  /**
   * Bildpfade für die Lauf-Animation des Chickens.
   * @type {string[]}
   */
  IMAGES_WALKING = [
    "img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
  ];

  /**
   * Bildpfad für das tote Chicken.
   * @type {string[]}
   */
  IMAGES_DEAD = ["img/3_enemies_chicken/chicken_normal/2_dead/dead.png"];

  /**
   * Sound für das lebendige Chicken.
   * @type {HTMLAudioElement}
   */
  chicken_sound = new Audio("audio/chicken.mp3");
  chicken_dead_sound = new Audio("audio/chicken_dead.mp3");

  /**
   * Erstellt eine neue Instanz eines Chickens.
   * Lädt Bilder, setzt eine zufällige Position und Geschwindigkeit, registriert Sounds
   * und startet die Animation.
   *
   * @param {World} world - Die Spielwelt, zu der das Chicken gehört.
   */
  constructor(world) {
    super().loadImage("img/3_enemies_chicken/chicken_normal/1_walk/1_w.png");
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_DEAD);
    this.x = Math.max(300, 1000 + Math.random() * 500);
    this.speed = 0.2 + Math.random() * 0.3;
    this.animate();
    registerSound(this.chicken_sound);
    registerSound(this.chicken_dead_sound);
  }

  /**
   * Startet die Bewegung und Animation des Chickens.
   * Das Chicken bewegt sich nach links, spielt Lauf-Animationen ab
   * und stoppt, wenn es stirbt.
   */
  animate() {
    let movementInterval = setInterval(() => {
      if (!this.isDead) {
        this.moveLeft();
        if (!this.chicken_sound.playing) {
          this.chicken_sound.play();
        }
        this.chicken_sound.volume = 0.02;
      } else {
        this.chicken_sound.pause();
      }
    }, 1000 / 60);

    let animationInterval = setInterval(() => {
      if (this.isDead) {
        this.playAnimation(this.IMAGES_DEAD);
        if (!this.deadSoundPlayed) {
          this.chicken_dead_sound.play();
          this.deadSoundPlayed = true;
          this.chicken_sound.pause();
        }
      } else {
        this.playAnimation(this.IMAGES_WALKING);
      }
    }, 50);
    intervalIds.push(movementInterval, animationInterval);
  }

  /**
   * Lässt das Chicken sterben.
   * Setzt den Status `isDead` auf `true`, spielt die Sterbeanimation
   * und entfernt das Chicken nach kurzer Zeit aus der Liste der Gegner.
   */
  die() {
    if (this.isDead) return;
    this.isDead = true;
    this.chicken_sound.pause();
    this.chicken_dead_sound.play();
    this.playAnimation(this.IMAGES_DEAD);
    setTimeout(() => {
      if (this.world && this.world.level && this.world.level.enemies) {
        let index = this.world.level.enemies.indexOf(this);
        if (index > -1) {
          this.world.level.enemies.splice(index, 1);
        }
      }
    }, 1000);
  }
}
