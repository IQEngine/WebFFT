import React, { useState } from "react";
import SiteHeader from "./components/SiteHeader";
import LinksSection from "./components/LinksSection";
import BenchmarkSection from "./components/BenchmarkSection";
import ResultsSection from "./components/ResultsSection";

function App() {
  const [fftSize, setFftSize] = useState(128);
  const [numIterations, setNumIterations] = useState(10);

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-grow container mx-auto p-6 bg-gray-100 text-gray-800">
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
