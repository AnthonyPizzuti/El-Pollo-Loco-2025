class Level {
  enemies;
  clouds;
  backgroundObject;
  level_end_x = 1530;
  bottles;
  coins;

  constructor(enemies, clouds, backgroundObject, bottles, coins) {
    this.enemies = enemies;
    this.clouds = clouds;
    this.bottles = bottles;
    this.coins = coins;
    this.backgroundObject = backgroundObject;
  }
}
