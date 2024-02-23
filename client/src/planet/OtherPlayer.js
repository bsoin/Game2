import Character from "./Character";

export default class OtherPlayer extends Character {
  constructor(scene, x, y, playerInfo) {
    super(scene, x, y, playerInfo);

    scene.physics.add.existing(this);
    scene.physics.add.collider(scene.groundLayer, this);

    this.body.setImmovable(true);
    this.body.setAllowGravity(false);

    this.setBodySize(70, 128);
  }
}
