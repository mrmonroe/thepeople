import Phaser from "phaser";
import config from "./config/Config";

export default class GridPhysics {
  constructor(player, tileMap, cameras) {
    this.player = player;
    this.tileMap = tileMap;
    this.cameras = cameras;
    this.movementDirection = config.DIRECTION.NONE;
    this.speedPixelsPerSecond = config.TILE_SIZE * config.SPEED.WALKING;
    this.tileSizePixelsWalked = 0;
    this.decimalPlacesLeft = 0;

    this.movementDirectionVectors = {
      [config.DIRECTION.UP]: Phaser.Math.Vector2.UP,
      [config.DIRECTION.DOWN]: Phaser.Math.Vector2.DOWN,
      [config.DIRECTION.LEFT]: Phaser.Math.Vector2.LEFT,
      [config.DIRECTION.RIGHT]: Phaser.Math.Vector2.RIGHT,
    };
  }

  movePlayer(direction) {
    if (this.isMoving()) {
      return;
    }
    if (this.isBlockingDirection(direction)) {
      this.player.setStandingFrame(direction);
    } else {
      this.startMoving(direction);
    }
  }

  update(delta) {
    if (this.isMoving()) {
      this.updatePlayerPosition(delta);
    }
  }

  isMoving() {
    return this.movementDirection !== config.DIRECTION.NONE;
  }

  startMoving(direction) {
    this.movementDirection = direction;
  }

  changeSpeed(speed){
    this.speedPixelsPerSecond = config.TILE_SIZE * speed;
  }
  updatePlayerPosition(delta) {
    this.decimalPlacesLeft = this.getDecimalPlaces(
      this.getSpeedPerDelta(delta) + this.decimalPlacesLeft
    );
    const pixelsToWalkThisUpdate = this.getIntegerPart(
      this.getSpeedPerDelta(delta) + this.decimalPlacesLeft
    );

    if (this.willCrossTileBorderThisUpdate(pixelsToWalkThisUpdate)) {
      this.movePlayerSpriteRestOfTile();
    } else {
      this.movePlayerSprite(pixelsToWalkThisUpdate);
    }
  }

  getSpeedPerDelta(delta) {
    const deltaInSeconds = delta / 1000;
    return this.speedPixelsPerSecond * deltaInSeconds;
  }

  getIntegerPart(float) {
    return Math.floor(float);
  }

  getDecimalPlaces(float) {
    return float % 1;
  }

  willCrossTileBorderThisUpdate(pixelsToWalkThisUpdate) {
    return (
      this.tileSizePixelsWalked + pixelsToWalkThisUpdate >= config.TILE_SIZE
    );
  }

  movePlayerSpriteRestOfTile() {
    this.movePlayerSprite(config.TILE_SIZE - this.tileSizePixelsWalked);
    this.stopMoving();
  }

  stopMoving() {
    this.movementDirection = config.DIRECTION.NONE;
  }

  movePlayerSprite(speed) {
    const newPlayerPos = this.player
      .getPosition()
      .add(this.movementDistance(speed));

    this.player.setPosition(newPlayerPos.x, newPlayerPos.y);
    this.tileSizePixelsWalked += speed;
    this.updatePlayerFrame(this.movementDirection, this.tileSizePixelsWalked);
    this.tileSizePixelsWalked %= config.TILE_SIZE;
  }

  movementDistance(speed) {
    return this.movementDirectionVectors[this.movementDirection]
      .clone()
      .multiply(new Phaser.Math.Vector2(speed));
  }

  updatePlayerFrame(direction, tileSizePixelsWalked) {
    if (this.hasWalkedHalfATile(tileSizePixelsWalked)) {
      this.player.setStandingFrame(direction);
    } else {
      this.player.setWalkingFrame(direction);
    }
  }

  hasWalkedHalfATile(tileSizePixelsWalked) {
    return tileSizePixelsWalked > config.TILE_SIZE / 2;
  }

  tilePosInDirection(direction) {
    return this.player
      .getTilePos()
      .add(this.movementDirectionVectors[direction]);
  }

  isBlockingDirection(direction) {
    return this.hasBlockingTile(this.tilePosInDirection(direction));
  }

  hasNoTile(pos) {
    return !this.tileMap.layers.some((layer) =>
      this.tileMap.hasTileAt(pos.x, pos.y, layer.name)
    );
  }

  hasBlockingTile(pos) {
    if (this.hasNoTile(pos)) {
      return true;
    }
    return this.tileMap.layers.some((layer) => {
      const tile = this.tileMap.getTileAt(pos.x, pos.y, false, layer.name);
      if(tile && tile.properties.isTreasure){
        this.player.hasWonTheScene()
      }
      return tile && tile.properties.collides;
    });
  }
}
