class CoinBar extends DrawableObject {
  IMAGES_COIN = [
    "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/0.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/20.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/40.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/60.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/80.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/100.png",
  ];

  percentage = 0;

  constructor() {
    super();
    this.loadImages(this.IMAGES_COIN);
    this.setPercentage(0);
    this.x = 20;
    this.y = 50;
    this.width = 200;
    this.height = 60;
  }

  setPercentage(percentage) {
    this.percentage = percentage;
    const index = Math.min(
      Math.floor(this.percentage / 20),
      this.IMAGES_COIN.length - 1
    );
    this.img = this.imageCache[this.IMAGES_COIN[index]];
  }
}
