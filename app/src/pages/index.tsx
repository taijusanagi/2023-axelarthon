import React, { useState } from "react";

import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

const App: React.FC = () => {
  // States
  const [bytecode, setBytecode] = useState<string>("");
  const [selectedNetworks, setSelectedNetworks] = useState<string[]>([]);

  // Helper function to handle checkbox state change
  const handleNetworkChange = (network: string) => {
    if (selectedNetworks.includes(network)) {
      setSelectedNetworks((prev) => prev.filter((net) => net !== network));
    } else {
      setSelectedNetworks((prev) => [...prev, network]);
    }
  };

  return (
    <div>
      <header>
        <div style={{ float: "right" }}>
          <button>Connect Wallet</button>
        </div>
      </header>
      <main>
        <div>
          <label>
            Bytecode:
            <textarea
              value={bytecode}
              onChange={(e) => setBytecode(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            Target Network:
            <div>
              <input
                type="checkbox"
                value="network1"
                checked={selectedNetworks.includes("network1")}
                onChange={() => handleNetworkChange("network1")}
              />{" "}
              Network 1
            </div>
            <div>
              <input
                type="checkbox"
                value="network2"
                checked={selectedNetworks.includes("network2")}
                onChange={() => handleNetworkChange("network2")}
              />{" "}
              Network 2
            </div>
            {/* You can add more networks if needed */}
          </label>
        </div>
        <button>Deploy</button>
      </main>
    </div>
  );
};

export default App;
