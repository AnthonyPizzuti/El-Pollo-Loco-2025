class Level {
  enemies;
  clouds;
  backgroundObject;
  level_end_x = 1530;
  coins;
  bottles;

  constructor(enemies, clouds, backgroundObject, coins, bottles) {
    this.enemies = enemies;
    this.clouds = clouds;
    this.coins = coins;
    this.bottles = bottles;
    this.backgroundObject = backgroundObject;
  }
}
