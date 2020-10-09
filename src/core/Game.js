import Phaser from "phaser";
import defaultPlayerImg from "../assets/sprites/players/charsprites.png";
import GridControls from "./GridControls";
import GridPhysics from "./GridPhysics";
import Player from "./Player";
import GameMap from "./GameMap";
import config from "./config/Config";
import mapConfig from "./config/MapConfig";

export default class Game extends Phaser.Scene {
  constructor(cfg) {
    super(cfg);
    this.gridControls = null;
    this.gridPhysics = null;
    this.newMap = null;
  }

  preload() {
    this.load.spritesheet("player", defaultPlayerImg, {
      frameWidth: config.PLAYER_FRAME_WIDTH,
      frameHeight: config.PLAYER_FRAME_HEIGHT,
    });
    const level = 0;
    this.newMap = new GameMap(
      mapConfig[level].gameMap.imgKey,
      mapConfig[level].gameMap.imgFile,
      mapConfig[level].gameMap.mapKey,
      mapConfig[level].gameMap.mapFile,
      mapConfig[level].gameMap.tilesetKey,
      this
    );

    this.newMap.preload();
  }

  create() {
    this.newMap.create();
    const playerSprite = this.physics.add.sprite(0, 0, "player");
    playerSprite.setDepth(mapConfig[0].gameMap.playerDepth);
    this.cameras.main.startFollow(playerSprite);
    const player = new Player(
      playerSprite,
      6,
      mapConfig[0].gameMap.playerStartX,
      mapConfig[0].gameMap.playerStartY
    );

    this.gridPhysics = new GridPhysics(player, this.newMap.tileMap);
    this.gridControls = new GridControls(this.input, this.gridPhysics);
  }

  update(_time, delta) {
    this.gridControls.update();
    this.gridPhysics.update(delta);
  }
}
