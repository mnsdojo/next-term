"use client";

import "@xterm/xterm/css/xterm.css";
import { Terminal } from "@xterm/xterm";
import { useEffect, useRef } from "react";

interface XTerminalProps {}

const terminal = new Terminal();
function Xterrminal() {
  const terminalRef = useRef<HTMLDivElement | null>(null);
  const terminal = useRef<Terminal | null>(null);
  useEffect(() => {
    if (!terminalRef.current) return;

    terminal.current = new Terminal({
      cursorBlink: true,
      theme: {
        background: "#1e1e1e",
        foreground: "#ffffff",
        
      },
    });
    terminal.current.open(terminalRef.current);
    terminal.current.write("Welcome to xTerm!\r\n");
    terminal.current.write("Type anything...\r\n");

    return () => {
      terminal.current?.dispose();
    };
  }, []);
  return (
    <div
      className="w-full h-80 border-gray-700 rounded-lg overflow-hidden"
      ref={terminalRef}
    ></div>
  );
}

export default Xterrminal;
