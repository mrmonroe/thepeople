import Phaser from "phaser";

export default class Circle extends Phaser.GameObjects.Ellipse {
  constructor(scene, x, y, size) {
    super(scene, x, y, size, size, 0x0000ff, 0.8);

    this.setStrokeStyle(2, 0xffffff, 0.5);

    scene.physics.add.existing(this);
    scene.add.existing(this);
    this.body.collideWorldBounds = true;
    this.body.setCircle(size / 2 + 2, -1, -1);
  }

  rotateShape(direction) {
    switch (direction) {
      case "DOWN":
        // this.rotation = Phaser.Math.DegToRad(180);
        this.setRotation(Phaser.Math.DegToRad(180));

        break;
      case "UP":
        this.rotation = Phaser.Math.DegToRad(0);
        break;
      case "LEFT":
        // this.rotation = Phaser.Math.DegToRad(-90);
        this.setRotation(Phaser.Math.DegToRad(-90));

        break;
      case "RIGHT":
        this.rotation = Phaser.Math.DegToRad(90);
        break;
      default:
        break;
    }
  }

  update() {}
}
