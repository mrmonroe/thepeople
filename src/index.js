import Phaser from "phaser";
import Game from "./core/Game";

const CANVAS_WIDTH = 720;
const CANVAS_HEIGHT = 528;

const sceneConfig = {
  active: false,
  visible: false,
  key: "Game",
};

const first = new Game(sceneConfig);

const gameConfig = {
  title: "The People",
  render: {
    antialias: false,
  },
  type: Phaser.AUTO,
  parent: "game",
  scene: first,
  scale: {
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: true,
    },
  },
  backgroundColor: "#000",
};

export const game = new Phaser.Game(gameConfig);
