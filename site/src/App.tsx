import React, { useState } from "react";
import SiteHeader from "./components/SiteHeader";
import LinksSection from "./components/LinksSection";
import BenchmarkSection from "./components/BenchmarkSection";
import ResultsSection from "./components/ResultsSection";

function App() {
  const [fftSize, setFftSize] = useState(128);
  const [numIterations, setNumIterations] = useState(10);

  return (
    <div className="App container flex flex-col items-center relative text-cyber-text bg-cyber-gradient min-h-screen">
      <SiteHeader />
      <main className="mx-auto p-6">
        <LinksSection />
        <BenchmarkSection
          fftSize={fftSize}
          setFftSize={setFftSize}
          numIterations={numIterations}
          setNumIterations={setNumIterations}
        />
        <ResultsSection />
      </main>
    </div>
  );
}

export default App;
