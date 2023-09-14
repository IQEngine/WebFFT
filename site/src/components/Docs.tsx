import { ReactElement, lazy, Suspense } from "react";
import SiteHeader from "./SiteHeader";
import components from "./MarkdownComponents";
import { useRoutes, Link } from "react-router-dom";

const GettingStarted = lazy(() => import("../docs/GettingStarted.mdx"));
const ListofLibs = lazy(() => import("../docs/ListofLibs.mdx"));

function Docs(): ReactElement {
  let routes = useRoutes([
    {
      path: "/",
      element: <GettingStarted components={components} />
    },
    {
      path: "/listoflibs",
      element: <ListofLibs components={components} />
    }
    // add more routes here
  ]);

  return (
    <div className="App flex flex-col items-center text-cyber-text bg-cyber-gradient min-h-screen min-w-screen">
      <SiteHeader />
      <main className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <nav className="col-span-1 p-4 rounded-lg mx-auto lg:block hidden">
          <ul className="list-none pl-0">
            <li>
              <Link to="/docs" className="block py-2">
                Usage
              </Link>
            </li>
            <li>
              <Link to="/docs/listoflibs" className="block py-2">
                List of Libraries
              </Link>
            </li>
            {/* add more links here */}
          </ul>
        </nav>
        <div className="col-span-3 md:col-span-2 p-0 prose">
          <Suspense fallback={<div>Loading...</div>}>{routes}</Suspense>
        </div>
      </main>
    </div>
  );
}

export default Docs;
