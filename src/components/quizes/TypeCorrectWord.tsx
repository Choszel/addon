import { Box, Card, CardBody, Input, Stack, Text } from "@chakra-ui/react";
import { QuizQuestion } from "../../hooks/useQuizzesQuestions";
import { HiSpeakerWave } from "react-icons/hi2";
import { useEffect, useRef, useState } from "react";

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
      if (refInput.current) {
        refInput.current.style.backgroundColor = "var(--success)";
        refInput.current.style.color = "var(--success-content)";
      }
    } else {
      if (refInput.current) {
        refInput.current.style.backgroundColor = "var(--error)";
        refInput.current.style.backgroundColor = "var(--error-content)";
      }
    }
    setTimeout(() => {
      if (refInput.current) {
        refInput.current.style.backgroundColor = "var(--foreground)";
        refInput.current.value = "";
      }
      setVerified(false);
    }, 2000);
  };

  const handleSpeak = () => {
    console.log("speak", question?.word_second);
    msg.lang = "en-US";
    msg.text = question?.word_second ?? "";
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(msg);
  };

  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis
        .getVoices()
        .filter((voice) => voice.lang === "en-US");
      msg.voice = voices[0];
    };

    window.speechSynthesis.addEventListener("voiceschanged", loadVoices);

    loadVoices();

    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
    };
  }, []);

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
        <CardBody
          display="flex"
          justifyContent="center"
          alignItems="center"
          className="custom_card"
        >
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
        <button onClick={() => checkCorectness(refInput.current?.value ?? "")}>
          Zatwierdź
        </button>
      </Stack>
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
