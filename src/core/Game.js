import Phaser from "phaser";
import defaultPlayerImg from "../assets/sprites/players/charsprites.png";
import chinaMan from "../assets/sprites/baddies/chinaman.png";
import GridControls from "./GridControls";
import GridPhysics from "./GridPhysics";
import Player from "./Player";
import GameMap from "./GameMap";
import config from "./config/Config";
import mapConfig from "./config/MapConfig";
import Baddie from "./Baddie";
import EasyStar from "easystarjs"; //x

export default class Game extends Phaser.Scene {
  constructor(cfg, mapIndex) {
    super(cfg);
    this.gridControls = null;
    this.gridPhysics = null;
    this.newMap = null;
    this.mapIndex = mapIndex;
    this.finder = new EasyStar.js().enableSync(); //x
    this.player = null;
    this.chinaMan = null;
    this.baddie = null;

    this.tweenTimeline = null;
    this.timeLineShouldPlay = false;
  }

  init(){
    //this.tweenTimeline = this.tweens.createTimeline();
    //this.tweens.cre
  }

  preload() {
    this.load.spritesheet(config.PLAYER_SPRITESHEET_KEY, defaultPlayerImg, {
      frameWidth: config.PLAYER_FRAME_WIDTH,
      frameHeight: config.PLAYER_FRAME_HEIGHT,
    });

    this.load.spritesheet("chinaMan", chinaMan, {
      frameWidth: config.PLAYER_FRAME_WIDTH,
      frameHeight: config.PLAYER_FRAME_HEIGHT,
    });

    const level = this.mapIndex;
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
    this.chinaMan = this.physics.add.sprite(0, 0, "chinaMan");
    this.chinaMan.setDepth(2);
    this.chinaMan.scale = 1.5;
    this.chinaMan.setPosition(5, 10)
    const playerSprite = this.physics.add.sprite(
      3,
      3,
      config.PLAYER_SPRITESHEET_KEY
    );
    playerSprite.setDepth(mapConfig[this.mapIndex].gameMap.playerDepth);

    this.cameras.main.startFollow(playerSprite);
    this.cameras.main.setDeadzone(100, 100);
    this.cameras.main.fadeIn(500);
    this.player = new Player(
      playerSprite,
      6,
      mapConfig[this.mapIndex].gameMap.playerStartX,
      mapConfig[this.mapIndex].gameMap.playerStartY,
      this.scene
    );
    this.baddie = new Baddie(
      this.chinaMan,
      10,
      10,
      this.newMap.tileMap,
      this.player,
      this.scene.scene.tweens
    );
    this.baddie.setFinder();
    this.baddie.getPathToPlayer(800);
    this.gridPhysics = new GridPhysics(
      this.player,
      this.newMap.tileMap,
      this.cameras
    );
    this.gridControls = new GridControls(this.input, this.gridPhysics);
    
  }

  update(_time, delta) {
    this.gridControls.update();
    this.gridPhysics.update(delta);


  }
}
