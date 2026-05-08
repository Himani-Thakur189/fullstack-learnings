const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/sse", (req, res) => {
  // Set headers to indicate that this is an SSE stream

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Connection", "keep-alive");

  res.write("Welcome to server send events");
  // double /n is used to separate different events
  // Because in SSE (Server-Sent Events), the browser needs a way to know: when one event ends and another begins.
  // The double newline (`\n\n`) serves as a delimiter to indicate the end of one event and the start of the next.
  // This allows the browser to correctly parse and handle each event as it arrives from the server.
  //“This event is finished. Now process it.”

  const intervalId = setInterval(() => {
    res.write(`data:  Server time:${new Date()}\n\n`);
  }, 3000);

  req.on("close", () => {
    clearInterval(intervalId);
  });
});

app.listen(3000, () => {
  console.log("Server is listening on port : 3000");
});
