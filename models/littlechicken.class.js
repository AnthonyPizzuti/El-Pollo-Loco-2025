class Littlechicken extends MovableObject {
  y = 380;
  height = 50;
  width = 70;
  IMAGES_WALKING = [
    "img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
    "img/3_enemies_chicken/chicken_small/1_walk/2_w.png",
    "img/3_enemies_chicken/chicken_small/1_walk/3_w.png",
  ];

  constructor() {
    super().loadImage("img/3_enemies_chicken/chicken_small/1_walk/1_w.png");
    this.loadImages(this.IMAGES_WALKING);

    this.x = 1800 + Math.random() * 500;
    this.speed = 0.2 + Math.random() * 0.3;
    this.animate();
  }

  animate() {
    this.moveLeft();

    setInterval(() => {
      this.playAnimation(this.IMAGES_WALKING);
    }, 200);
  }
}
