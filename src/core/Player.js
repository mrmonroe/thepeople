import Phaser from "phaser";
import config from "./config/Config";

export default class Player {
  constructor(sprite, cIndex, xPos, yPos) {
    this.characterIndex = cIndex;
    this.startTilePosX = xPos;
    this.startTilePosY = yPos;
    this.sprite = sprite;
    this.sprite.scale = this.scaleFactor = 1.5;
    this.lastFootLeft = false;
    this.frameRow = {
      leftFoot: 0,
      standing: 0,
      rightFoot: 0,
    };

    this.directionToFrameRow = {
      [config.DIRECTION.DOWN]: 0,
      [config.DIRECTION.LEFT]: 1,
      [config.DIRECTION.RIGHT]: 2,
      [config.DIRECTION.UP]: 3,
    };
    const xP = this.startTilePosX * config.TILE_SIZE + this.playerOffsetX();
    const yP = this.startTilePosY * config.TILE_SIZE + this.playerOffsetY();
    this.sprite.setPosition(xP, yP);
    this.sprite.setFrame(
      this.framesOfDirection(config.DIRECTION.DOWN).standing
    );
  }

  getTilePos() {
    const x =
      (this.sprite.getCenter().x - this.playerOffsetX()) / config.TILE_SIZE;
    const y =
      (this.sprite.getCenter().y - this.playerOffsetY()) / config.TILE_SIZE;
    return new Phaser.Math.Vector2(Math.floor(x), Math.floor(y));
  }

  setPosition(x, y) {
    this.sprite.setPosition(x, y);
  }

  getPosition() {
    return this.sprite.getCenter();
  }

  playerOffsetX() {
    return config.TILE_SIZE / 2;
  }

  playerOffsetY() {
    return (
      -((config.PLAYER_FRAME_HEIGHT * this.scaleFactor) % config.TILE_SIZE) / 2
    );
  }

  setWalkingFrame(direction) {
    this.frameRow = this.framesOfDirection(direction);
    this.sprite.setFrame(
      this.lastFootLeft ? this.frameRow.rightFoot : this.frameRow.leftFoot
    );
  }

  setStandingFrame(direction) {
    if (this.isCurrentFrameStanding(direction)) {
      this.lastFootLeft = !this.lastFootLeft;
    }
    this.sprite.setFrame(this.framesOfDirection(direction).standing);
  }

  isCurrentFrameStanding(direction) {
    return (
      this.sprite.frame.name !== this.framesOfDirection(direction).standing
    );
  }

  framesOfDirection(direction) {
    const playerRow = Math.floor(this.characterIndex / config.CHARS_IN_ROW);
    const playerCol = this.characterIndex % config.CHARS_IN_ROW;
    const framesInRow = config.CHARS_IN_ROW * config.FRAMES_PER_CHAR_ROW;
    const framesInSameRowBefore = config.FRAMES_PER_CHAR_ROW * playerCol;
    const rows =
      this.directionToFrameRow[direction] +
      playerRow * config.FRAMES_PER_CHAR_COL;
    const startFrame = framesInSameRowBefore + rows * framesInRow;
    return {
      leftFoot: startFrame,
      standing: startFrame + 1,
      rightFoot: startFrame + 2,
    };
  }
}
