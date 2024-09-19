import http from "node:http";
import { createServer } from "./server";

import { WebSocketServer } from "ws";

const port = process.env.PORT || 5001;
const app = createServer();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  ws.on("message", (data) => {
    ws.send(`echo : ${data}`);
  });
});
server.listen(port, () => {
  console.log(`Listening on port :${port}`);
});
