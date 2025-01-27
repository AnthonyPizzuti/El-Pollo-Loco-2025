class ThrowableObject extends MovableObject {
  throw_sound = new Audio("audio/throw.mp3");

  constructor(x, y) {
    super().loadImage("img/7_statusbars/3_icons/icon_salsa_bottle.png");
    this.x = x;
    this.y = y;
    this.height = 60;
    this.width = 50;
    this.trow();
  }

  trow() {
    this.speedY = 30;
    this.applyGravity();
    const intervalId = setInterval(() => {
      this.x += 10;
    }, 25);
    intervalIds.push(intervalId);
  }
  playThrowSound() {
    this.throw_sound.volume = 0.5;
    this.throw_sound.play();
  }
}
