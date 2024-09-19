"use client";

import { useEffect, useRef, useState } from "react";
import { Terminal } from "@xterm/xterm";
import "@xterm/xterm/css/xterm.css";

interface WebSocketMessage {
  type: string;
  data?: string;
}
const WEBSOCKET_URL = "ws://localhost:5001";
function Xterrminal() {
  const terminalRef = useRef<HTMLDivElement>(null);
  const terminalInstance = useRef<Terminal | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!terminalRef.current) return;
    terminalInstance.current = new Terminal({
      cursorBlink: true,
      theme: {
        background: "#1e1e1e",
        foreground: "#ffffff",
      },
    });

    terminalInstance.current.open(terminalRef.current);
    terminalInstance.current.writeln("Welcome to the terminal!");
    return () => {
      if (terminalInstance.current) {
        terminalInstance.current.dispose();
      }
    };
  }, []);

  useEffect(() => {
    wsRef.current = new WebSocket(WEBSOCKET_URL);

    wsRef.current.onopen = () => {
      console.log("WebSocket connection established.");
      setIsConnected(true);
      setError(null);
      if (terminalInstance.current) {
        terminalInstance.current.writeln("Connected to server");
      }
    };

    wsRef.current.onerror = (error: Event) => {
      console.error("WebSocket connection error:", error);
      setIsConnected(false);
      setError("Failed to connect to server");
    };

    wsRef.current.onclose = () => {
      console.log("WebSocket connection closed.");
      setIsConnected(false);
      if (terminalInstance.current) {
        terminalInstance.current.writeln("Disconnected from server");
      }
    };

    wsRef.current.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);
        console.log(event);
        if (
          message.type === "data" &&
          terminalInstance.current &&
          message.data
        ) {
          // Directly write the received data to the terminal
          terminalInstance.current.write(message.data);
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
        if (terminalInstance.current && error instanceof Error) {
          terminalInstance.current.writeln(`Error: ${error.message}`);
        }
      }
    };
  }, []);
  return (
    <div className="w-full h-80 border-gray-700 rounded-lg overflow-hidden text-white">
      <div ref={terminalRef} className="h-64" />
    </div>
  );
}

export default Xterrminal;
