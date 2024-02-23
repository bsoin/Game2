import { Physics } from "phaser";

export default class Character extends Physics.Arcade.Sprite {
  constructor(scene, x, y, playerInfo) {
    super(scene, x, y, `character-${playerInfo.planet.character}`);

    this.id = playerInfo.playerId;
    this.name = playerInfo.name;

    this.scene = scene;
    this.scene.add.existing(this);
  }

  //   create() {
  //     console.log("create");
  //     this.followText = this.add.text(0, 0, this.name);
  //   }

  //   update() {
  //     console.log("update");
  //     this.followText.setPosition(this.x, this.y);
  //   }
}
