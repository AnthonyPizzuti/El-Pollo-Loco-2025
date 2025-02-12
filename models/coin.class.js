class Coin extends DrawableObject {
  height = 100;
  width = 100;
  y = 50;
  x = 250;
  isCollected = false;

  offset = {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  };

  isColliding(mo) {
    if (!mo || mo.isDead) return false;
    let collision =
      this.x + this.width - this.offset.right > mo.x + mo.offset.left &&
      this.y + this.height - this.offset.bottom > mo.y + mo.offset.top &&
      this.x + this.offset.left < mo.x + mo.width - mo.offset.right &&
      this.y + this.offset.top < mo.y + mo.height - mo.offset.bottom;
    if (collision) {
      console.log(`${this.x + this.width} ${mo.x}`);
    }
    return collision;
  }

  IMAGES_COIN = ["img/8_coin/coin_1.png", "img/8_coin/coin_2.png"];

  constructor(x) {
    super().loadImage("img/8_coin/coin_1.png");
    this.loadImages(this.IMAGES_COIN);
    this.x = x;
    this.y = this.y || 350;
  }
}
