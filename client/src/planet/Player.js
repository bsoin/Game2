import Character from "./Character";

const WALK_VELOCITY = 250;
const JUMP_VELOCITY = 600;
const CLIMB_VELOCITY = 300;

export default class Player extends Character {
  constructor(scene, x, y, playerInfo) {
    super(scene, x, y, playerInfo);

    this.name = playerInfo.planet.character;

    this.cursors = this.scene.input.keyboard.createCursorKeys();

    scene.physics.add.existing(this);
    scene.physics.add.collider(scene.groundLayer, this);

    this.setBodySize(70, 128);
    // this.setOffset(13, 28);

    this.debugShowVelocity = true;
  }

  update() {
    const run = this.cursors.shift.isDown;
    const velocity = run ? WALK_VELOCITY * 2 : WALK_VELOCITY;
    const animation = run ? `${this.name}-run` : `${this.name}-walk`;

    // move left/right
    if (this.cursors.left.isDown) {
      this.body.setVelocityX(-velocity);
      this.anims.play(animation, true);
      this.flipX = true;
    } else if (this.cursors.right.isDown) {
      this.body.setVelocityX(velocity);
      this.anims.play(animation, true);
      this.flipX = false;
    } else {
      this.body.setVelocityX(0);
      this.anims.play(`${this.name}-idle`, true);
    }

    // jump
    if (this.cursors.space.isDown && this.body.onFloor()) {
      this.body.setVelocityY(-JUMP_VELOCITY);
    }

    // play jumping and falling animations
    if (!this.body.onFloor()) {
      if (this.body.velocity.y < 0) {
        this.anims.play(`${this.name}-jump`, true);
      } else {
        this.anims.play(`${this.name}-fall`, true);
      }
    }

    // climbing ladders
    if (this.cursors.up.isDown) {
      if (this.isNear("Ladders")) {
        this.body.setVelocityY(-CLIMB_VELOCITY);
        this.anims.play(`${this.name}-climb`, true);
      }
    }

    this.emitPlayerMovement();
  }

  isNear(layer) {
    const laddersLayer = this.scene.map
      .getLayer(layer)
      .tilemapLayer.getTilesWithinWorldXY(
        this.x - 50,
        this.y - 50,
        this.width + 100,
        this.height + 100,
        { isNotEmpty: true }
      );

    return this.scene.physics.overlapTiles(this, laddersLayer);
  }

  emitPlayerMovement() {
    const { x, y, anims } = this;

    if (
      this.oldPosition &&
      (x !== this.oldPosition.x || y !== this.oldPosition.y)
    ) {
      window.socket.emit("playerMovement", {
        location: this.scene.location,
        planet: {
          x,
          y,
          animationFrame: anims.currentFrame.textureFrame,
        },
      });
    }

    this.oldPosition = { x, y };
  }
}
