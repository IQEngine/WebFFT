import { ReactElement, lazy, Suspense } from "react";
import SiteHeader from "./SiteHeader";
import components from "./MarkdownComponents";
import { useRoutes, Link } from "react-router-dom";

const GettingStarted = lazy(() => import("../docs/GettingStarted.mdx"));
// const OtherDoc = lazy(() => import("../docs/OtherDoc.mdx"));

function Docs(): ReactElement {
  let routes = useRoutes([
    {
      path: "/",
      element: <GettingStarted components={components} />,
    },
    // add more routes here
  ]);

  return (
    <div className="flex flex-col items-center text-cyber-text bg-cyber-gradient min-h-screen w-full">
      <SiteHeader />
      <div className="container grid grid-cols-4 h-full w-full max-w-7x2 p-4">
        <nav className="col-span-1 p-4 rounded-lg mx-auto">
          <ul className="list-none pl-0">
            <span className="font">Overview</span>
            <li>
              <Link to="/docs" className="block py-2">
                Get Started
              </Link>
            </li>
            {/* add more links here */}
          </ul>
        </nav>
        <div className="col-span-3 p-0 shadow prose flex-grow">
          <Suspense fallback={<div>Loading...</div>}>{routes}</Suspense>
        </div>
      </div>
    </div>
  );
}

export default Docs;
