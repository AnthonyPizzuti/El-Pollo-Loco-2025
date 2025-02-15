/**
 * Repräsentiert ein kleines Chicken als Gegner im Spiel.
 * Erbt von `MovableObject` und bewegt sich von rechts nach links.
 */
class Littlechicken extends MovableObject {
  y = 380;
  height = 50;
  width = 70;
  isDead = false;

  /**
   * Offset für die Hitbox-Anpassung.
   * @type {{top: number, bottom: number, left: number, right: number}}
   */
  offset = {
    top: -30,
    bottom: 5,
    left: 5,
    right: 5,
  };

  /**
   * Bilder für die Laufanimation.
   * @type {string[]}
   */
  IMAGES_WALKING = [
    "img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
    "img/3_enemies_chicken/chicken_small/1_walk/2_w.png",
    "img/3_enemies_chicken/chicken_small/1_walk/3_w.png",
  ];

  /**
   * Bild für das tote Littlechicken.
   * @type {string[]}
   */
  IMAGES_DEAD = ["img/3_enemies_chicken/chicken_small/2_dead/dead.png"];

  /**
   * Soundeffekt für das Chicken-Geräusch.
   * @type {HTMLAudioElement}
   */
  chicken_sound = new Audio("audio/chicken.mp3");
  chicken_dead_sound = new Audio("audio/chicken_dead.mp3");

  /**
   * Erstellt ein neues `Littlechicken`-Objekt.
   */
  constructor() {
    super().loadImage("img/3_enemies_chicken/chicken_small/1_walk/1_w.png");
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_DEAD);
    this.x = Math.max(300, 2200 + Math.random() * 500);
    this.speed = 0.2 + Math.random() * 0.3;
    this.animate();
    registerSound(this.chicken_sound);
    registerSound(this.chicken_dead_sound);
  }

  /**
   * Startet die Animation des Littlechicken (Laufen & Sterben).
   */
  animate() {
    let movementInterval = setInterval(() => { if (!this.isDead) { this.moveLeft();
        if (!this.chicken_sound.playing) { this.chicken_sound.play();
        }
        this.chicken_sound.volume = 0.05;
      } else { this.chicken_sound.pause();
      }
    }, 1000 / 60);
    let animationInterval = setInterval(() => { if (this.isDead) { this.playAnimation(this.IMAGES_DEAD);
        if (!this.deadSoundPlayed) { this.chicken_dead_sound.play(); this.deadSoundPlayed = true; this.chicken_sound.pause();
        }
      } else { this.playAnimation(this.IMAGES_WALKING);
      }
    }, 50);
    intervalIds.push(movementInterval, animationInterval);
  }
}
