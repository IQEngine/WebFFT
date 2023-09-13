import { Link } from "react-router-dom";

function SiteHeader() {
  return (
    <header className="p-6 text-center">
      <div className="mx-auto">
        <h1 className="text-6xl font-extrabold mb-4">
          <Link to="/" className="hover:text-cyber-text text-cyber-text-secondary">
            WebFFT
          </Link>
        </h1>
        <p className="text-cyber-text text-2xl">
          Optimized, Intelligent, and Ultra-Fast.
          <br /> That's WebFFT Meta-Library for You.
        </p>
      </div>
    </header>
  );
}

export default SiteHeader;
