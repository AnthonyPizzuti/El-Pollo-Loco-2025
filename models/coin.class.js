class Coin extends DrawableObject {
  height = 100;
  width = 100;
  y = 50;
  x = 250;
  isCollected = false;

  IMAGES_COIN = ["img/8_coin/coin_1.png", "img/8_coin/coin_2.png"];

  constructor(x) {
    super().loadImage("img/8_coin/coin_1.png");
    this.loadImages(this.IMAGES_COIN);
    this.x = x;
    this.y = this.y || 350;
  }
}
