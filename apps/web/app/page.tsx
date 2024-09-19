import React from "react";
import XTerminal from "./components/Xterrminal";

function Page() {
  return (
    <div className="flex flex-col h-screen bg-gray-800 text-white">
      <div className="flex-grow justify-center items-center  flex flex-col">
        <h1 className="text-5xl font-bold mb-6">xTerm</h1>
        <XTerminal />
      </div>
    </div>
  );
}

export default Page;
