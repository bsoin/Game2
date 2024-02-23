import { Physics } from "phaser";

export class Ship extends Physics.Arcade.Sprite {
  constructor(scene, x, y, playerInfo) {
    super(scene, x, y, `${playerInfo.space.ship}-${playerInfo.space.color}`);

    this.id = playerInfo.playerId;

    this.scene = scene;
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);

    this.toggleFlipY()
      .setOrigin(0.5, 0.5)
      .setDisplaySize(53, 40)
      .setSize(100, 100)
      .setRotation(playerInfo.space.rotation);
  }

  update() {}
}
