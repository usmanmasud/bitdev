import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Result from "./pages/Result";
import Docs from "./pages/Docs";
import "./index.css";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/result/:address" element={<Result />} />
        <Route path="/docs" element={<Docs />} />
      </Routes>
    </BrowserRouter>
  );
}
