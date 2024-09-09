import "./App.css";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import DictionaryHome from "./pages/DictionaryHome";
import FishCardsHome from "./pages/FishCardsHome";
import Layout from "./Layout";
import NoTranslation from "./pages/NoTranslation";
import DictionarySearchResult from "./pages/DictionarySearchResult";
import Login from "./pages/account/Login";
import Register from "./pages/account/Register";
import RCategory from "./pages/category/RCategory";
import CCategory from "./pages/category/CCategory";
import ECategory from "./pages/category/ECategory";

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
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/category" element={<RCategory />} />
          <Route path="/category/create" element={<CCategory />} />
          <Route path="/category/edit/:id" element={<ECategory />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
