import { Physics } from "phaser";

export class Planet extends Physics.Arcade.Sprite {
  constructor(scene, x, y, width, height, name) {
    super(scene, x, y, name);

    this.name = name;
    this.defaultSize = { width, height };

    this.scene = scene;
    // this.scene.physics.world.enable(this);
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);

    this.setDisplaySize(width, height);

    this.body.setSize(this.width, this.height);
    this.body.isCircle = true;
    this.body.immovable = true;
  }

  update() {
    if (this.scene.physics.overlap(this, this.scene.player)) {
      this.setDisplaySize(
        this.defaultSize.width * 1.1,
        this.defaultSize.height * 1.1
      );

      this.scene.selectedPlanet = this;
    } else {
      this.setDisplaySize(this.defaultSize.width, this.defaultSize.height);

      if (this.scene.selectedPlanet === this) {
        this.scene.selectedPlanet = null;
      }
    }
  }
}
