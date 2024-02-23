import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:8080", "http://bsoin.local:8080"],
  },
});

const STARTING_LOCATION = "Planet:planet2";
const ships = ["ship1", "ship2", "ship3"];
const colors = ["red", "blue", "green", "orange"];
const players = {};

function onConnect(socket) {
  const { name, character } = socket.handshake.query;

  console.log(`✨ ${name} (${socket.id}) connected`);

  const newPlayer = {
    playerId: socket.id,
    name,
    location: STARTING_LOCATION,
    space: {
      x: Math.floor(Math.random() * 700) + 50,
      y: Math.floor(Math.random() * 500) + 50,
      rotation: Math.floor(Math.random() * 360),
      ship: ships[Math.floor(Math.random() * ships.length)],
      color: colors[Math.floor(Math.random() * colors.length)],
    },
    planet: {
      x: 150,
      y: 200,
      direction: 1,
      animationFrame: "idle",
      character,
    },
  };

  socket.join(newPlayer.location);

  players[socket.id] = newPlayer;

  socket.emit("playerConnected", newPlayer);
}

function onDisconnect(socket) {
  console.log(`🔌 ${players[socket.id].name} (${socket.id}) disconnected`);

  const player = players[socket.id];

  socket.to(player.location).emit("playerDisconnected", socket.id);
  delete players[socket.id];
}

async function onPlayerMovement(socket, movementData) {
  const player = players[socket.id];

  if (movementData.planet) {
    player.planet.x = movementData.planet.x;
    player.planet.y = movementData.planet.y;
    player.planet.animationFrame = movementData.planet.animationFrame;
  }

  if (movementData.space) {
    player.space.x = movementData.space.x;
    player.space.y = movementData.space.y;
    player.space.rotation = movementData.space.rotation;
  }

  // emit movement to players in the same location
  socket.to(movementData.location).emit("playerMoved", player);
}

async function onPlayerEnterLocation(socket, data) {
  console.log(`➡️ ${players[socket.id].name} entering ${data.location}`);

  players[socket.id].location = data.location;

  socket.join(data.location);

  const currentPlayers = await getPlayersInLocation(data.location);
  socket.emit("currentPlayers", currentPlayers);
  socket.to(data.location).emit("playerEnterLocation", players[socket.id]);
}

async function onPlayerExitLocation(socket, data) {
  console.log(`⬅️ ${players[socket.id].name} exiting ${data.location}`);

  players[socket.id].location = null;

  socket.leave(data.location);
  socket.to(data.location).emit("playerExitLocation", data);
}

async function getPlayersInLocation(location) {
  return (await io.in(location).fetchSockets()).map(
    (socket) => players[socket.id]
  );
}

io.on("connection", (socket) => {
  onConnect(socket);

  socket.on("disconnect", () => {
    onDisconnect(socket);
  });

  socket.on("playerEnterLocation", async (data) => {
    await onPlayerEnterLocation(socket, data);
  });

  socket.on("playerExitLocation", async (data) => {
    await onPlayerExitLocation(socket, data);
  });

  socket.on("playerMovement", async (data) => {
    await onPlayerMovement(socket, data);
  });
});

httpServer.listen(3000);
