import { useNavigate, useParams } from "react-router-dom";
import useQuizzesQuestions, {
  QuizQuestion,
} from "../hooks/useQuizzesQuestions";
import { Box, SimpleGrid } from "@chakra-ui/react";
import MatchGameCard from "../components/quizes/MatchGameCard";
import { useEffect, useState } from "react";
import GameLayout from "../components/quizes/GameLayout";

const MatchGame = () => {
  const { id } = useParams();
  const { fetchENG } = useQuizzesQuestions();
  const { data: questions } = fetchENG(parseInt(id ?? "0"));
  const [drawNumbers, setDrawNumbers] = useState<number[]>([]);
  const [currentWord, setCurrentWord] = useState<QuizQuestion | undefined>();
  const [wronglyAnswered, setWronglyAnswered] = useState<number[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const navigate = useNavigate();
  const [isModalOpen, setModalOpen] = useState<boolean>(false);

  const getRandomInt = () => {
    if (!questions) return;
    if (drawNumbers.length === questions.length) {
      setShowConfetti(true);
      setTimeout(() => {
        setModalOpen(true);
      }, 250);
      return;
    }

    let randomIndex;
    let maxAttempts = 100;
    do {
      randomIndex = Math.floor(Math.random() * questions.length);
      maxAttempts--;
    } while (drawNumbers.includes(randomIndex) && maxAttempts > 0);

    setDrawNumbers((prevDrawNumbers) => [...prevDrawNumbers, randomIndex]);
    setCurrentWord(questions[randomIndex]);
  };

  useEffect(() => {
    if (questions && questions.length > 0) {
      getRandomInt();
    }
  }, [questions]);

  useEffect(() => {
    if (wronglyAnswered.length == 0) return;
    setDrawNumbers((prevDrawNumbers) => [
      ...prevDrawNumbers,
      questions.findIndex(
        (q) => q.id === wronglyAnswered[wronglyAnswered.length - 1]
      ),
    ]);
  }, [wronglyAnswered]);

  const checkIfCorrect = (word: string) => {
    if (word === currentWord?.word_polish) {
      getRandomInt();
      return true;
    } else {
      return false;
    }
  };

  return (
    <GameLayout
      showConfetti={showConfetti}
      goBack={() => {
        navigate("/flashcards/" + id);
      }}
      isModalOpen={isModalOpen}
      saveProgress={false}
      quizId={id ?? ""}
    >
      <Box>
        {currentWord ? (
          <>
            <h1>{currentWord.word_polish}</h1>
            <SimpleGrid
              columns={{ sm: 3, md: 3, lg: 5, xl: 5 }}
              padding={8}
              spacing={6}
            >
              {questions.map((question) => (
                <MatchGameCard
                  key={question.id}
                  question={question}
                  checkIfCorrect={checkIfCorrect}
                  setWronglyAnswered={setWronglyAnswered}
                />
              ))}
            </SimpleGrid>
          </>
        ) : (
          <p>Ładowanie pytań...</p>
        )}
      </Box>
    </GameLayout>
  );
};

export default MatchGame;
