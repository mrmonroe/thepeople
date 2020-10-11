import Phaser from "phaser";
import config from "./config/Config";
import EasyStar from "easystarjs"; // A* pathfinder

export default class Baddie {
  constructor(sprite, x, y, tileMap, player, tweens) {
    this.sprite = sprite;
    this.finder = new EasyStar.js();
    this.tileMap = tileMap;
    this.player = player;
    this.setBaddiePosition(x, y);

    this.tweens = tweens;
  }

  setBaddiePosition(x = 5, y = 10) {
    const yOff =
      -((config.PLAYER_FRAME_HEIGHT * config.SCALE) % config.TILE_SIZE) / 2;
    const xP = x * config.TILE_SIZE + config.TILE_SIZE / 2;
    const yP = y * config.TILE_SIZE + yOff;
    this.sprite.setPosition(xP, yP);
  }

  getBaddieTilePos() {
    let yOff =
      -((config.PLAYER_FRAME_HEIGHT * config.SCALE) % config.TILE_SIZE) / 2;

    const x =
      (this.sprite.getCenter().x - config.TILE_SIZE / 2) / config.TILE_SIZE;
    const y = (this.sprite.getCenter().y - yOff) / config.TILE_SIZE;

    return new Phaser.Math.Vector2(Math.floor(x), Math.floor(y));
  }

  setFinder() {
    let grid = [];
    for (let y = 0; y < this.tileMap.height; y++) {
      let col = [];
      for (let x = 0; x < this.tileMap.width; x++) {
        col.push(this.getTileID(x, y));
      }
      grid.push(col);
    }

    this.finder.setGrid(grid);

    let tileset = this.tileMap.tilesets[0];

    let properties = tileset.tileProperties;
    let acceptableTiles = [];
    for (let i = tileset.firstgid - 1; i < tileset.total; i++) {
      if (!properties[i].collides || !properties[i].isTreasure) {
        let tileId = this.getTileID(
          tileset.texCoordinates[i].x,
          tileset.texCoordinates[i].y
        );
        acceptableTiles.push(tileId); //+1
        continue;
      }
    }

    this.finder.setAcceptableTiles(acceptableTiles);
  }

  getPathToPlayer(interval = 100) {
    //interval = 100;
   setInterval(() => {
     this.searchPath();
      this.finder.calculate();
    }, interval);
  }

  searchPath() {
    let pos = this.player.getTilePos();
    let badPos = this.getBaddieTilePos();
    // console.log("ply pos: ", pos)
    //console.log("baddie pos: ", badPos)
    let toX = Math.floor(pos.x);
    let toY = Math.floor(pos.y);
    let fromX = Math.floor(badPos.x);
    let fromY = Math.floor(badPos.y);

    this.finder.findPath(fromX, fromY, toX, toY, (path) => {
      if (path === null) {
        return;
      } else {
        this.moveBaddie(path, (moves) => {
          if (moves && moves.length > 0) {
            this.tweens.timeline({
              tweens: moves,
            });
          }
        });
      }
    });
  }
  getTweens() {
    return this.tweens;
  }
  getTileID(x, y) {
    let tile = this.tileMap.getTileAt(x, y, true);
    return tile && tile.index;
  }

  moveBaddie(path, callback) {
    //console.log("moveBaddie: ", path)
    let tw = [];
    //console.log()
    for (let i = 0; i < path.length - 1; i++) {
      let ex = path[i + 1].x;
      let ey = path[i + 1].y;

      tw.push({
        targets: this.sprite,
        props: {
          x: { value: ex * config.TILE_SIZE, duration: 200 },
          y: { value: ey * config.TILE_SIZE, duration: 200 },
        },
      });
    }

    callback(tw);
  }
}
