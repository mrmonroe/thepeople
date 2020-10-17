import Phaser from "phaser";

export default class Scene1 extends Phaser.Scene {
  constructor() {
    super("bootGame");

  }

  preload() {
    
  }

  create() {
    this.add.text(10,10,"Loading game...");
    this.scene.start("playGame");
  }

  update(_time, delta) {
  }
}
