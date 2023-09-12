import React from "react";

function LinksSection() {
  return (
    <section className="mb-6 text-center">
      <div className="grid md:grid-cols-2 gap-4 rounded-2xl p-4 w-full max-w-lg">
        <a
          href="https://npmjs.com/your-package"
          className="rounded-lg font-bold gap-4 shadow-button text-center py-4 px-6"
        >
          NPM
        </a>
        <br />
        <a href="https://github.com/IQEngine/WebFFT/" className="text-blue-500 hover:underline">
          GitHub
        </a>
      </div>
    </section>
  );
}

export default LinksSection;
