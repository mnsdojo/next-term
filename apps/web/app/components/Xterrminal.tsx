"use client";
import { useEffect, useRef, useState } from "react";
import { Terminal } from "@xterm/xterm";
import "@xterm/xterm/css/xterm.css";

const WEBSOCKET_URL = "ws://localhost:5001";
const ws = new WebSocket(WEBSOCKET_URL);
const terminal = new Terminal({
  cursorBlink: true,
  theme: { background: "#1e1e1e", foreground: "#ffffff" },
});

function Xterrminal() {
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!terminalRef.current) return;

    terminal.open(terminalRef.current);

    terminal.onKey(({ key, domEvent }) => {
      ws.send(
        JSON.stringify({
          type: "command",
          data: key,
        })
      );
    });

    return () => {
      terminal.clear();
    };
  }, [terminalRef]);

  useEffect(() => {
    const onOpen = () => {
      terminal.writeln("Connected to server");
    };

    const onClose = () => {
      terminal.writeln("Disconnected from server");
    };

    const onMessage = (event: MessageEvent) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === "data" && message.data) {
          terminal.write(message.data);
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    ws.addEventListener("open", onOpen);
    ws.addEventListener("close", onClose);
    ws.addEventListener("message", onMessage);

    if (ws.readyState === WebSocket.OPEN) {
      onOpen();
    }

    return () => {
      ws.removeEventListener("open", onOpen);
      ws.removeEventListener("close", onClose);
      ws.removeEventListener("message", onMessage);
    };
  }, []);

  return (
    <div className="w-full h-80 border-gray-700 rounded-lg overflow-hidden text-white">
      <div ref={terminalRef} className="h-64" />
    </div>
  );
}

export default Xterrminal;
