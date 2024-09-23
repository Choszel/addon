import { useState } from "react";
import QuizGrid, { QuizQuery } from "../components/quizes/QuizGrid";
import SearchInput from "../components/quizes/SearchInput";

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
      <QuizGrid quizQuery={quizQuery}></QuizGrid>
    </>
  );
};

export default FishCardsHome;
