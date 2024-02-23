import { Scene } from "phaser";

import Player from "../planet/Player";
import Character from "../planet/Character";
import OtherPlayer from "../planet/OtherPlayer";

export class PlanetScene extends Scene {
  player;

  constructor() {
    super("Planet");
  }

  init(data) {
    this.name = data.name;
    this.location = `Planet:${this.name}`;

    window.socket.emit("playerEnterLocation", {
      location: this.location,
      playerId: window.socket.id,
    });
  }

  create() {
    this.map = this.make.tilemap({ key: this.name });

    // const { width, height } = this.scale;
    this.add.image("planet_background3");

    this.otherPlayers = this.physics.add.group({
      immovable: true,
      allowGravity: false,
    });

    this.cursors = this.input.keyboard.createCursorKeys();

    this.createGround();

    this.input.keyboard.on("keydown-ESC", (event) => {
      window.socket.emit("playerExitLocation", {
        playerId: this.player.id,
        location: this.location,
      });

      this.player.destroy();

      this.scene.start("Space");
    });

    this.initMuliplayer();
  }

  createGround() {
    const commonTiles = this.map.addTilesetImage(`common_tiles`);
    const commonTiles2 = this.map.addTilesetImage(`common_tiles2`);

    this.groundLayer = this.map.createLayer(
      "World",
      [commonTiles, commonTiles2],
      0,
      120
    );
    this.groundLayer.setCollisionByExclusion([-1]);

    this.waterLayer = this.map.createLayer("Water", commonTiles, 0, 120);
    this.laddersLayer = this.map.createLayer("Ladders", commonTiles, 0, 120);
    this.decorationLayer = this.map.createLayer(
      "Decoration",
      commonTiles,
      0,
      120
    );

    this.physics.world.bounds.width = this.groundLayer.width;
    this.physics.world.bounds.height = this.groundLayer.height;
  }

  addPlayer(data) {
    this.player = new Player(this, data.planet.x, data.planet.y, data);

    this.createCamera();
  }

  createCamera() {
    this.cameras.main.setBounds(
      0,
      0,
      this.map.widthInPixels,
      this.map.heightInPixels
    );
    this.cameras.main.startFollow(this.player);
    this.cameras.main.setBackgroundColor("#ccedff");
  }

  initMuliplayer() {
    window.socket.removeAllListeners();

    window.socket.on("currentPlayers", (players) => {
      Object.values(players).forEach((properties) => {
        if (!properties.location?.startsWith(this.scene.key)) {
          return;
        }

        if (properties.playerId === window.socket.id) {
          this.addPlayer(properties);
        } else {
          this.addOtherPlayers(properties);
        }
      });
    });

    window.socket.on("playerEnterLocation", (data) => {
      if (data.playerId !== window.socket.id) {
        this.addOtherPlayers(data);
      }
    });

    window.socket.on("playerExitLocation", (data) => {
      const otherPlayer = this.otherPlayers
        .getChildren()
        .find((p) => p.id === data.playerId);

      otherPlayer.destroy();
    });

    window.socket.on("playerDisconnected", (playerId) => {
      const otherPlayer = this.otherPlayers
        .getChildren()
        .find((p) => p.id === playerId);

      otherPlayer.destroy();
    });

    window.socket.on("playerMoved", (data) => {
      const otherPlayer = this.otherPlayers
        .getChildren()
        .find((p) => p.id === data.playerId);

      otherPlayer.setPosition(data.planet.x, data.planet.y);
      otherPlayer.setFrame(data.planet.animationFrame);
    });
  }

  addOtherPlayers(data) {
    const otherPlayer = new OtherPlayer(
      this,
      data.planet.x,
      data.planet.y,
      data
    );
    this.otherPlayers.add(otherPlayer);
  }

  update() {
    if (this.player && this.player.scene) {
      this.player.update();
    }
  }
}
