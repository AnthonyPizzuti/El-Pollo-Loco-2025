/**
 * Repräsentiert ein Level im Spiel mit Gegnern, Wolken, Hintergründen, Flaschen und Münzen.
 */
class Level {
  enemies;
  clouds;
  backgroundObject;
  level_end_x = 1530;
  bottles;
  coins;

  /**
   * Erstellt ein neues Level.
   * @param {Array} enemies - Die Gegner im Level.
   * @param {Array} clouds - Die Wolken im Level.
   * @param {Array} backgroundObject - Die Hintergrundobjekte im Level.
   * @param {Array} bottles - Die Flaschen im Level.
   * @param {Array} coins - Die Münzen im Level.
   */
  constructor(enemies, clouds, backgroundObject, bottles, coins) {
    this.enemies = enemies;
    this.clouds = clouds;
    this.bottles = bottles;
    this.coins = coins;
    this.backgroundObject = backgroundObject;
  }
}
