import Phaser from "phaser";
import Game from "./core/Game";
import mapConfig from "./core/config/MapConfig";

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;

const scenes = [];
mapConfig.forEach((mc, i) => {
  const sceneConfig = {
    active: false,
    visible: false,
    key: mc.gameMap.levelName,
  };
  scenes.push(new Game(sceneConfig, i));
});

const gameConfig = {
  title: "The People",
  render: {
    antialias: false,
  },
  type: Phaser.AUTO,
  parent: "game",
  scene: scenes,
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
  backgroundColor: "#000",
};

export const game = new Phaser.Game(gameConfig);
