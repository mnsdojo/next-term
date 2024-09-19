"use client";
import { useEffect, useRef, useMemo } from "react";
import { Terminal } from "@xterm/xterm";
import "@xterm/xterm/css/xterm.css";

const WEBSOCKET_URL = "ws://localhost:5001";
const terminal = new Terminal({ cursorBlink: true });

function Xterrminal() {
  const terminalRef = useRef<HTMLDivElement>(null);
  const ws = useMemo(() => new WebSocket(WEBSOCKET_URL), []);

  useEffect(() => {
    if (!terminalRef.current) return;
    terminal.open(terminalRef.current);

    terminal.onData((data) => {
      ws.send(
        JSON.stringify({
          type: "command",
          data: data,
        })
      );
    });

    return () => {
      terminal.clear();
    };
  }, [terminalRef, ws]);

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
  }, [terminalRef, ws]);

  return (
    <div className="w-full h-80 border-gray-700 rounded-lg overflow-hidden text-white">
      <div ref={terminalRef} className="h-64" />
    </div>
  );
}

export default Xterrminal;
