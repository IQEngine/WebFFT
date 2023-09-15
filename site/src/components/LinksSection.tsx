import GitHubMark from "../assets/github-mark/github-mark-white.svg";
import NpmLogo from "../assets/npm-logo-red.svg";
import { Link } from "react-router-dom";

function LinksSection() {
  return (
    <section className="mb-6 text-center">
      <div className="flex flex-col md:flex-row md:justify-center gap-4 rounded-2xl p-4 w-full max-w-lg mx-auto">
        <a
          href="https://npmjs.com/webfft"
          target="_blank"
          className="rounded-lg font-bold text-center py-4 px-6 border border-cyber-primary bg-cyber-background1 text-cyber-text shadow-button flex items-center justify-center min-w-[200px] min-h-[50px]"
        >
          <img
            src={NpmLogo}
            alt="Npm Logo Red"
            className="w-6 h-6 inline-block mr-2"
          />
          NPM
        </a>
        <a
          href="https://github.com/IQEngine/WebFFT/"
          target="_blank"
          className="rounded-lg font-bold text-center py-4 px-6 border border-cyber-primary bg-cyber-background1 text-cyber-text shadow-button flex items-center justify-center min-w-[200px] min-h-[50px]"
        >
          <img
            src={GitHubMark}
            alt="GitHub Mark"
            className="w-6 h-6 inline-block mr-2"
          />
          GitHub
        </a>
      </div>
      <div className="flex flex-col md:justify-center w-full max-w-lg mx-auto gap-3">
        <Link
          to="/docs"
          className="text-xl items-center justify-center min-w-[220px] min-h-[20px] inline-block text-cyber-secondary"
          aria-label="Link to Documentation"
          role="link"
        >
          Documentation
        </Link>
        <Link
          to="/about"
          className="text-xl items-center justify-center min-w-[200px] min-h-[20px] pr-4 inline-block text-cyber-secondary"
          aria-label="Link to About Page"
          role="link"
        >
          About
        </Link>
      </div>
      <div className="flex justify-center mt-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center">
            <span className="text-cyber-text-secondary text-2xl">⚡</span>
            <span className="ml-2">Auto-optimized FFT algorithms</span>
          </div>
          <div className="flex items-center">
            <span className="text-cyber-text-secondary text-2xl">⚡</span>
            <span className="ml-2">Browser-specific optimizations</span>
          </div>
          <div className="flex items-center">
            <span className="text-cyber-text-secondary text-2xl">⚡</span>
            <span className="ml-2">SIMD WASM support</span>
          </div>
          <div className="flex items-center">
            <span className="text-cyber-text-secondary text-2xl">⚡</span>
            <span className="ml-2">Peak performance assurance</span>
          </div>
          <div className="flex items-center">
            <span className="text-cyber-text-secondary text-2xl">⚡</span>
            <span className="ml-2">Easy npm integration</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default LinksSection;
