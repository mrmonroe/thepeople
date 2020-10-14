import Phaser from "phaser";
import Baddie from "./Baddie";

export default class BaddieFactory {
  constructor(scene) {
    this.scene = scene;
    this.group = [];
    this.spriteKeys = [];
    this.sprites = [];
  }

  preLoadBaddies(key, img, width, height, amount = 1) {
    for (let i = 0; i < amount; i++) {
      const k = `${key}-${i}`;
      this.scene.load.spritesheet(k, img, {
        frameWidth: width,
        frameHeight: height,
      });
      this.spriteKeys.push(k);
    }
  }

  generateSprites(depth, scale) {
    for (let i = 0; i < this.spriteKeys.length; i++) {
      let tileX = Math.floor(Phaser.Math.Between(2, 19));
      let tileY = Math.floor(Phaser.Math.Between(2, 19));

      let sprite = this.scene.physics.add.sprite(0, 0, this.spriteKeys[i]);
      sprite.setDepth(0);

      sprite.setPosition(tileX, tileY);

      this.sprites.push(sprite);
    }
  }

  createBaddies(tileMap, player, tweens, tileX = null, tileY = null) {
    for (let i = 0; i < this.sprites.length; i++) {
      if (!tileX || !tileY) {
        tileX = Math.floor(Phaser.Math.Between(2, 19));
        tileY = Math.floor(Phaser.Math.Between(2, 19));
      }
      let newBaddie = new Baddie(
        this.sprites[i],
        tileX,
        tileY,
        tileMap,
        player,
        tweens
      );
      newBaddie.setBaddiePosition(tileX, tileY);
      this.group.push(newBaddie);
    }
  }

  getGroup() {
    return this.group;
  }

  setFinders() {

    this.group.forEach((baddie) => {
      baddie.setFinder();
    });
  }

  getPathToPlayer(interval = 100) {
    this.group.forEach((baddie) => {
      baddie.getPathToPlayer(interval);
    });
  }

  startBaddies(ms = 500) {
    this.setFinders();

    this.scene.time.delayedCall(
        ms,
        () => {
            this.getPathToPlayer(2000);
        },
        [],
        this
      );
    
  }

  handleGroupCollide(){
    for(let i = 0; i+1 < this.group.length; i++){
        if (Phaser.Geom.Intersects.RectangleToRectangle(this.group[i].sprite.getBounds(),this.group[i+1].sprite.getBounds())){
            let tileX = Math.floor(Phaser.Math.Between(1, 5));
            let tileY = Math.floor(Phaser.Math.Between(1, 7));   
            
            
            this.group[i].setBaddiePosition(tileX,tileY)
            }
        
        }
  }

}
