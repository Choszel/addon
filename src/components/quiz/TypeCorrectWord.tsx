import { Box, Card, CardBody, Input, Stack, Text } from "@chakra-ui/react";
import { QuizQuestion } from "../../hooks/useQuizzes";
import { HiSpeakerWave } from "react-icons/hi2";
import { useRef, useState } from "react";
import useSpeechSynthesis from "../../hooks/useSpeechSynthesis";

interface Props {
  question: QuizQuestion;
  type: string;
  checkIfCorrect: (word: string) => boolean;
  language: string;
}

const TypeCorrectWord = ({
  question,
  type,
  checkIfCorrect,
  language,
}: Props) => {
  const refInput = useRef<HTMLInputElement>(null);
  const [verified, setVerified] = useState<boolean>(false);

  const checkCorectness = (word: string) => {
    const result = checkIfCorrect(word);
    setVerified(true);
    if (result) {
      if (refInput.current) {
        refInput.current.style.backgroundColor = "var(--success)";
        refInput.current.style.color = "var(--success-content)";
      }
    } else {
      if (refInput.current) {
        refInput.current.style.backgroundColor = "var(--error)";
        refInput.current.style.color = "var(--error-content)";
      }
    }
    setTimeout(() => {
      if (refInput.current) {
        refInput.current.style.backgroundColor = "var(--foreground)";
        refInput.current.style.color = "var(--copy)";
        refInput.current.value = "";
      }
      setVerified(false);
    }, 2000);
  };

  const handleKeyPress = (event: { key: string }) => {
    if (event.key === "Enter") {
      if (refInput.current) checkCorectness(refInput.current.value);
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <Card
        height={{ base: "200px", md: "250px" }}
        width={{ base: "90%", md: "40%" }}
      >
        <CardBody className="custom_card">
          {type === "speaker" ? (
            <HiSpeakerWave
              size={60}
              onClick={() => {
                useSpeechSynthesis(language, question?.word_second ?? "");
              }}
              cursor={"pointer"}
            />
          ) : (
            <p>{question?.word_polish}</p>
          )}
        </CardBody>
      </Card>
      <Stack
        width={{ base: "100%", md: "50%" }}
        align="center"
        justify="center"
        direction={{ base: "column", md: "row" }}
        marginTop={{ base: "5%", md: "2%" }}
      >
        <p>Przetłumacz:</p>
        <Input
          ref={refInput}
          marginX="2%"
          readOnly={verified}
          onKeyUp={handleKeyPress}
        ></Input>
        <button
          onClick={() => checkCorectness(refInput.current?.value ?? "")}
          id={"answear"}
        >
          Zatwierdź
        </button>
      </Stack>
      <Box
        marginTop="1%"
        className="question"
        visibility={
          refInput.current
            ? refInput.current.style.backgroundColor == "var(--error)"
              ? "visible"
              : "hidden"
            : "hidden"
        }
        color="var(--success)"
      >
        <Text>{question?.word_second}</Text>
      </Box>
    </Box>
  );
};

export default TypeCorrectWord;
