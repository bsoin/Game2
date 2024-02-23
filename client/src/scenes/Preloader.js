import { Scene } from "phaser";

export class Preloader extends Scene {
  static CHARACTERS = ["girl1", "girl2", "boy1", "boy2", "robot", "zombie"];
  static MAPS = ["planet2", "planet3", "planet4"];

  constructor() {
    super("Preloader");
  }

  init() {
    this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);

    const bar = this.add.rectangle(512 - 230, 384, 4, 28, 0xffffff);

    this.load.on("progress", (progress) => {
      bar.width = 4 + 460 * progress;
    });
  }

  preload() {
    this.load.setPath("assets");

    this.loadUi();

    this.loadBackgrounds();
    this.loadShips();
    this.loadPlanets();

    this.loadCharacters();
    this.loadMaps();
  }

  loadUi() {
    this.load.atlasXML(`ui`, `ui/sprites.png`, `ui/sheet.xml`);
  }

  loadBackgrounds() {
    for (let i = 1; i <= 4; i++) {
      this.load.image(
        `space_background${i}`,
        `backgrounds/space_background${i}.png`
      );
      this.load.image(
        `planet_background${i}`,
        `backgrounds/planet_background${i}.png`
      );
    }
  }

  loadShips() {
    const ships = ["ship1", "ship2", "ship3"];
    const colors = ["blue", "red", "green", "orange"];

    ships.forEach((ship) => {
      colors.forEach((color) => {
        this.load.image(`${ship}-${color}`, `ships/${ship}_${color}.png`);
      });
    });

    this.load.image(`ships/fire1`, `ships/fire01.png`);
  }

  loadPlanets() {
    for (let i = 0; i <= 9; i++) {
      this.load.image(`planet${i}`, `planets/planet${i}.png`);
    }
  }

  loadMaps() {
    Preloader.MAPS.forEach((name) => {
      this.load.tilemapTiledJSON(`${name}`, `maps/${name}.json`);

      this.load.spritesheet(`common_tiles`, `maps/common_tiles.png`, {
        frameWidth: 70,
        frameHeight: 70,
      });

      this.load.spritesheet(`common_tiles2`, `maps/common_tiles2.png`, {
        frameWidth: 70,
        frameHeight: 70,
      });
    });
  }

  loadCharacters() {
    Preloader.CHARACTERS.forEach((name) => {
      this.load.atlasXML(
        `character-${name}`,
        `characters/${name}/sprites.png`,
        `characters/${name}/sheet.xml`
      );
    });
  }

  createAnimations(name) {
    this.anims.create({
      key: `${name}-walk`,
      frames: this.anims.generateFrameNames(`character-${name}`, {
        prefix: "walk",
        start: 0,
        end: 7,
        zeroPad: 0,
      }),
      frameRate: 20,
      repeat: -1,
    });

    this.anims.create({
      key: `${name}-run`,
      frames: this.anims.generateFrameNames(`character-${name}`, {
        prefix: "run",
        start: 0,
        end: 2,
        zeroPad: 0,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: `${name}-idle`,
      frames: [{ key: `character-${name}`, frame: "idle" }],
      frameRate: 1,
    });

    this.anims.create({
      key: `${name}-jump`,
      frames: [{ key: `character-${name}`, frame: "jump" }],
      frameRate: 1,
    });

    this.anims.create({
      key: `${name}-fall`,
      frames: [{ key: `character-${name}`, frame: "fall" }],
      frameRate: 1,
    });

    this.anims.create({
      key: `${name}-climb`,
      frames: this.anims.generateFrameNames(`character-${name}`, {
        prefix: "climb",
        start: 0,
        end: 1,
        zeroPad: 0,
      }),
      frameRate: 24,
      repeat: -1,
    });
  }

  create() {
    Preloader.CHARACTERS.forEach((name) => {
      this.createAnimations(name);
    });

    this.scene.start("MainMenu");
  }
}
