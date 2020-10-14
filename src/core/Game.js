import Phaser from "phaser";
import defaultPlayerImg from "../assets/sprites/players/charsprites.png";
import chinaMan from "../assets/sprites/baddies/chinaman.png";
import GridControls from "./GridControls";
import GridPhysics from "./GridPhysics";
import Player from "./Player";
import GameMap from "./GameMap";
import config from "./config/Config";
import mapConfig from "./config/MapConfig";
import BaddieFactory from "./BaddieFactory";

export default class Game extends Phaser.Scene {
  constructor(cfg, mapIndex) {
    super(cfg);
    this.gridControls = null;
    this.gridPhysics = null;
    this.newMap = null;
    this.mapIndex = mapIndex;
    this.player = null;
    this.chinaMan = null;
    this.baddieFactory = null;
    this.isPlayerAlive = true;
  }

  preload() {
    
    this.load.spritesheet(config.PLAYER_SPRITESHEET_KEY, defaultPlayerImg, {
      frameWidth: config.PLAYER_FRAME_WIDTH,
      frameHeight: config.PLAYER_FRAME_HEIGHT,
    });
    this.baddieFactory = new BaddieFactory(this);

    this.baddieFactory.preLoadBaddies(
      "chinaMan",
      chinaMan,
      config.PLAYER_FRAME_WIDTH,
      config.PLAYER_FRAME_HEIGHT,
      3
    );

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
    this.baddieFactory.generateSprites(0, 1.5)
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
    this.baddieFactory.createBaddies(
      this.newMap.tileMap,
      this.player,
      this.scene.scene.tweens
    );
   
    this.baddieFactory.startBaddies(1500);
    this.gridPhysics = new GridPhysics(
      this.player,
      this.newMap.tileMap,
      this.cameras
    );
    this.gridControls = new GridControls(this.input, this.gridPhysics);
    this.isPlayerAlive = true;
  }

  update(_time, delta) {
    if (!this.isPlayerAlive) {
      return;
    }
    this.baddieFactory.handleGroupCollide()
    this.baddieFactory.getGroup().forEach((baddie) => {
      if (
        Phaser.Geom.Intersects.RectangleToRectangle(
          this.player.sprite.getBounds(),

          baddie.sprite.getBounds()
        )
      ) {
        this.isPlayerAlive = false;
        this.cameras.main.shake(500, 0.02);
        this.time.delayedCall(
          500,
          () => {
            this.cameras.main.fade(250);
          },
          [],
          this
        );
        this.time.delayedCall(
          500,
          () => {
            this.scene.restart();
          },
          [],
          this
        );
      }
    });
    this.gridControls.update();
    this.gridPhysics.update(delta);
  }
}
