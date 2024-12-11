import { Box, Button, HStack, Input, Text } from "@chakra-ui/react";
import { CStoryQuestion } from "../../pages/stories/CStories";

interface Props {
  questions: CStoryQuestion[];
  setQuestions: (Phrases: CStoryQuestion[]) => void;
}

const AddStoryQuestionButton = ({ questions, setQuestions }: Props) => {
  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      { id: Date.now(), question: "Treść pytania...", answers: [] },
    ]);
  };

  const handleDeleteQuestion = (id: number) => {
    setQuestions(questions.filter((row) => row.id !== id));
  };

  const questionChanged = (questionId: number, question: string) => {
    setQuestions(
      questions.map((row) =>
        row.id == questionId ? { ...row, question: question } : row
      )
    );
  };

  const handleAddAnswear = (questionId: number) => {
    setQuestions(
      questions.map((row) =>
        row.id === questionId
          ? {
              ...row,
              answers: [
                ...(row.answers || []),
                { id: Date.now(), answear: "", correct: false },
              ],
            }
          : row
      )
    );
  };

  const handleDeleteAnswear = (questionId: number, answearId: number) => {
    setQuestions(
      questions.map((row) =>
        row.id === questionId
          ? {
              ...row,
              answers: row.answers?.filter((ans) => ans.id !== answearId),
            }
          : row
      )
    );
  };

  const answearChanged = (
    questionId: number,
    answearId: number,
    newValue: string
  ) => {
    setQuestions(
      questions.map((row) =>
        row.id === questionId
          ? {
              ...row,
              answers: row.answers?.map((ans) =>
                ans.id === answearId ? { ...ans, answear: newValue } : ans
              ),
            }
          : row
      )
    );
  };

  const answearCorrectnessChanged = (
    questionId: number,
    answearId: number,
    newValue: string
  ) => {
    setQuestions(
      questions.map((row) =>
        row.id === questionId
          ? {
              ...row,
              answers: row.answers?.map((ans) =>
                ans.id === answearId
                  ? { ...ans, correct: newValue == "true" ? true : false }
                  : ans
              ),
            }
          : row
      )
    );
  };

  return (
    <>
      <HStack marginY="2%">
        <p className="p2">Pytania</p>
        <button
          onClick={handleAddQuestion}
          disabled={questions.length > 25}
          className="button_secondary"
        >
          Dodaj
        </button>
      </HStack>
      {questions.map((row, index) => (
        <Box marginY={{ base: "5%", md: "2%" }}>
          <HStack>
            <Text whiteSpace="nowrap">Pytanie {index + 1}.</Text>
            <Input
              style={{ fontWeight: "600" }}
              onChange={(e) => questionChanged(row.id, e.target.value)}
              value={row.question}
            ></Input>
            <Button onClick={() => handleAddAnswear(row.id)} colorScheme="blue">
              Dodaj Odpowiedź
            </Button>
            <Button
              onClick={() => handleDeleteQuestion(row.id)}
              colorScheme="red"
            >
              Usuń
            </Button>
          </HStack>
          {row.answers?.map((answear, aIndex) => (
            <HStack marginY={{ base: "5%", md: "2%" }}>
              <Text whiteSpace="nowrap">Odpowiedź {aIndex + 1}.</Text>
              <Input
                style={{ fontWeight: "600" }}
                onChange={(e) =>
                  answearChanged(row.id, answear.id, e.target.value)
                }
                value={answear.answear}
              ></Input>
              <select
                className="select-primary"
                onChange={(e) =>
                  answearCorrectnessChanged(row.id, answear.id, e.target.value)
                }
              >
                <option value={"false"}>Błędna</option>
                <option value={"true"}>Poprawna</option>
              </select>
              <Button
                onClick={() => handleDeleteAnswear(row.id, answear.id)}
                colorScheme="red"
              >
                Usuń
              </Button>
            </HStack>
          ))}
        </Box>
      ))}
    </>
  );
};

export default AddStoryQuestionButton;
