import { useState } from "react";
import SiteHeader from "./SiteHeader";
import LinksSection from "./LinksSection";
import BenchmarkSection from "./BenchmarkSection";

function Home() {
  const [fftSize, setFftSize] = useState(1024);
  const [duration, setDuration] = useState(1);

  const handleClearState = (_: any) => {
    setFftSize(1024);
    setDuration(1);
  };

  return (
    <div className="App flex flex-col items-center text-cyber-text bg-cyber-gradient min-h-screen min-w-screen">
      <SiteHeader />
      <main className="container mx-auto text-center">
        <LinksSection />
        <BenchmarkSection
          fftSize={fftSize}
          setFftSize={setFftSize}
          duration={duration}
          setDuration={setDuration}
          handleClearAppState={handleClearState}
        />
      </main>
    </div>
  );
}

export default Home;
