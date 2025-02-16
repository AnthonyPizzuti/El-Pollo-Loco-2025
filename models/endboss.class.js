/**
 * Represents the final boss in the game.
 * Inherits from `MovableObject` and features various animations
 * as well as an attack mode.
 */
class Endboss extends MovableObject {
  height = 400;
  width = 250;
  y = 45;
  isDead = false;


 /**
   * Offset for the final boss's hitbox.
   * @type {{top: number, bottom: number, left: number, right: number}}
   */
  offset = {
    top: 10,
    bottom: 10,
    left: 10,
    right: 10,
  };

 /**
   * Images for the walking animation.
   * @type {string[]}
   */
  IMAGES_WALKING = [
    "img/4_enemie_boss_chicken/2_alert/G5.png",
    "img/4_enemie_boss_chicken/2_alert/G6.png",
    "img/4_enemie_boss_chicken/2_alert/G7.png",
    "img/4_enemie_boss_chicken/2_alert/G8.png",
    "img/4_enemie_boss_chicken/2_alert/G9.png",
    "img/4_enemie_boss_chicken/2_alert/G10.png",
    "img/4_enemie_boss_chicken/2_alert/G11.png",
    "img/4_enemie_boss_chicken/2_alert/G12.png",
  ];

  /**
   * Images for the hurt animation.
   * @type {string[]}
   */
  IMAGES_HURT = [
    "img/4_enemie_boss_chicken/4_hurt/G21.png",
    "img/4_enemie_boss_chicken/4_hurt/G22.png",
    "img/4_enemie_boss_chicken/4_hurt/G23.png",
  ];

  /**
   * Images for the attack animation.
   * @type {string[]}
   */
  IMAGES_ATTACK = [
    "img/4_enemie_boss_chicken/3_attack/G13.png",
    "img/4_enemie_boss_chicken/3_attack/G14.png",
    "img/4_enemie_boss_chicken/3_attack/G15.png",
    "img/4_enemie_boss_chicken/3_attack/G16.png",
    "img/4_enemie_boss_chicken/3_attack/G17.png",
    "img/4_enemie_boss_chicken/3_attack/G18.png",
    "img/4_enemie_boss_chicken/3_attack/G19.png",
    "img/4_enemie_boss_chicken/3_attack/G20.png",
  ];

 /**
   * Images for the normal walking animation.
   * @type {string[]}
   */
  IMAGES_WALK = [
    "img/4_enemie_boss_chicken/1_walk/G1.png",
    "img/4_enemie_boss_chicken/1_walk/G2.png",
    "img/4_enemie_boss_chicken/1_walk/G3.png",
    "img/4_enemie_boss_chicken/1_walk/G4.png",
  ];

  /**
   * Images for the death animation.
   * @type {string[]}
   */
  IMAGES_DEAD = [
    "img/4_enemie_boss_chicken/5_dead/G24.png",
    "img/4_enemie_boss_chicken/5_dead/G25.png",
    "img/4_enemie_boss_chicken/5_dead/G26.png",
  ];

  /**
   * The number of hits the final boss has received.
   * @type {number}
   */
  hits = 0;

 /**
   * Creates a new instance of the final boss.
   * Loads the images and starts the animation.
   */
  constructor() {
    super().loadImage(this.IMAGES_WALKING[0]);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImages(this.IMAGES_WALK);
    this.loadImages(this.IMAGES_ATTACK);
    this.x = 2500 + Math.random() * 500;
    this.speed = 5;
    this.animate();
    this.endboss_sound = new Audio("audio/endboss.mp3");
    this.endboss_sound.volume = 0.2;
    this.endboss_sound.loop = true;
    registerSound(this.endboss_sound)
  }

 /**
   * Starts the final boss's animations for movement, state, and attack.
   */
  animate() {
    let walkInterval = setInterval(() => { this.playAnimation(this.IMAGES_WALK); this.moveLeft();
    }, 200);
    let stateChangeInterval = setInterval(() => { if (this.isDead) { this.playAnimation(this.IMAGES_DEAD);
      } else if (this.hits >= 3 && this.hits < 7) { this.playAnimation(this.IMAGES_HURT);
      } else { this.playAnimation(this.IMAGES_WALKING);
      }
    }, 200);
    let attackInterval = setInterval(() => { if (!this.isDead) { this.playAnimation(this.IMAGES_ATTACK);
      }
    }, 5000);
    intervalIds.push(walkInterval, stateChangeInterval, attackInterval);
  }

  /**
   * Handles the death of the final boss.
   * - Prevents multiple executions if already dead.
   * - Stops all movement and attack intervals.
   * - Plays the death animation for 2 seconds.
   * - Removes the boss from the game after the animation.
   */
  die() {
    if (this.isDead) return;
    this.isDead = true;
    if (this.endboss_sound) { this.endboss_sound.pause(); this.endboss_sound.currentTime = 0;
      let index = allGameSounds.indexOf(this.endboss_sound);
      if (index > -1) { allGameSounds.splice(index, 1);
      }
    } clearInterval(this.walkInterval); clearInterval(this.stateChangeInterval); clearInterval(this.attackInterval);
    let deathAnimationInterval = setInterval(() => { this.playAnimation(this.IMAGES_DEAD);
    }, 200);
    setTimeout(() => { clearInterval(deathAnimationInterval); 
      this.removeFromWorld();
    }, 2000);
  }
  
/**
 * Removes the entity from the world's enemy list.
 * Ensures that the entity is properly deleted from the game upon death.
 */
removeFromWorld() {
    if (this.world && this.world.level && this.world.level.enemies) {
        let index = this.world.level.enemies.indexOf(this);
        if (index > -1) {
            this.world.level.enemies.splice(index, 1);
        }
    }
}
}