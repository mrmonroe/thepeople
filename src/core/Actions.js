import Phaser from 'phaser'
import CONFIG from "./config/Config";
export default class Actions {
  constructor(player) {
    this.player = player;
    this.speedPixelsPerSecond = CONFIG.SPEED.WALKING;
    this.movementDirection = CONFIG.DIRECTION.NONE;
    this.movementDirectionVectors = {
      [CONFIG.DIRECTION.UP]: Phaser.Math.Vector2.UP,
      [CONFIG.DIRECTION.DOWN]: Phaser.Math.Vector2.DOWN,
      [CONFIG.DIRECTION.LEFT]: Phaser.Math.Vector2.LEFT,
      [CONFIG.DIRECTION.RIGHT]: Phaser.Math.Vector2.RIGHT,
    };
  }

  movePlayer(direction) {
    if (this.isMoving()) {
      return;
    }
    this.startMoving(direction);
  }

  isMoving() {
    return this.movementDirection !== CONFIG.DIRECTION.NONE;
  }

  startMoving(direction) {
    this.movementDirection = direction;
  }

  stopMoving() {
    this.movementDirection = CONFIG.DIRECTION.NONE;
  }

  update(delta) {
    if (this.isMoving()) {
      this.updatePlayerPosition(delta);
      this.stopMoving()
    }
    
  }

  setSpeed(speed){
    this.speedPixelsPerSecond = speed;
  }

  updatePlayerPosition(delta){
    const deltaSpeed = this.getDeltaSpeed(delta)
    this.movePlayerSprite(deltaSpeed);
  }
  getDeltaSpeed(delta){
    const deltaInSeconds = delta / 1000
    return this.speedPixelsPerSecond * deltaInSeconds
  }
  movePlayerSprite(speed) {
    const newPlayerPos = this.player
      .getPosition()
      .add(this.movementDistance(speed));
    this.player.setPosition(newPlayerPos.x, newPlayerPos.y);
  }

  movementDistance(speed) {
    return this.movementDirectionVectors[this.movementDirection]
      .clone()
      .multiply(new Phaser.Math.Vector2(speed));
  }

}
