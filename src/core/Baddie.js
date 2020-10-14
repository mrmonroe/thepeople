import Phaser from "phaser";
import EasyStar from "easystarjs"; // A* pathfinder
import config from "./config/Config";

export default class Baddie {
  constructor(sprite, x, y, tileMap, player, tweens) {
    this.sprite = sprite;
    this.Finder = new EasyStar.js();
    this.tileMap = tileMap;
    this.player = player;
    this.setBaddiePosition(x, y);

    this.tweens = tweens;
  }

  setBaddiePosition(x = 5, y = 10) {
    const yOff = -((config.PLAYER_FRAME_HEIGHT * 1.5) % config.TILE_SIZE) / 2;
    const xP = x * config.TILE_SIZE + config.TILE_SIZE / 2;
    const yP = y * config.TILE_SIZE + yOff;
    this.sprite.setPosition(xP, yP);
  }

  getBaddieTilePos() {
    const yOff = -((config.PLAYER_FRAME_HEIGHT * 1.5) % config.TILE_SIZE) / 2;

    const x =
      (this.sprite.getCenter().x - config.TILE_SIZE / 2) / config.TILE_SIZE;
    const y = (this.sprite.getCenter().y - yOff) / config.TILE_SIZE;

    return new Phaser.Math.Vector2(Math.floor(x), Math.floor(y));
  }

  setFinder() {
    this.Finder.enableDiagonals();

    const grid = [];
    for (let y = 0; y < this.tileMap.height; y++) {
      const col = [];
      for (let x = 0; x < this.tileMap.width; x++) {
        col.push(this.getTileID(x, y));
      }
      grid.push(col);
    }

    this.Finder.setGrid(grid);

    const tileset = this.tileMap.tilesets[0];

    const properties = tileset.tileProperties;
    const acceptableTiles = [];
  
    for (let i = tileset.firstgid - 1; i < tileset.total; i++) {
      if (!properties[i].collides || !properties[i].isTreasure) {
        const tileId = this.getTileID(
          tileset.texCoordinates[i].x,
          tileset.texCoordinates[i].y
        );
        acceptableTiles.push(tileId); // +1
      }
    }

    this.Finder.setAcceptableTiles(acceptableTiles);
  }

  getPathToPlayer(interval = 100) {
    // interval = 100;
    setInterval(() => {
      try {
        this.searchPath();
      } catch (err) {
        //do nothing
      }
      this.Finder.calculate();
    }, interval);
  }

  searchPath() {
    const pos = this.player.getTilePos();
    const badPos = this.getBaddieTilePos();
    const toX = Math.floor(pos.x);
    const toY = Math.floor(pos.y);
    const fromX = Math.floor(badPos.x);
    const fromY = Math.floor(badPos.y);
    // console.log(`From: (${fromX},${fromY})`, `To: (${toX},${fromY})`)
    this.Finder.findPath(fromX, fromY, toX, toY, (path) => {
      if (path !== null) {
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
    const tile = this.tileMap.getTileAt(x, y, true);
    return tile && tile.index;
  }

  moveBaddie(path, callback) {
    const tween = [];
    const duration = 500;
    for (let i = 0; i < path.length - 1; i++) {
      const ex = path[i + 1].x;
      const ey = path[i + 1].y;

      tween.push({
        targets: this.sprite,
        props: {
          x: { value: ex * config.TILE_SIZE, duration: duration },
          y: { value: ey * config.TILE_SIZE, duration: duration },
        },
      });
    }

    callback(tween);
  }
}
