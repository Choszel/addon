import { Box, Card, CardBody, Img, Stack } from "@chakra-ui/react";
import { QuizQuestion } from "../../hooks/useQuizzesQuestions";
import getCroppedImageUrl from "../../services/image-url";
import { useEffect, useRef, useState } from "react";

interface Props {
  questions: QuizQuestion[];
  type: string;
  checkIfCorrect: (word: string) => boolean;
}

const ChooseMatching = ({ questions, type, checkIfCorrect }: Props) => {
  const [shuffledNumbers, setShuffledNumbers] = useState<number[]>([]);
  const [verified, setVerified] = useState<boolean>(false);

  const ref1 = useRef<HTMLDivElement>(null);
  const ref2 = useRef<HTMLDivElement>(null);
  const ref3 = useRef<HTMLDivElement>(null);
  const ref4 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref1.current) {
      ref1.current.style.backgroundColor = "var(--foreground)";
      ref1.current.style.color = "var(--copy)";
    }

    if (ref2.current) {
      ref2.current.style.backgroundColor = "var(--foreground)";
      ref2.current.style.color = "var(--copy)";
    }

    if (ref3.current) {
      ref3.current.style.backgroundColor = "var(--foreground)";
      ref3.current.style.color = "var(--copy)";
    }

    if (ref4.current) {
      ref4.current.style.backgroundColor = "var(--foreground)";
      ref4.current.style.color = "var(--copy)";
    }
  }, [shuffledNumbers]);

  const shuffle = () => {
    const numbers = Array.from({ length: 4 }, (_, i) => i);

    for (let i = numbers.length - 1; i > 0; i--) {
      const randomIndex = Math.floor(Math.random() * (i + 1));
      [numbers[i], numbers[randomIndex]] = [numbers[randomIndex], numbers[i]];
    }
    setShuffledNumbers(numbers);
  };

  useEffect(() => {
    shuffle();
  }, []);

  const checkCorrectness = (ref: HTMLDivElement | null, word: string) => {
    if (!verified && ref) {
      const result = checkIfCorrect(word);
      setVerified(true);
      if (result) {
        ref.style.backgroundColor = "var(--success)";
      } else {
        ref.style.backgroundColor = "var(--error)";
        switch (shuffledNumbers.findIndex((value) => value == 0)) {
          case 0:
            if (ref1.current) {
              ref1.current.style.backgroundColor = "var(--success)";
              ref1.current.style.color = "var(--success-content)";
            }
            break;
          case 1:
            if (ref2.current) {
              ref2.current.style.backgroundColor = "var(--success)";
              ref2.current.style.color = "var(--success-content)";
            }
            break;
          case 2:
            if (ref3.current) {
              ref3.current.style.backgroundColor = "var(--success)";
              ref3.current.style.color = "var(--success-content)";
            }
            break;
          case 3:
            if (ref4.current) {
              ref4.current.style.backgroundColor = "var(--success)";
              ref4.current.style.color = "var(--success-content)";
            }
            break;
          default:
            break;
        }
      }
      setTimeout(() => {
        shuffle();
        setVerified(false);
      }, 2000);
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
        padding="0%"
        backgroundColor="var(--primary-dark)"
      >
        <CardBody
          display="flex"
          justifyContent="center"
          alignItems="center"
          padding="0%"
          backgroundColor="var(--primary-dark)"
          color="var(--copy)"
          borderRadius="7px"
          borderColor="var(--border)"
        >
          {type === "photo" ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height="100%"
              width="100%"
            >
              <Img
                src={getCroppedImageUrl(questions[0]?.wp_photo ?? "")}
                maxWidth="100%"
                maxHeight="200px"
                objectFit="contain"
              />
            </Box>
          ) : (
            <p>{questions[0]?.word_polish}</p>
          )}
        </CardBody>
      </Card>

      <Stack margin="2%" width="100%" direction={{ base: "column", md: "row" }}>
        <div
          ref={ref1}
          className="game_type"
          style={{ backgroundColor: "var(--foreground)" }}
          onClick={() =>
            checkCorrectness(
              ref1.current,
              questions[shuffledNumbers[0]]?.word_polish ?? ""
            )
          }
        >
          <p>{questions[shuffledNumbers[0]]?.word_second}</p>
        </div>
        <div
          ref={ref2}
          className="game_type"
          onClick={() =>
            checkCorrectness(
              ref2.current,
              questions[shuffledNumbers[1]]?.word_polish ?? ""
            )
          }
        >
          <p>{questions[shuffledNumbers[1]]?.word_second}</p>
        </div>
        <div
          ref={ref3}
          className="game_type"
          onClick={() =>
            checkCorrectness(
              ref3.current,
              questions[shuffledNumbers[2]]?.word_polish ?? ""
            )
          }
        >
          <p>{questions[shuffledNumbers[2]]?.word_second}</p>
        </div>
        <div
          ref={ref4}
          className="game_type"
          onClick={() =>
            checkCorrectness(
              ref4.current,
              questions[shuffledNumbers[3]]?.word_polish ?? ""
            )
          }
        >
          <p>{questions[shuffledNumbers[3]]?.word_second}</p>
        </div>
      </Stack>
    </Box>
  );
};

export default ChooseMatching;
