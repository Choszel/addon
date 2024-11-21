import "./App.css";
import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import Home from "./pages/Home";
import DictionaryHome from "./pages/dictionary/DictionaryHome";
import FlashcardsHome from "./pages/quiz/FlashcardsHome";
import Layout from "./Layout";
import NoTranslation from "./pages/missing_phrases/NoTranslation";
import DictionarySearchResult from "./pages/dictionary/DictionarySearchResult";
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
import AlphabeticalSearch from "./pages/dictionary/AlphabeticalSearch";
import CQuiz from "./pages/quiz/CQuiz";
import FlashcardGame from "./pages/quiz/FlashcardGame";
import MatchGame from "./pages/quiz/MatchGame";
import TestGame from "./pages/quiz/TestGame";
import StoryWithQuestions from "./pages/quiz/StoryWithQuestions";
import useTokenData from "./others/useTokenData";
import { useToast } from "@chakra-ui/react";
import { useEffect } from "react";
import TextDetector from "./pages/dictionary/TextDetector";

function App() {
  const { CheckUserType } = useTokenData();
  const toast = useToast();

  const HighestProtectedRoute = () => {
    const isAdmin = CheckUserType() === "admin";

    useEffect(() => {
      if (!isAdmin) {
        toast({
          title: "Treść tylko dla administratorów",
          status: "error",
          position: "bottom-right",
          duration: 5000,
          isClosable: true,
        });
      }
    }, [isAdmin, toast]);

    return isAdmin ? <Outlet /> : <Navigate to="/" replace />;
  };

  const ProtectedRoute = () => {
    const isAllowed = ["admin", "warden"].includes(CheckUserType());

    useEffect(() => {
      if (!isAllowed) {
        toast({
          title: "Treść tylko dla pracowników",
          status: "error",
          position: "bottom-right",
          duration: 5000,
          isClosable: true,
        });
      }
    }, [isAllowed, toast]);

    return isAllowed ? <Outlet /> : <Navigate to="/" replace />;
  };

  const LowestProtectedRoute = () => {
    const isLoggedIn = CheckUserType() !== "none";

    useEffect(() => {
      if (!isLoggedIn) {
        toast({
          title: "Treść tylko dla zalogowanych użytkowników",
          status: "error",
          position: "bottom-right",
          duration: 5000,
          isClosable: true,
        });
      }
    }, [isLoggedIn, toast]);

    return isLoggedIn ? <Outlet /> : <Navigate to="/" replace />;
  };

  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route index path="/" element={<Home />} />
          <Route path="*" element={<p>Not found: 404!</p>} />
          <Route path="/dictionary" element={<DictionaryHome />} />
          <Route path="/dictionary/textDetection" element={<TextDetector />} />
          <Route
            path="/dictionary/alphabeticalSearch/:language/:letter"
            element={<AlphabeticalSearch />}
          />
          <Route
            path="dictionary/searchResult/:id/:word/:code"
            element={<DictionarySearchResult />}
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/user/details/:login" element={<UserProfile />} />

          <Route element={<HighestProtectedRoute></HighestProtectedRoute>}>
            <Route path="/user" element={<RUser />} />
            <Route path="/language" element={<RLanguage />} />
            <Route path="/language/create" element={<CLanguage />} />
            <Route path="/language/edit/:id" element={<Elanguage />} />
          </Route>

          <Route element={<ProtectedRoute></ProtectedRoute>}>
            <Route path="/category" element={<RCategory />} />
            <Route path="/category/create" element={<CCategory />} />
            <Route path="/category/edit/:id" element={<ECategory />} />
            <Route path="/difficultyLevel" element={<RDifficultyLevel />} />
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
          </Route>

          <Route element={<LowestProtectedRoute></LowestProtectedRoute>}>
            <Route path="/noTranslation" element={<NoTranslation />} />
            <Route path="/quiz/create" element={<CQuiz />} />
            <Route path="/quiz/FlashcardGame/:id" element={<FlashcardGame />} />
            <Route path="/quiz/matchGame/:id" element={<MatchGame />} />
            <Route path="/quiz/testGame/:id" element={<TestGame />} />
            <Route path="/quiz/story/:id" element={<StoryWithQuestions />} />
            <Route path="/flashcards/:id?" element={<FlashcardsHome />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
