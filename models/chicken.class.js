/**
 * Represents an enemy character (Chicken) in the game.
 * Inherits from `MovableObject` and can move left, play animations,
 * and die when hit.
 *
 * @extends MovableObject
 */
class Chicken extends MovableObject {
  y = 330;
  height = 100;
  isDead = false;
  deadSoundPlayed = false;

 /**
   * Offset values for the chicken's collision detection.
   * @type {Object}
   */
  offset = {
    top: 2,
    bottom: 2,
    left: 5,
    right: 5,
  };

  /**
   * Image paths for the chicken's walking animation.
   * @type {string[]}
   */
  IMAGES_WALKING = [
    "img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
  ];

  /**
   * Image path for the dead chicken.
   * @type {string[]}
   */
  IMAGES_DEAD = ["img/3_enemies_chicken/chicken_normal/2_dead/dead.png"];

  /**
   * Sound for the living chicken.
   * @type {HTMLAudioElement}
   */
  chicken_sound = new Audio("audio/chicken.mp3");
  chicken_dead_sound = new Audio("audio/chicken_dead.mp3");

  /**
   * Creates a new instance of a Chicken.
   * Loads images, sets a random position and speed, registers sounds,
   * and starts the animation.
   *
   * @param {World} world - The game world to which the chicken belongs.
   */
  constructor(world) {
    super().loadImage("img/3_enemies_chicken/chicken_normal/1_walk/1_w.png");
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_DEAD);
    this.x = Math.max(300, 1500 + Math.random() * 500);
    this.speed = 0.2 + Math.random() * 0.3;
    this.animate();
    registerSound(this.chicken_sound);
    registerSound(this.chicken_dead_sound);
  }

  /**
   * Starts the movement and animation of the chicken.
   * The chicken moves left, plays walking animations,
   * and stops when it dies.
   */
  animate() {
    let movementInterval = setInterval(() => { if (!this.isDead) { this.moveLeft();
        if (!this.chicken_sound.playing) { this.chicken_sound.play();
        }
        this.chicken_sound.volume = 0.02;
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

  /**
   * Kills the chicken.
   * Sets the status `isDead` to `true`, plays the death animation,
   * and removes the chicken from the enemy list after a short delay.
   */
  die() {
    if (this.isDead) return;
    this.isDead = true;
    this.chicken_sound.pause();
    this.chicken_dead_sound.play();
    this.playAnimation(this.IMAGES_DEAD);
    setTimeout(() => {
      if (this.world && this.world.level && this.world.level.enemies) { let index = this.world.level.enemies.indexOf(this);
        if (index > -1) { this.world.level.enemies.splice(index, 1);
        }
      }
    }, 1000);
  }
}
