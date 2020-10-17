import Phaser from "phaser";
import Scene1 from "./core/scenes/Scene1";
import Scene2 from "./core/scenes/Scene2";

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;

const gameConfig = {
  title: "The Void",
  render: {
    antialias: true,
  },

  type: Phaser.AUTO,
  parent: "game",
  scene: [Scene1, Scene2],
  scale: {
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
  backgroundColor: "#000000",
};

const game = new Phaser.Game(gameConfig);

if(!game){alert("Uh Oh!") }
