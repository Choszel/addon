import { Card, CardBody, HStack } from "@chakra-ui/react";
import { Quiz } from "../../hooks/useQuizzes";
import { QuizQuestion } from "../../hooks/useQuizzesQuestions";
import { Link } from "react-router-dom";

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

      <h1 style={{ textDecoration: "underline", marginTop: "4%" }}>Zagraj</h1>
      <HStack>
        <Link to={"/quiz/fishCardGame/" + quiz.id} className="game_type">
          <p>Fiszki</p>
        </Link>
        <Link to={"/quiz/matchGame/" + quiz.id} className="game_type">
          {" "}
          <p>Dopasowanie</p>
        </Link>
        <div className="game_type">
          <p>Test</p>
        </div>
      </HStack>
      <h1 style={{ marginTop: "4%" }}>Lista zwrotów</h1>
      {questions.map((question) => (
        <HStack margin="3% 3%">
          <Card
            bg={userId ? (question.done ? "var(--nyanza)" : "red") : ""}
            w="100%"
            height="150px"
          >
            <CardBody
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <p>{question.word_polish}</p>
            </CardBody>
          </Card>
          <Card
            bg={userId ? (question.done ? "var(--nyanza)" : "red") : ""}
            w="100%"
            height="150px"
          >
            <CardBody
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <p>{question.word_second}</p>
            </CardBody>
          </Card>
        </HStack>
      ))}
    </>
  );
};

export default QuizDetails;
