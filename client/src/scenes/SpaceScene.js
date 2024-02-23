import { Scene, Input } from "phaser";
import { Ship } from "../space/Ship";
import { PlayerShip } from "../space/PlayerShip";
import { Planet } from "../space/Planet";

export class SpaceScene extends Scene {
  constructor() {
    super({
      key: "Space",
      physics: {
        default: "arcade",
        arcade: {
          gravity: { y: 0 },
        },
      },
    });
  }

  create() {
    this.cameras.main.setBackgroundColor(0x222222);
    this.add.tileSprite(0, 0, 1024 * 2, 768 * 2, "space_background1");

    this.otherPlayers = this.physics.add.group();

    this.planets = [];

    this.addPlanet(200, 200, 200, 200, "planet2");
    this.addPlanet(800, 450, 150, 150, "planet4");
    this.addPlanet(350, 750, 250, 250, "planet3");

    this.input.keyboard.on("keydown-ENTER", (event) => {
      if (this.selectedPlanet) {
        window.socket.emit("playerExitLocation", {
          playerId: this.player.id,
          location: this.location,
        });

        this.player.destroy();

        this.scene.start("Planet", { name: this.selectedPlanet.name });
      }
    });

    this.initMuliplayer();
  }

  init(data) {
    this.location = this.scene.key;

    window.socket.emit("playerEnterLocation", {
      location: this.location,
      playerId: window.socket.id,
    });
  }

  initMuliplayer() {
    window.socket.removeAllListeners();

    window.socket.on("currentPlayers", (players) => {
      players.forEach((p) => {
        if (p.playerId === window.socket.id) {
          this.addPlayer(p);
        } else {
          this.addOtherPlayers(p);
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

      otherPlayer.setPosition(data.space.x, data.space.y);
      otherPlayer.setRotation(data.space.rotation);
    });
  }

  update() {
    if (this.player) {
      this.player?.update();
    }
    this.planets.forEach((planet) => planet.update());
  }

  addPlayer(data) {
    this.player = new PlayerShip(this, data.space.x, data.space.y, data);
  }

  addOtherPlayers(data) {
    const otherPlayer = new Ship(this, data.space.x, data.space.y, data);
    this.otherPlayers.add(otherPlayer);
  }

  addPlanet(x, y, width, height, id) {
    this.planets.push(new Planet(this, x, y, width, height, id));
  }
}
