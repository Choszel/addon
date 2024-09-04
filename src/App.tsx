import "./App.css";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import DictionaryHome from "./pages/DictionaryHome";
import FishCardsHome from "./pages/FishCardsHome";
import Layout from "./Layout";
import NoTranslation from "./pages/NoTranslation";
import DictionarySearchResult from "./pages/DictionarySearchResult";

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/dictionary" element={<DictionaryHome />} />
          <Route path="/fishCards" element={<FishCardsHome />} />
          <Route path="/noTranslation" element={<NoTranslation />} />
          <Route path="/dSearchResult" element={<DictionarySearchResult />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
