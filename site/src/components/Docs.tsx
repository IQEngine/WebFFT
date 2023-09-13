import React, { ReactElement, lazy, Suspense } from "react";
import SiteHeader from "./SiteHeader";
import { MDXProvider } from "@mdx-js/react";
import components from "./MarkdownComponents";

const Introduction = lazy(() => import("../docs/Introduction.mdx"));

function Docs(): ReactElement {
  return (
    <div className="flex flex-col items-center text-cyber-text bg-cyber-gradient min-h-screen min-w-screen">
      <SiteHeader />
      <main className="container mx-auto">
        <Suspense fallback={<div>Loading...</div>}>
          <MDXProvider components={components}>
            <Introduction />
          </MDXProvider>
        </Suspense>
      </main>
    </div>
  );
}

export default Docs;
