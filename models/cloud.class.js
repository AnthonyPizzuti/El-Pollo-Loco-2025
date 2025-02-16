/**
 * The `Cloud` class represents a cloud in the game background.
 * Clouds continuously move to the left to create a parallax scrolling effect.
 *
 * @extends MovableObject
 */
class Cloud extends MovableObject {
  y = 20;
  height = 250;
  width = 500;
  speed = 0.2;

  /**
   * Creates a new instance of a cloud.
   * Loads the cloud image and sets a random x-coordinate.
   */
  constructor() {
    super().loadImage("img/5_background/layers/4_clouds/1.png");
    this.x = Math.random() * 500;
    this.animate();
  }

  /**
   * Starts the cloud's animation.
   * The cloud continuously moves to the left.
   */
  animate() {
    intervalIds.push(
      setInterval(() => {
        this.moveLeft();
      }, 1000 / 60)
    );
  }
}
