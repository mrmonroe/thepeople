import Phaser from "phaser";
import Player from "../Player";
import Controls from "../Controls";
import Actions from "../Actions";

export default class Scene2 extends Phaser.Scene {
  constructor() {
    super("playGame");
    this.player = null;
  }

  preload() {}

  create() {
    const cursors = this.input.keyboard.createCursorKeys();
    this.player = new Player(
      this,
      "Matt",
      this.game.canvas.width / 2,
      this.game.canvas.height / 2
    );
    this.Actions = new Actions(this.player);
    this.Controls = new Controls(cursors, this.Actions);
  }

  update(_time, delta) {
    this.Controls.update();
    this.Actions.update(delta);
  }
}
