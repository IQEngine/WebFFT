import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import About from "./components/About";
import Docs from "./components/Docs";
import Breadcrumbs from "./components/Breadcrumbs";
import NotFound from "./components/NotFound";

function App() {
  return (
    <BrowserRouter>
      <Breadcrumbs />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/docs/*" element={<Docs />} />
        <Route path="*" element={<NotFound />} /> // TODO: Make a 404 page
      </Routes>
    </BrowserRouter>
  );
}

export default App;
