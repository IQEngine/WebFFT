import { ReactElement, lazy, Suspense, useState } from "react";
import SiteHeader from "./SiteHeader";
import components from "./MarkdownComponents";
import { useRoutes, Link } from "react-router-dom";

const GettingStarted = lazy(() => import("../docs/GettingStarted.mdx"));
const ListofLibs = lazy(() => import("../docs/ListofLibs.mdx"));

function Docs(): ReactElement {
  let routes = useRoutes([
    {
      path: "/",
      element: <GettingStarted components={components} />,
    },
    {
      path: "/listoflibs",
      element: <ListofLibs components={components} />,
    },
    // add more routes here
  ]);

  const [isNavVisible, setNavVisible] = useState(false);

  return (
    <div className="App flex flex-col items-center text-cyber-text min-h-screen min-w-screen">
      <SiteHeader />
      <button
        className="lg:hidden bg-cyber-background1 border border-cyber-primary text-cyber-text px-4 py-2 rounded-md"
        onClick={() => setNavVisible(!isNavVisible)}
        aria-label="Toggle navigation"
        role="navigation"
      >
        ☰ Navigation
      </button>
      <main className="container mx-auto grid grid-cols-1 lg:grid-cols-4">
        <nav
          className={`col-span-1 p-4 rounded-lg mx-auto block lg:hidden ${
            isNavVisible ? "block" : "hidden"
          }`}
        >
          <ul className="list-none pl-0">
            <li>
              <Link
                to="/docs"
                className="block py-2"
                aria-label="Link to Usage Documentation"
              >
                Usage
              </Link>
            </li>
            <li>
              <Link
                to="/docs/listoflibs"
                className="block py-2"
                aria-label="Link to List of Libaries used by WebFFT"
              >
                List of Libraries
              </Link>
            </li>
            {/* add more links here */}
          </ul>
        </nav>
        <nav className="col-span-1 p-4 rounded-lg mx-auto hidden lg:block">
          <ul className="list-none pl-0">
            <li>
              <Link
                to="/docs"
                className="block py-2"
                aria-label="Link to Usage Documentation"
              >
                Usage
              </Link>
            </li>
            <li>
              <Link
                to="/docs/listoflibs"
                className="block py-2"
                aria-label="Link to List of Libaries used by WebFFT"
              >
                List of Libraries
              </Link>
            </li>
            {/* add more links here */}
          </ul>
        </nav>
        <div className="col-span-3 md:col-span-2 p-0 prose lg:col-start-2">
          <Suspense fallback={<div>Loading...</div>}>{routes}</Suspense>
        </div>
      </main>
    </div>
  );
}

export default Docs;
