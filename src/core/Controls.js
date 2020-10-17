import CONFIG from "./config/Config";

export default class Controls {
  constructor(input, Actions) {
    this.input = input
    this.Actions = Actions;
    this.currPosition = CONFIG.DIRECTION.UP;
  }

  update() {
  const cursors = this.input;
    if (cursors.shift.isDown) {
      this.Actions.setSpeed(CONFIG.SPEED.RUNNING)
    } else if (cursors.shift.isUp) {
      this.Actions.setSpeed(CONFIG.SPEED.WALKING)
    }

    if (cursors.space.isDown){ 
      console.log("currpos: ", this.currPosition)
      this.Actions.player.fireBullet(this.currPosition)
    }

    if (cursors.left.isDown) {
      this.Actions.movePlayer(CONFIG.DIRECTION.LEFT)
      this.currPosition = CONFIG.DIRECTION.LEFT
    } else if (cursors.right.isDown) {
      this.Actions.movePlayer(CONFIG.DIRECTION.RIGHT)
      this.currPosition = CONFIG.DIRECTION.RIGHT
    } else if (cursors.up.isDown) {
      this.Actions.movePlayer(CONFIG.DIRECTION.UP)
      this.currPosition = CONFIG.DIRECTION.UP
    } else if (cursors.down.isDown) {
      this.Actions.movePlayer(CONFIG.DIRECTION.DOWN)
      this.currPosition = CONFIG.DIRECTION.DOWN
    }
  }
}
