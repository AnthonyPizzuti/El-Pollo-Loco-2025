class Coin extends DrawableObject {
  height = 100;
  width = 100;
  y = 100;
  x = 250;
  isCollectedCoin = false;


  IMAGES_COIN = ["img/8_coin/coin_1.png", "img/8_coin/coin_2.png"];
  coin_sound = new Audio("audio/coin.mp3");

  constructor() {
    super().loadImage("img/8_coin/coin_1.png");
    this.loadImages(this.IMAGES_COIN);
    this.animate();
  }

  animate() {
    setInterval(() => {
      if (this.isCollectedCoin) {
        this.coin_sound.play();
        this.isCollectedCoin = false;
      }
    }, 100);
  }
}  
