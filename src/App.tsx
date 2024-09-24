import "./App.css";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import DictionaryHome from "./pages/DictionaryHome";
import FishCardsHome from "./pages/FishCardsHome";
import Layout from "./Layout";
import NoTranslation from "./pages/missing_phrases/NoTranslation";
import DictionarySearchResult from "./pages/DictionarySearchResult";
import Login from "./pages/user/Login";
import Register from "./pages/user/Register";
import RCategory from "./pages/category/RCategory";
import CCategory from "./pages/category/CCategory";
import ECategory from "./pages/category/ECategory";
import RDifficultyLevel from "./pages/difficulty_level/RDifficultyLevel";
import RLanguage from "./pages/languages/RLanguage";
import CLanguage from "./pages/languages/CLanguage";
import Elanguage from "./pages/languages/Elanguage";
import RUser from "./pages/user/RUser";
import RMissingPhrases from "./pages/missing_phrases/RMissingPhrases";
import DetailsMissingPhrases from "./pages/missing_phrases/DetailsMissingPhrases";
import RWordsPolish from "./pages/words_polish/RWordsPolish";
import RWordsEnglish from "./pages/words_english/RWordsEnglish";
import DetailsWordsPolish from "./pages/words_polish/DetailsWordsPolish";
import DetailsWordsEnglish from "./pages/words_english/DetailsWordsEnglish";
import EWordsPolish from "./pages/words_polish/EWordsPolish";
import EWordsEnglish from "./pages/words_english/EWordsEnglish";
import CWordsPolish from "./pages/words_polish/CWordsPolish";
import CWordsEnglish from "./pages/words_english/CWordsEnglish";
import UserProfile from "./pages/user/UserProfile";
import AlphabeticalSearch from "./pages/AlphabeticalSearch";

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/dictionary" element={<DictionaryHome />} />
          <Route
            path="/dictionary/alphabeticalSearch/:language/:letter"
            element={<AlphabeticalSearch />}
          />
          <Route path="/fishCards" element={<FishCardsHome />} />
          <Route path="/noTranslation" element={<NoTranslation />} />
          <Route
            path="dictionary/searchResult/:id/:word/:code"
            element={<DictionarySearchResult />}
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/category" element={<RCategory />} />
          <Route path="/category/create" element={<CCategory />} />
          <Route path="/category/edit/:id" element={<ECategory />} />
          <Route path="/difficultyLevel" element={<RDifficultyLevel />} />
          <Route path="/language" element={<RLanguage />} />
          <Route path="/language/create" element={<CLanguage />} />
          <Route path="/language/edit/:id" element={<Elanguage />} />
          <Route path="/missingPhrases" element={<RMissingPhrases />} />
          <Route
            path="/missingPhrases/details/:id"
            element={<DetailsMissingPhrases />}
          />
          <Route path="/wordsPolish" element={<RWordsPolish />} />
          <Route path="/wordsPolish/create" element={<CWordsPolish />} />
          <Route path="/wordsPolish/edit/:id" element={<EWordsPolish />} />
          <Route
            path="/wordsPolish/details/:id"
            element={<DetailsWordsPolish />}
          />
          <Route path="/wordsEnglish" element={<RWordsEnglish />} />
          <Route path="/wordsEnglish/create" element={<CWordsEnglish />} />
          <Route path="/wordsEnglish/edit/:id" element={<EWordsEnglish />} />

          <Route
            path="/wordsEnglish/details/:id"
            element={<DetailsWordsEnglish />}
          />
          <Route path="/user" element={<RUser />} />
          <Route path="/user/details/:login" element={<UserProfile />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
