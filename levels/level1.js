/**
 * Creates a global variable `level1` that stores the level instance.
 */
let level1;

/**
 * Initializes the level and defines its components:
 * - Enemies (Chickens and Littlechickens)
 * - Clouds
 * - Background objects (multiple layers for a parallax effect)
 * - Bottles that the player can collect
 * - Coins that the player can collect
 */
function initLevel() {
  level1 = new Level(
    [
      new Chicken(),
      new Chicken(),
      new Chicken(),
      new Littlechicken(),
      new Littlechicken(),
      new Littlechicken(),
      new Littlechicken(),
      new Littlechicken(),
    ],
    [new Cloud()],
    [
      new BackgroundObject("img/5_background/layers/air.png", -719),
      new BackgroundObject("img/5_background/layers/3_third_layer/2.png", -719),
      new BackgroundObject("img/5_background/layers/2_second_layer/2.png",-719),
      new BackgroundObject("img/5_background/layers/1_first_layer/2.png", -719),
      new BackgroundObject("img/5_background/layers/air.png", 0),
      new BackgroundObject("img/5_background/layers/3_third_layer/1.png", 0),
      new BackgroundObject("img/5_background/layers/2_second_layer/1.png", 0),
      new BackgroundObject("img/5_background/layers/1_first_layer/1.png", 0),
      new BackgroundObject("img/5_background/layers/air.png", 719),
      new BackgroundObject("img/5_background/layers/3_third_layer/2.png", 719),
      new BackgroundObject("img/5_background/layers/2_second_layer/2.png", 719),
      new BackgroundObject("img/5_background/layers/1_first_layer/2.png", 719),
      new BackgroundObject("img/5_background/layers/air.png", 719 * 2),
      new BackgroundObject("img/5_background/layers/3_third_layer/1.png", 719 * 2),
      new BackgroundObject("img/5_background/layers/2_second_layer/1.png", 719 * 2),
      new BackgroundObject("img/5_background/layers/1_first_layer/1.png", 719 * 2),
      new BackgroundObject("img/5_background/layers/air.png", 719 * 3),
      new BackgroundObject("img/5_background/layers/3_third_layer/2.png", 719 * 3),
      new BackgroundObject("img/5_background/layers/2_second_layer/2.png", 719 * 3),
      new BackgroundObject("img/5_background/layers/1_first_layer/2.png", 719 * 3),
      new BackgroundObject("img/5_background/layers/air.png", 719 * 4),
      new BackgroundObject("img/5_background/layers/3_third_layer/1.png", 719 * 4),
      new BackgroundObject("img/5_background/layers/2_second_layer/1.png", 719 * 4),
      new BackgroundObject("img/5_background/layers/1_first_layer/1.png", 719 * 4),
    ],
    [
      new Bottle(400),
      new Bottle(600),
      new Bottle(700),
      new Bottle(900),
      new Bottle(1200),
      new Bottle(1600),
      new Bottle(2000)
    ],
    [new Coin(250), new Coin(400), new Coin(600), new Coin(800), new Coin(1000)]
  );
}
