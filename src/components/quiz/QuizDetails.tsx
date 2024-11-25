import { Card, CardBody, HStack } from "@chakra-ui/react";
import { Quiz } from "../../hooks/useQuizzes";
import { QuizQuestion } from "../../hooks/useQuizzes";
import ItemDetails from "./ItemDetails";
import { VscError } from "react-icons/vsc";

interface Props {
  quiz: Quiz;
  userId?: number;
  questions: QuizQuestion[];
  isLoading: boolean;
  error: string;
  categories: string[];
  difficultyLevels: string[];
}

const QuizDetails = ({
  quiz,
  userId,
  questions,
  isLoading,
  error,
  categories,
  difficultyLevels,
}: Props) => {
  const games = [
    { path: "/quiz/flashcardGame/", title: "Fiszki" },
    { path: "/quiz/matchGame/", title: "Dopasowanie" },
    { path: "/quiz/testGame/", title: "Test" },
  ];

  return (
    <ItemDetails
      quiz={quiz}
      userId={userId}
      isLoading={isLoading}
      error={error}
      moreDetails={
        <>
          <HStack marginY="2%" flexWrap="wrap" gap="10px">
            <p>Kategria: </p>
            {categories.length == 0 ? (
              <VscError color="var(--error)" />
            ) : (
              categories.map((cat) => (
                <button className="tag_category" disabled key={cat}>
                  {cat ?? "No category"}
                </button>
              ))
            )}
          </HStack>
          <HStack marginBottom="2%" flexWrap="wrap" gap="10px">
            <p>Poziom: </p>
            {difficultyLevels.length == 0 ? (
              <VscError color="var(--error)" />
            ) : (
              difficultyLevels.map((dl) => (
                <button className="tag_category" disabled key={dl}>
                  {dl ?? "No level"}
                </button>
              ))
            )}
          </HStack>
        </>
      }
      games={games}
      questionsNode={questions?.map((question) => (
        <HStack margin={{ base: "6% 3%", md: "3% 3%" }} key={question.id}>
          <Card
            bg={
              userId ? (question.done ? "var(--success)" : "var(--error)") : ""
            }
            color={
              userId
                ? question.done
                  ? "var(--success-content)"
                  : "var(--error-content)"
                : ""
            }
            w="100%"
            height={{ base: "110px", md: "150px" }}
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
            bg={
              userId ? (question.done ? "var(--success)" : "var(--error)") : ""
            }
            color={
              userId
                ? question.done
                  ? "var(--success-content)"
                  : "var(--error-content)"
                : ""
            }
            w="100%"
            height={{ base: "110px", md: "150px" }}
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
    />
  );
};

export default QuizDetails;
