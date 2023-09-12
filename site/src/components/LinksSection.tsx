import React from "react";
import GitHubMark from "../assets/github-mark/github-mark-white.svg";
import NpmLogo from "../assets/npm-logo-red.svg";

function LinksSection() {
  return (
    <section className="mb-6 text-center">
      <div className="flex flex-col md:flex-row md:justify-center gap-4 rounded-2xl p-4 w-full max-w-lg mx-auto">
        <a
          href="https://npmjs.com/your-package"
          target="_blank"
          className="rounded-lg font-bold text-center py-4 px-6 border border-cyber-primary bg-cyber-background1 text-cyber-text shadow-button flex items-center justify-center min-w-[200px] min-h-[50px]"
        >
          <img src={NpmLogo} alt="Npm Logo Red" className="w-6 h-6 inline-block mr-2" />
          NPM
        </a>
        <a
          href="https://github.com/IQEngine/WebFFT/"
          target="_blank"
          className="rounded-lg font-bold text-center py-4 px-6 border border-cyber-primary bg-cyber-background1 text-cyber-text shadow-button flex items-center justify-center min-w-[200px] min-h-[50px]"
        >
          <img src={GitHubMark} alt="GitHub Mark" className="w-6 h-6 inline-block mr-2" />
          GitHub
        </a>
      </div>
    </section>
  );
}

export default LinksSection;
