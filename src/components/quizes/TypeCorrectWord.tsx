import { Box, Card, CardBody, HStack, Input, Text } from "@chakra-ui/react";
import { QuizQuestion } from "../../hooks/useQuizzesQuestions";
import { HiSpeakerWave } from "react-icons/hi2";
import { useRef, useState } from "react";

interface Props {
  question: QuizQuestion;
  type: string;
  checkIfCorrect: (word: string) => boolean;
}

const TypeCorrectWord = ({ question, type, checkIfCorrect }: Props) => {
  const refInput = useRef<HTMLInputElement>(null);
  const msg = new SpeechSynthesisUtterance();
  const [verified, setVerified] = useState<boolean>(false);

  const checkCorectness = (word: string) => {
    const result = checkIfCorrect(word);
    setVerified(true);
    if (result) {
      if (refInput.current)
        refInput.current.style.backgroundColor = "var(--nyanza)";
    } else {
      if (refInput.current)
        refInput.current.style.backgroundColor = "var(--error)";
    }
    setTimeout(() => {
      if (refInput.current) {
        refInput.current.style.backgroundColor = "white";
        refInput.current.value = "";
      }
      setVerified(false);
    }, 2000);
  };

  const handleSpeak = () => {
    msg.lang = "en-US";
    const voices = speechSynthesis
      .getVoices()
      .filter((voice) => voice.lang === "en-US");
    msg.voice = voices[0];

    msg.text = question?.word_second ?? "";
    window.speechSynthesis.speak(msg);
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
      <Card height="200px" width="40%">
        <CardBody display="flex" justifyContent="center" alignItems="center">
          {type === "speaker" ? (
            <HiSpeakerWave
              size={60}
              onClick={() => {
                handleSpeak();
              }}
              cursor={"pointer"}
            />
          ) : (
            <p>{question?.word_polish}</p>
          )}
        </CardBody>
      </Card>
      <HStack margin="2%" width="50%">
        <p>Przetłumacz:</p>
        <Input
          ref={refInput}
          marginX="2%"
          readOnly={verified}
          onKeyUp={handleKeyPress}
        ></Input>
        <button onClick={() => checkCorectness(refInput.current?.value ?? "")}>
          Zatwierdź
        </button>
      </HStack>
      <Text
        visibility={
          refInput.current
            ? refInput.current.style.backgroundColor == "var(--error)"
              ? "visible"
              : "hidden"
            : "hidden"
        }
      >
        {question?.word_second}
      </Text>
    </Box>
  );
};

export default TypeCorrectWord;
