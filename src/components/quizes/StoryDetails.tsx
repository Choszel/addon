import { Card, CardBody } from "@chakra-ui/react";
import { Quiz } from "../../hooks/useQuizzes";
import { StoryQuestion } from "../../hooks/useStories";
import ItemDetails from "./ItemDetails";

interface Props {
  quiz: Quiz;
  userId?: number;
  questions: StoryQuestion[];
  isLoading: boolean;
  error: string;
}

const StoryDetails = ({ quiz, userId, questions, isLoading, error }: Props) => {
  const games = [{ path: "/quiz/story/", title: "Tekst oraz quiz" }];

  return (
    <ItemDetails
      quiz={quiz}
      userId={userId}
      isLoading={isLoading}
      error={error}
      games={games}
      questionsNode={questions.map((question) => (
        <Card
          bg={userId ? (question.done ? "var(--success)" : "var(--error)") : ""}
          color={
            userId
              ? question.done
                ? "var(--success-content)"
                : "var(--error-content)"
              : ""
          }
          w="100%"
          height="auto"
          marginY={{ base: "5%", md: "2%" }}
          key={question.id}
        >
          <CardBody display="flex" justifyContent="center" alignItems="center">
            <p>{question?.question}</p>
          </CardBody>
        </Card>
      ))}
    />
  );
};
export default StoryDetails;
