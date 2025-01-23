class Coin extends DrawableObject {
  height = 60;
  width = 40;
  y = 80;
  isCollected = false;

  IMAGES_COIN = ["img/8_coin/coin_1.png", "img/8_coin/coin_2.png"];
  coin_sound = new Audio("audio/coin.mp3");

  constructor() {
    super().loadImage("img/8_coin/coin_1.png");
    this.loadImages(this.IMAGES_COIN);
    this.animate();
  }

  animate() {
    setInterval(() => {
      this.coin_sound.pause();
      if ((this.isCollected = true)) {
        this.coin_sound.play();
      }
    }, 100);
  }
  collect() {
    this.isCollected = true;
  }
}
