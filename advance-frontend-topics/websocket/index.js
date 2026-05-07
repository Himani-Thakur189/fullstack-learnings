const express = require("express");
const app = express();
const http = require("http").createServer(app);

const { Server } = require("socket.io");
const io = new Server(http);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  socket.on("chat-message", (msg) => {
    console.log("Message received: " + msg);
    io.emit("chat-message", msg); // Broadcast the message to all clients
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });

  console.log("New client connected");
});

http.listen(3000, () => {
  console.log("Server is running on port 3000");
});
