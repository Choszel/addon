import { HStack, Show } from "@chakra-ui/react";
import { Quiz } from "../../hooks/useQuizzes";
import QuizDetails from "./QuizDetails";
import { useEffect, useState } from "react";
import useQuizzesQuestions from "../../hooks/useQuizzes";
import { Category } from "../../hooks/useCategories";
import { DifficultyLevel } from "../../hooks/useDifficultyLevels";
import { FaCirclePlus } from "react-icons/fa6";
import ItemCard from "./ItemCard";

interface Props {
  quiz: Quiz;
  isScore?: boolean;
  userId?: number;
  open?: boolean;
  categories: Category[];
  difficultyLevels: DifficultyLevel[];
}

const QuizCard = ({
  quiz,
  isScore,
  userId,
  open,
  categories,
  difficultyLevels,
}: Props) => {
  const { fetchUserQuestionsDetailed, fetchAmountOfQuestions } =
    useQuizzesQuestions();
  const {
    data: questions,
    isLoading: quesIsLoading,
    error: quesError,
  } = fetchUserQuestionsDetailed(quiz.id ?? 0, userId);
  const { data: amountOfQuestions } = fetchAmountOfQuestions(quiz.id ?? 0);
  const [categoriesQuizzes, setCategoriesQuizzes] = useState<string[]>([""]);
  const [levelsQuizzes, setLevelsQuizzes] = useState<string[]>([""]);

  useEffect(() => {
    let questionsCategories = [
      ...new Set(
        questions.map(
          (q) => categories?.find((c) => c.id == q.ws_category_id)?.name ?? ""
        )
      ),
    ];
    let questionsLevels = [
      ...new Set(
        questions.map(
          (q) =>
            difficultyLevels?.find((df) => df.id == q.ws_level_id)?.level ?? ""
        )
      ),
    ];
    setCategoriesQuizzes(questionsCategories);
    setLevelsQuizzes(questionsLevels);
  }, [questions]);

  return (
    <ItemCard
      quiz={quiz}
      isScore={isScore}
      userId={userId}
      open={open}
      questions={questions}
      amountOfQuestions={amountOfQuestions}
      moreDetails={
        <>
          <HStack marginBottom="2%">
            <p>Kategorie: </p>
            <Show above="md">
              {categoriesQuizzes.length > 3 ? (
                <HStack>
                  <button className="tag_category">
                    {categoriesQuizzes[0] ?? "No category"}
                  </button>
                  <button className="tag_category">
                    {categoriesQuizzes[1] ?? "No category"}
                  </button>
                  <FaCirclePlus color="var(--primary)" size="40px" />
                </HStack>
              ) : categoriesQuizzes.length == 0 ? (
                <button className="tag_error">X</button>
              ) : (
                categoriesQuizzes.map((cq) => (
                  <button className="tag_category" key={cq}>
                    {cq ?? "No category"}
                  </button>
                ))
              )}
            </Show>
            <Show below="md">
              {categoriesQuizzes.length > 1 ? (
                <HStack>
                  <button className="tag_category">
                    {categoriesQuizzes[0] ?? "No category"}
                  </button>
                  <FaCirclePlus color="var(--primary)" size="35px" />
                </HStack>
              ) : categoriesQuizzes.length == 0 ? (
                <button className="tag_error">X</button>
              ) : (
                categoriesQuizzes.map((cq) => (
                  <button className="tag_category" key={cq}>
                    {cq ?? "No category"}
                  </button>
                ))
              )}
            </Show>
          </HStack>
          <HStack>
            <p>Poziom: </p>
            {levelsQuizzes.length > 4 ? (
              <FaCirclePlus color="var(--primary)" size="30px" />
            ) : levelsQuizzes.length == 0 ? (
              <button className="tag_error">X</button>
            ) : (
              levelsQuizzes.map((lq) => (
                <button className="tag_category" key={lq}>
                  {lq ?? "No level"}
                </button>
              ))
            )}
          </HStack>
        </>
      }
      modalDetails={
        <QuizDetails
          quiz={quiz}
          userId={userId}
          questions={questions}
          categories={categoriesQuizzes}
          difficultyLevels={levelsQuizzes}
          isLoading={quesIsLoading}
          error={quesError}
        />
      }
    />
  );
};

export default QuizCard;
