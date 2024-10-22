import { useState } from "react";
import QuizGrid, { QuizQuery } from "../components/quizes/QuizGrid";
import SearchInput from "../components/quizes/SearchInput";
import Flame from "../assets/Fire-Blaze-PNG-Image-Background.png";
import { HStack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const FlashcardsHome = () => {
  const [quizQuery, setQuizQuery] = useState<QuizQuery>({} as QuizQuery);
  const navigate = useNavigate();
  return (
    <>
      <HStack display="flex" justifyContent="center" alignContent="center">
        <SearchInput
          onSearch={function (id: number, searchText: string): void {
            throw new Error("Function not implemented.");
          }}
          language={""}
        ></SearchInput>
        <button
          className="add_to_quiz_button"
          onClick={() => navigate("/quiz/create")}
        >
          Stwórz własny quiz
        </button>
      </HStack>
      <HStack>
        <h1>Lista zestawów do nauki na Topie</h1>
        <img src={Flame} width="4%"></img>
      </HStack>
      <QuizGrid quizQuery={quizQuery}></QuizGrid>
    </>
  );
};

export default FlashcardsHome;
