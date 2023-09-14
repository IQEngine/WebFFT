import { useState } from "react";
import SiteHeader from "./SiteHeader";
import LinksSection from "./LinksSection";
import BenchmarkSection from "./BenchmarkSection";

function Home() {
  const [fftSize, setFftSize] = useState(1024);
  const [numIterations, setNumIterations] = useState(10);

  const handleClearState = (_: any) => {
    setFftSize(1024);
    setNumIterations(10);
  };

  return (
    <div className="App flex flex-col items-center text-cyber-text bg-cyber-gradient min-h-screen min-w-screen">
      <SiteHeader />
      <main className="container mx-auto text-center">
        <LinksSection />
        <BenchmarkSection
          fftSize={fftSize}
          setFftSize={setFftSize}
          numIterations={numIterations}
          setNumIterations={setNumIterations}
          handleClearAppState={handleClearState}
        />
      </main>
    </div>
  );
}

export default Home;
