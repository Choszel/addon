import { useParams } from "react-router-dom";
import useQuizzesQuestions from "../hooks/useQuizzesQuestions";
import { useEffect, useState } from "react";
import { Box, Card, CardBody, HStack } from "@chakra-ui/react";
import { PiArrowsCounterClockwise } from "react-icons/pi";
import { FaArrowLeft } from "react-icons/fa6";
import { FaArrowRight } from "react-icons/fa6";

const FlashcardGame = () => {
  const { id } = useParams();
  const { fetchENG } = useQuizzesQuestions();
  const { data: questions } = fetchENG(parseInt(id ?? "0"));
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPolishVisible, setIsPolishVisible] = useState(true);
  const [isFlipped, setIsFlipped] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [leftArrowPosition, setLeftArrowPosition] = useState(0);
  const [rightArrowPosition, setRightArrowPosition] = useState(0);

  const turnCard = () => {
    setIsFlipped(true);

    setTimeout(() => {
      setIsPolishVisible((prev) => !prev);
      setIsFlipped(false);
    }, 250);

    setRotation((prevRotation) => prevRotation - 180);
  };

  const goLeft = () => {
    if (currentIndex > 0) {
      setLeftArrowPosition(-30);
      setTimeout(() => {
        setCurrentIndex(currentIndex - 1);
        setIsPolishVisible(true);
        setLeftArrowPosition(0);
      }, 300);
    }
  };

  const goRight = () => {
    if (currentIndex < questions.length) {
      setRightArrowPosition(+30);
      setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
        setIsPolishVisible(true);
        setRightArrowPosition(0);
      }, 300);
    }
  };

  const goBack = () => {};

  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.code === "ArrowLeft") {
      goLeft();
    } else if (event.code === "ArrowRight") {
      goRight();
    } else if (event.code === "Space") {
      turnCard();
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [currentIndex, isPolishVisible]);

  return (
    <Box width="40%">
      <Card
        height="200px"
        onClick={currentIndex == questions.length ? goBack : turnCard}
        cursor="pointer"
        transform={isFlipped ? "rotateY(180deg)" : "rotateY(0)"}
        transition="transform 0.5s ease-in-out"
        style={{ backfaceVisibility: "hidden" }}
      >
        <CardBody display="flex" justifyContent="center" alignItems="center">
          {currentIndex === questions.length ? (
            <p>Koniec quizu! Powrót</p>
          ) : (
            <p>
              {isPolishVisible
                ? questions[currentIndex]?.word_polish
                : questions[currentIndex]?.word_second}
            </p>
          )}
        </CardBody>
      </Card>
      <HStack display="flex" justifyContent="space-between" margin="2% 5%">
        <div
          className="circle"
          style={{
            transform: `translateX(${leftArrowPosition}px)`,
            transition: "transform 0.3s ease-in-out",
          }}
        >
          <FaArrowLeft size={20} onClick={goLeft} />
        </div>
        <PiArrowsCounterClockwise
          size={40}
          onClick={turnCard}
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: "transform 0.5s ease-in-out",
          }}
        />
        <div
          className="circle"
          style={{
            transform: `translateX(${rightArrowPosition}px)`,
            transition: "transform 0.3s ease-in-out",
          }}
        >
          <FaArrowRight size={20} onClick={goRight} />
        </div>
      </HStack>
    </Box>
  );
};

export default FlashcardGame;
