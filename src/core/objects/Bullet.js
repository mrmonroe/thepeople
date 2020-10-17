import Phaser from "phaser";
import CONFIG from "../config/Config";

export default class Bullet extends Phaser.GameObjects.Ellipse {
  constructor(scene, x, y) {
    super(scene, x, y, 4, 4, 0xff0000);
    scene.physics.add.existing(this);
    scene.add.existing(this);
    //  this.body.collideWorldBounds = true;
    this.body.setCircle(4, -1, -1);
    this.movementDirection = CONFIG.DIRECTION.NONE;
    this.speed = 200;
    this.movementDirectionVectors = {
      [CONFIG.DIRECTION.UP]: Phaser.Math.Vector2.UP,
      [CONFIG.DIRECTION.DOWN]: Phaser.Math.Vector2.DOWN,
      [CONFIG.DIRECTION.LEFT]: Phaser.Math.Vector2.LEFT,
      [CONFIG.DIRECTION.RIGHT]: Phaser.Math.Vector2.RIGHT,
    };
  }

  fireBullet(direction) {
    const vel = this.getDirection(direction, this.speed);
    this.body.setVelocity(vel.x, vel.y);
    this.collideDestroy();
  }

  getDirection(direction, speed) {
    return this.movementDirectionVectors[direction]
      .clone()
      .multiply(new Phaser.Math.Vector2(speed));
  }

  collideDestroy() {
    if (this.body.checkWorldBounds()) {
      this.destroy();
    }
  }
}
