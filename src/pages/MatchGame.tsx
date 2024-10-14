import { useParams } from "react-router-dom";
import useQuizzesQuestions, {
  QuizQuestion,
} from "../hooks/useQuizzesQuestions";
import { Box, SimpleGrid } from "@chakra-ui/react";
import MatchGameCard from "../components/quizes/MatchGameCard";
import { useEffect, useState } from "react";
import Confetti from "react-confetti";

const MatchGame = () => {
  const { id } = useParams();
  const { fetchENG } = useQuizzesQuestions();
  const { data: questions } = fetchENG(parseInt(id ?? "0"));
  const [drawNumbers, setDrawNumbers] = useState<number[]>([]);
  const [currentWord, setCurrentWord] = useState<QuizQuestion | undefined>();
  const [wronglyAnswered, setWronglyAnswered] = useState<number[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);

  const getRandomInt = () => {
    console.log("drawNumbers przed: ", drawNumbers);
    if (!questions) return;
    if (drawNumbers.length === questions.length) {
      console.log("done");
      setShowConfetti(true);
      return;
    }

    let randomIndex;
    let maxAttempts = 100;
    do {
      console.log("while");
      randomIndex = Math.floor(Math.random() * questions.length);
      maxAttempts--;
    } while (drawNumbers.includes(randomIndex) || maxAttempts > 0);

    setDrawNumbers((prevDrawNumbers) => [...prevDrawNumbers, randomIndex]);
    setCurrentWord(questions[randomIndex]);
    console.log("drawNumbers po: ", drawNumbers);
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
    console.log("wronglyAnswered", wronglyAnswered);
    console.log("questions", questions);
  }, [wronglyAnswered]);

  const checkIfCorrect = (word: string) => {
    if (word === currentWord?.word_polish) {
      getRandomInt();
      console.log("correct");
      return true;
    } else {
      console.log("false");
      return false;
    }
  };

  return (
    <Box>
      {showConfetti && <Confetti recycle={false} gravity={0.2} />}
      {currentWord ? (
        <>
          <h1>{currentWord.word_second}</h1>
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
      <button onClick={() => console.log(drawNumbers)}>Kliknij mnie</button>
    </Box>
  );
};

export default MatchGame;
