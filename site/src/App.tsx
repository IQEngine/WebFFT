import { HashRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import About from "./components/About";
import Docs from "./components/Docs";
import Breadcrumbs from "./components/Breadcrumbs";
import NotFound from "./components/NotFound";

function App() {
  return (
    <HashRouter>
      <Breadcrumbs />
      <Routes>
        <Route index element={<Home />} errorElement={<NotFound />} />
        <Route path="about" element={<About />} errorElement={<NotFound />} />
        <Route path="docs/*" element={<Docs />} errorElement={<NotFound />} />
        <Route path="*" element={<NotFound />} /> // TODO: Make a 404 page
      </Routes>
    </HashRouter>
  );
}

export default App;
