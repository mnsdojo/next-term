import http from "node:http";
import { spawn } from "node-pty";
import { createServer } from "./server";

import { WebSocketServer } from "ws";

const port = process.env.PORT || 5001;
const app = createServer();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  const ptyProcess = spawn("bash", [], {
    name: "xterm-color",
    // cwd: process.env.HOME,
    env: process.env,
  });

  ws.on("message", (message) => {
    // console.log(`receieved - ${message}`);

    try {
      const data = JSON.parse(message.toString());
      switch (data.type) {
        case "command":
          ptyProcess.write(data.command + "\n");
          break;
        default:
          console.error("Unknown message type: ", data.type);
      }
    } catch (error) {
      console.error("Error parsing JSON:", error);
    }
  });

  ws.on("close", () => {
    console.log("Closed ws");
  });
  ptyProcess.onData((data) => {
    console.log(data);
    const message = JSON.stringify({
      type: "data",
      data,
    });
    ws.send(message);
  });
});

server.listen(port, () => {
  console.log(`Listening on port :${port}`);
});
