export default class GameMap {
  constructor(imgKey, imgFile, mapKey, mapFile, tilesetKey, game) {
    this.imgKey = imgKey;
    this.imgFile = imgFile;
    this.mapKey = mapKey;
    this.mapFile = mapFile;
    this.tilesetKey = tilesetKey;
    this.game = game;
    this.tileMap = null;
  }

  preload() {
    this.game.load.image(this.imgKey, this.imgFile, this);
    this.game.load.tilemapTiledJSON(this.mapKey, this.mapFile);
  }

  create() {
    this.tileMap = this.game.make.tilemap({ key: this.mapKey });
    this.tileMap.addTilesetImage(this.tilesetKey, this.imgKey);
    for (let i = 0; i < this.tileMap.layers.length; ++i) {
      const layer = this.tileMap.createStaticLayer(i, this.tilesetKey, 0, 0);
      layer.setDepth(i);
      layer.scale = 3;
    }
  }
}
