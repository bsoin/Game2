import { Boot } from "./scenes/Boot";
import { SpaceScene } from "./scenes/SpaceScene";
import { PlanetScene } from "./scenes/PlanetScene";
import { GameOver } from "./scenes/GameOver";
import { MainMenu } from "./scenes/MainMenu";
import { Preloader } from "./scenes/Preloader";

const config = {
  type: Phaser.AUTO,
  width: 1024,
  height: 768,
  parent: "game-container",
  backgroundColor: "#4E7BB1",
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
      gravity: { y: 1000 },
    },
  },
  scene: [Boot, Preloader, MainMenu, SpaceScene, PlanetScene, GameOver],
};

const game = new Phaser.Game(config);

export default game;
