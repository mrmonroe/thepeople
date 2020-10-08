import Phaser from 'phaser';
import defaultPlayerImg from '../sprites/players/charsprites.png';
import GridControls from './GridControls';
import GridPhysics from './GridPhysics';
import Player from './Player';
import config from './Config';

export default class Game extends Phaser.Scene {
  constructor(cfg) {
    super(cfg);
    this.gridControls = null;
    this.gridPhysics = null;
    this.TILE_SIZE = 48;
  }

  preload() {
    this.load.spritesheet('player', defaultPlayerImg, {
      frameWidth: config.PLAYER_FRAME_WIDTH,
      frameHeight: config.PLAYER_FRAME_HEIGHT,

    });

    this.load.image('tiles', './src/assets/BaseChip_pipo.png');
    this.load.tilemapTiledJSON('basic-grass-map', './src/assets/gamejson.json');
  }

  create() {
    const basicGrassMap = this.make.tilemap({ key: 'basic-grass-map' });
    basicGrassMap.addTilesetImage('pipo', 'tiles');
    for (let i = 0; i < basicGrassMap.layers.length; ++i) {
      const layer = basicGrassMap.createStaticLayer(i, 'pipo', 0, 0);
      layer.setDepth(i);
      layer.scale = 2.5;
    }

    const playerSprite = this.physics.add.sprite(0, 0, 'player');
    playerSprite.setDepth(2);
    //this.cameras.main.setBounds(0, 0, basicGrassMap.widthInPixels, basicGrassMap.heightInPixels);
    this.cameras.main.startFollow(playerSprite);
    const player = new Player(playerSprite, 5, 8, 8);

    this.gridPhysics = new GridPhysics(player);
    this.gridControls = new GridControls(
      this.input,
      this.gridPhysics,
    );
  }

  update(_time, delta) {
    this.gridControls.update();
    this.gridPhysics.update(delta);
  }
}
