class Bottle extends DrawableObject {
  height = 80;
  width = 40;
  y = 350;
  isCollected = false;

  IMAGES_BOTTLE = [
    "img/6_salsa_bottle/1_salsa_bottle_on_ground.png",
    "img/6_salsa_bottle/2_salsa_bottle_on_ground.png",
  ];
  bottle_sound = new Audio("audio/glass.mp3");

  constructor(x) {
    super().loadImage("img/6_salsa_bottle/1_salsa_bottle_on_ground.png");
    this.loadImages(this.IMAGES_BOTTLE);
    this.x = x;
    this.y = this.y || 350;
    this.animate();
  }

  animate() {
    setInterval(() => {
      this.bottle_sound.pause();
      if ((this.isCollected = true)) {
        this.bottle_sound.play();
      }
    }, 100);
  }
  collect() {
    this.isCollected = true;
  }
}
