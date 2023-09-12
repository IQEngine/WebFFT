import React from "react";

function LinksSection() {
  return (
    <section className="mb-6 text-center">
      <h2 className="text-xl">Links</h2>
      <a href="https://npmjs.com/your-package" className="text-blue-500 hover:underline">
        NPM
      </a>
      <br />
      <a href="https://github.com/IQEngine/WebFFT/" className="text-blue-500 hover:underline">
        GitHub
      </a>
    </section>
  );
}

export default LinksSection;
