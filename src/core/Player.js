import Phaser from "phaser";
import Bullet from "./objects/Bullet";
import Circle from "./objects/Circle";

export default class Player {
  constructor(scene, name, startX, startY) {
    this.scene = scene;
    this.body = new Circle(scene, startX, startY, 15);
    this.name = name;
    this.health = 100;
    this.isAlive = true;
  }

  reduceHealth(num) {
    this.health -= num;
  }

  addHealth(num) {
    this.health += num;
  }

  maxHealth() {
    this.health = 100;
  }

  getPosition() {
    return new Phaser.Math.Vector2(this.body.x, this.body.y);
  }

  setPosition(x, y) {
    this.body.setPosition(x, y);
  }

  fireBullet(direction) {
    const bullet = new Bullet(
      this.scene,
      this.getPosition().x,
      this.getPosition().y
    );
    bullet.fireBullet(direction);
  }
}
