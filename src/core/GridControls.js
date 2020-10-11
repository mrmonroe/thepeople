import config from "./config/Config";

export default class GridControls {
  constructor(input, gridPhysics) {
    this.input = input;
    this.gridPhysics = gridPhysics;
  }

  update() {
    
    const cursors = this.input.keyboard.createCursorKeys();
    //const shift = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
    if (cursors.shift.isDown) {
      this.gridPhysics.changeSpeed(config.SPEED.RUNNING);
    }else if(cursors.shift.isUp) {
      this.gridPhysics.changeSpeed(config.SPEED.WALKING);
    }
    if (cursors.left.isDown) {
      this.gridPhysics.movePlayer(config.DIRECTION.LEFT);
    } else if (cursors.right.isDown) {
      this.gridPhysics.movePlayer(config.DIRECTION.RIGHT);
    } else if (cursors.up.isDown) {
      this.gridPhysics.movePlayer(config.DIRECTION.UP);
    } else if (cursors.down.isDown) {
      this.gridPhysics.movePlayer(config.DIRECTION.DOWN);
    } 
    
    
  }
}
