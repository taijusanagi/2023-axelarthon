import React, { useState } from "react";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

const App: React.FC = () => {
  const [bytecode, setBytecode] = useState<string>("");
  const [selectedNetworks, setSelectedNetworks] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleNetworkChange = (network: string) => {
    if (selectedNetworks.includes(network)) {
      setSelectedNetworks((prev) => prev.filter((net) => net !== network));
    } else {
      setSelectedNetworks((prev) => [...prev, network]);
    }
  };

  const handleDeploy = () => {
    setIsModalOpen(true);
  };

  const isDeployDisabled = !bytecode;

  return (
    <div className="bg-deep-space text-lunar-white h-screen flex flex-col">
      {/* Adjusted header opacity to match the main container */}
      <header className="sticky top-0 z-10 p-4 bg-deep-space bg-opacity-60">
        <div className="float-right">
          <button className="bg-galactic-blue text-lunar-white px-4 py-2 rounded hover:bg-stellar-gold">
            Connect Wallet
          </button>
        </div>
      </header>

      <main
        className="flex-1 flex justify-center items-center bg-center bg-cover"
        style={{ backgroundImage: 'url("background.jpg")' }}
      >
        <div className="p-8 bg-opacity-60 bg-deep-space rounded-lg space-y-4 max-w-2xl w-full">
          {/* Hero Section */}
          <div className="text-center mb-4">
            <h1 className="text-4xl font-bold">OmniDeployer</h1>
          </div>

          <div className="mb-4">
            <label>
              Bytecode:
              <textarea
                value={bytecode}
                onChange={(e) => setBytecode(e.target.value)}
                className="w-full p-2 mt-2 rounded bg-lunar-white text-deep-space"
                rows={8}
              />
            </label>
          </div>

          <div className="mb-4 text-stellar-gold">
            Expected deployed contract address: [Address Here]
          </div>

          <div className="mb-4">
            <label>
              Target Network:
              <div className="flex justify-between mt-2 items-center">
                <span>Network 1</span>
                <input
                  type="checkbox"
                  value="network1"
                  checked={selectedNetworks.includes("network1")}
                  onChange={() => handleNetworkChange("network1")}
                />
              </div>
              <div className="flex justify-between mt-2 items-center">
                <span>Network 2</span>
                <input
                  type="checkbox"
                  value="network2"
                  checked={selectedNetworks.includes("network2")}
                  onChange={() => handleNetworkChange("network2")}
                />
              </div>
            </label>
          </div>
          {/* Adjusted the button to take up the full width */}
          <button
            className={`w-full bg-galactic-blue text-lunar-white py-2 rounded ${
              isDeployDisabled
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-stellar-gold"
            }`}
            onClick={handleDeploy}
            disabled={isDeployDisabled}
          >
            Deploy
          </button>
        </div>
      </main>
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-20">
          {/* Modal Overlay */}
          <div className="absolute inset-0 bg-black opacity-75 z-10"></div>

          {/* Modal Content */}
          <div className="bg-deep-space p-8 rounded-lg space-y-4 max-w-md w-full z-30">
            {" "}
            {/* Note the z-30 here */}
            <h2 className="text-2xl font-bold text-center">Modal Title</h2>
            <p>Your modal content here...</p>
            <button
              className="w-full bg-galactic-blue text-lunar-white py-2 rounded hover:bg-stellar-gold"
              onClick={() => setIsModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
