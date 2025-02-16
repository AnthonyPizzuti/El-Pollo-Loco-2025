/**
 * Represents a level in the game with enemies, clouds, background objects, bottles, and coins.
 */
class Level {
  enemies;
  clouds;
  backgroundObject;
  level_end_x = 2970;
  bottles;
  coins;

  /**
   * Creates a new level.
   * @param {Array} enemies - The enemies in the level.
   * @param {Array} clouds - The clouds in the level.
   * @param {Array} backgroundObject - The background objects in the level.
   * @param {Array} bottles - The bottles in the level.
   * @param {Array} coins - The coins in the level.
   */
  constructor(enemies, clouds, backgroundObject, bottles, coins) {
    this.enemies = enemies;
    this.clouds = clouds;
    this.bottles = bottles;
    this.coins = coins;
    this.backgroundObject = backgroundObject;
  }
}
