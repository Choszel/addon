import { Card, CardBody, HStack } from "@chakra-ui/react";
import { Quiz } from "../../hooks/useQuizzes";
import { QuizQuestion } from "../../hooks/useQuizzesQuestions";

interface Props {
  quiz: Quiz;
  userId?: number;
  questions: QuizQuestion[];
  categories: string[];
  difficultyLevels: string[];
}

const QuizDetails = ({
  quiz,
  userId,
  questions,
  categories,
  difficultyLevels,
}: Props) => {
  console.log(quiz);
  console.log(questions);

  return (
    <>
      <h1>Szczegóły</h1>
      <p>{quiz?.title}</p>
      <p>Twórca: {quiz.user ?? "No user"}</p>
      <p>Język: {quiz.language ?? "No language"}</p>
      <HStack>
        {" "}
        <p>Kategria: </p>
        {categories.length > 3 ? (
          <HStack>
            <button className="tag_category">
              {categories[0] ?? "No category"}
            </button>
            <button className="tag_category">
              {categories[1] ?? "No category"}
            </button>
            <button className="tag_category">others</button>
          </HStack>
        ) : categories.length == 0 ? (
          <button className="tag_error">X</button>
        ) : (
          categories.map((cat) => (
            <button className="tag_category">{cat ?? "No category"}</button>
          ))
        )}
      </HStack>
      <HStack>
        <p>Poziom: </p>
        {difficultyLevels.length > 4 ? (
          <button className="tag_infinity">∞</button>
        ) : difficultyLevels.length == 0 ? (
          <button className="tag_error">X</button>
        ) : (
          difficultyLevels.map((dl) => (
            <button className="tag_category">{dl ?? "No level"}</button>
          ))
        )}
      </HStack>
      <p>Data wykonania {quiz.execution_date?.toString().substring(0, 10)}</p>
      <button className="gradient_button">Zagraj</button>
      <h1>Lista zwrotów</h1>
      {questions.map((question) => (
        <HStack marginY="3%">
          <Card bg={userId ? (question.done ? "var(--nyanza)" : "red") : ""}>
            <CardBody>
              <p>{question.word_polish}</p>
            </CardBody>
          </Card>
          <Card bg={userId ? (question.done ? "var(--nyanza)" : "red") : ""}>
            <CardBody>
              <p>{question.word_second}</p>
            </CardBody>
          </Card>
        </HStack>
      ))}
    </>
  );
};

export default QuizDetails;
