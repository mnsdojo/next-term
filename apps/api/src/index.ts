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
    env: process.env,
  });

  ws.on("message", (message) => {
    try {
      const data = JSON.parse(message.toString());
      if (data.type === "command") {
        ptyProcess.write(data.data);
      }
    } catch (error) {
      console.error("Error parsing JSON:", error);
    }
  });

  ws.on("close", () => {
    console.log("WebSocket connection closed");
    ptyProcess.kill();
  });

  ptyProcess.onData((data) => {
    ws.send(
      JSON.stringify({
        type: "data",
        data,
      })
    );
  });
});

server.listen(port, () => {
  console.log(`Server listening on port: ${port}`);
});
