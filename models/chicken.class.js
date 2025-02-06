class Chicken extends MovableObject {
  y = 330;
  height = 100;
  isDead = false;

  IMAGES_WALKING = [
    "img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
  ];

  IMAGES_DEAD = ["img/3_enemies_chicken/chicken_normal/2_dead/dead.png"];
  chicken_sound = new Audio("audio/chicken.mp3");
  chicken_dead_sound = new Audio("audio/chicken_dead.mp3");

  constructor() {
    super().loadImage("img/3_enemies_chicken/chicken_normal/1_walk/1_w.png");
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_DEAD);
    this.x = Math.max(300, 1000 + Math.random() * 500);
    this.speed = 0.2 + Math.random() * 0.3;
    this.animate();
    registerSound(this.chicken_sound);
    registerSound(this.chicken_dead_sound);
  }

  animate() {
    let movementInterval = setInterval(() => {
      if (!this.isDead) {
        this.moveLeft();
        if (!this.chicken_sound.playing) {
          this.chicken_sound.play();
        }
        this.chicken_sound.volume = 0.05;
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
}
