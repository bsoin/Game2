import { Ship } from "./Ship";

export class PlayerShip extends Ship {
  constructor(scene, x, y, playerInfo) {
    super(scene, x, y, playerInfo);

    this.cursors = this.scene.input.keyboard.createCursorKeys();

    this.location = playerInfo.location;

    this.setDrag(100);
    this.setAngularDrag(100);
    this.setMaxVelocity(200);

    this.scene.physics.add.existing(this);
  }

  update() {
    if (!this.scene) {
      return;
    }

    this.scene.physics.world.wrap(this, 5);

    if (this.cursors.left.isDown) {
      this.setAngularVelocity(-150);
    } else if (this.cursors.right.isDown) {
      this.setAngularVelocity(150);
    } else {
      this.setAngularVelocity(0);
    }

    if (this.cursors.up.isDown) {
      this.scene.physics.velocityFromRotation(
        this.rotation + 1.5,
        100,
        this.body.acceleration
      );
    } else {
      this.setAcceleration(0);
    }

    this.emitPlayerMovement();
  }

  emitPlayerMovement() {
    // // emit player movement
    const { x, y, rotation, location } = this;

    if (
      this.oldPosition &&
      (x !== this.oldPosition.x ||
        y !== this.oldPosition.y ||
        rotation !== this.oldPosition.rotation)
    ) {
      window.socket.emit("playerMovement", {
        location: location,
        space: {
          x,
          y,
          rotation,
          velocity: this.body.velocity,
        },
      });
    }
    // save old position data
    this.oldPosition = {
      x,
      y,
      rotation,
    };
  }
}
