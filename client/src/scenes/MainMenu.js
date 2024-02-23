import { Scene } from "phaser";
import { io } from "socket.io-client";

export class MainMenu extends Scene {
  constructor() {
    super("MainMenu");
  }

  create() {
    document.getElementById("ui").style.display = "block";

    const nameInput = document.querySelector("#name-input input");
    const characterImages = document.querySelectorAll("#select-character img");
    const savedName = window.localStorage.getItem("name");
    const savedCharacter = window.localStorage.getItem("character");

    if (savedName) {
      nameInput.value = savedName;
    }

    nameInput.addEventListener("change", (event) =>
      window.localStorage.setItem("name", event.target.value)
    );

    characterImages.forEach((element) => {
      if (
        savedCharacter &&
        element.attributes["data-character"].value === savedCharacter
      ) {
        element.classList.add("selected");
      }

      element.addEventListener("click", (event) => {
        characterImages.forEach((i) => i.classList.remove("selected"));
        event.target.classList.add("selected");

        const selectedCharacter =
          event.target.attributes["data-character"].value;

        window.localStorage.setItem("character", selectedCharacter);
      });

      this.start();
    });

    document
      .getElementById("start-game")
      .addEventListener("click", () => this.start());
  }

  start() {
    document.getElementById("ui").style.display = "none";

    const name = window.localStorage.getItem("name");
    const character = window.localStorage.getItem("character");

    window.socket = io(`ws://localhost:3000`, {
      query: `name=${name}&character=${character}`,
    });

    window.socket.on("playerConnected", (data) => {
      if (data.playerId === window.socket.id) {
        const [location, locationDetails] = data.location.split(":");
        console.log(this);
        this.scene.start(
          location,
          locationDetails ? { ...data, name: locationDetails } : data
        );
      }
    });
  }
}
