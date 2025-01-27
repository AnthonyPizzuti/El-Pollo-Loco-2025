class BottleBar extends DrawableObject {
  IMAGES_BOTTLE = [
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/0.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/20.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/40.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/60.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/80.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/100.png",
  ];

  percentage = 0;

  constructor() {
    super();
    this.loadImages(this.IMAGES_BOTTLE);
    this.setPercentage(0);
    this.x = 20;
    this.y = 100;
    this.width = 200;
    this.height = 60;
  }

  setPercentage(percentage) {
    this.percentage = percentage;
    const index = Math.min(
      Math.floor(this.percentage / 6),
      this.IMAGES_BOTTLE.length - 1
    );
    this.img = this.imageCache[this.IMAGES_BOTTLE[index]];
  }

  resolveImageIndex() {
    if (this.percentage == 100) {
      return 5;
    } else if (this.percentage > 20) {
      return 4;
    } else if (this.percentage > 40) {
      return 3;
    } else if (this.percentage > 60) {
      return 2;
    } else if (this.percentage > 80) {
      return 1;
    } else {
      return 0;
    }
  }
}
