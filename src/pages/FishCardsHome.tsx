import { useState } from "react";
import QuizGrid, { QuizQuery } from "../components/quizes/QuizGrid";
import SearchInput from "../components/quizes/SearchInput";
import Flame from "../assets/Fire-Blaze-PNG-Image-Background.png";
import { HStack } from "@chakra-ui/react";

const FishCardsHome = () => {
  const [quizQuery, setQuizQuery] = useState<QuizQuery>({} as QuizQuery);
  return (
    <>
      <SearchInput
        onSearch={function (id: number, searchText: string): void {
          throw new Error("Function not implemented.");
        }}
        language={""}
      ></SearchInput>
      <HStack>
        <h1>Lista zestawów do nauki na Topie</h1>
        <img src={Flame} width="4%"></img>
      </HStack>
      <QuizGrid quizQuery={quizQuery}></QuizGrid>
    </>
  );
};

export default FishCardsHome;
