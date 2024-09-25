import { Card, CardBody, HStack } from "@chakra-ui/react";
import { Quiz } from "../../hooks/useQuizzes";
import { QuizQuestion } from "../../hooks/useQuizzesQuestions";

interface Props {
  quiz: Quiz;
  userId?: number;
  questions: QuizQuestion[];
}

const QuizDetails = ({ quiz, userId, questions }: Props) => {
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
        <button className="gradient_button">
          {quiz.category ?? "No category"}
        </button>
      </HStack>
      <HStack>
        <p>Poziom: </p>
        <button className="gradient_button">{quiz.level ?? "No level"}</button>
      </HStack>
      <p>Data wykonania {quiz.execution_date?.toString().substring(0, 10)}</p>
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
