import { Box, Card, HStack } from "@chakra-ui/react";
import { QuizQuestion } from "../../hooks/useQuizzesQuestions";
import { FaStar } from "react-icons/fa";
import { Dispatch, SetStateAction, useState } from "react";

interface Props {
  question: QuizQuestion;
  checkIfCorrect: (word: string) => boolean;
  setWronglyAnswered: Dispatch<SetStateAction<number[]>>;
}

const MatchGameCard = ({
  question,
  checkIfCorrect,
  setWronglyAnswered,
}: Props) => {
  const [starsColors, setStarsColors] = useState<number>(3);
  const [isDisabled, setIsDisabled] = useState(false);

  const handleCardClick = () => {
    const result = checkIfCorrect(question?.word_polish ?? "");
    if (result === false) {
      setStarsColors(starsColors - 1);
      if (starsColors == 1) {
        setIsDisabled(true);
        setWronglyAnswered((prev: number[]) => [...prev, question?.id ?? 0]);
      }
    } else {
      if (starsColors == 3) setStarsColors(4);
      setIsDisabled(true);
    }
  };

  return (
    <Card
      height="100px"
      cursor="pointer"
      onClick={handleCardClick}
      pointerEvents={isDisabled ? "none" : "auto"}
      backgroundColor={isDisabled ? "var(--border)" : "var(--foreground)"}
      color="var(--copy)"
      border="solid var(--border) 1px"
      transition="all 0.3s ease"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
    >
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        opacity={isDisabled ? 0.5 : 1}
        padding={0}
      >
        <p>{question?.word_second}</p>
      </Box>
      <HStack>
        {starsColors == 4 ? (
          <HStack>
            <FaStar size={25} color="gold" />
            <FaStar size={25} color="gold" />
            <FaStar size={25} color="gold" />
          </HStack>
        ) : starsColors == 3 ? (
          <HStack>
            <FaStar size={25} color="gainsboro" />
            <FaStar size={25} color="gainsboro" />
            <FaStar size={25} color="gainsboro" />
          </HStack>
        ) : starsColors == 2 ? (
          <HStack>
            <FaStar size={25} color="orange" />
            <FaStar size={25} color="orange" />
          </HStack>
        ) : starsColors == 1 ? (
          <HStack>
            <FaStar size={25} color="red" />
          </HStack>
        ) : null}
      </HStack>
    </Card>
  );
};

export default MatchGameCard;
