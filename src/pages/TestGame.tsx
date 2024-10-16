import { useParams } from "react-router-dom";
import useQuizzesQuestions from "../hooks/useQuizzesQuestions";
import ChooseMatching from "../components/quizes/ChooseMatching";
import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import TypeCorrectWord from "../components/quizes/TypeCorrectWord";

const TestGame = () => {
  const { id } = useParams();
  const { fetchENG } = useQuizzesQuestions();
  const { data: questions } = fetchENG(parseInt(id ?? "0"));
  const [drawNumbers, setDrawNumbers] = useState<number[]>([]);
  const [questionType, setQuestionType] = useState<number>(0);
  const [drawNumbersAnswers, setDrawNumbersAnswers] = useState<number[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);

  const getRandomNumbers = () => {
    console.log("drawNumbers przed: ", drawNumbers);
    if (!questions) return;
    if (drawNumbers.length === questions.length) {
      console.log("done");
      setShowConfetti(true);
      return;
    }

    setQuestionType(Math.floor(Math.random() * 4));
    let randomIndex: number;
    let maxAttempts = 100;
    do {
      console.log("while");
      randomIndex = Math.floor(Math.random() * questions.length);
      maxAttempts--;
    } while (drawNumbers.includes(randomIndex) && maxAttempts > 0);
    setDrawNumbers((prevDrawNumbers) => [...prevDrawNumbers, randomIndex]);
    console.log("drawNumbers po: ", drawNumbers);
  };

  const getRandomNumbersForAnswers = () => {
    let maxAttempts2 = 100;
    let randomIndex: number;
    let tempArray: number[] = [];

    do {
      console.log("while2");
      randomIndex = Math.floor(Math.random() * questions.length);
      console.log("randomIndex", randomIndex);
      console.log(randomIndex != drawNumbers[drawNumbers.length - 1]);
      console.log(drawNumbersAnswers?.includes(randomIndex));
      if (randomIndex != drawNumbers[drawNumbers.length - 1])
        if (!tempArray.includes(randomIndex)) tempArray.push(randomIndex);
      maxAttempts2--;
    } while (tempArray.length < 3 && maxAttempts2 > 0);
    setDrawNumbersAnswers(tempArray);
    console.log("drawNumbersAnswers", drawNumbersAnswers);
  };

  const checkIfCorrect = (word: string) => {
    if (
      word ===
      (questionType < 2
        ? questions[drawNumbers[drawNumbers.length - 1]]?.word_polish
        : questions[drawNumbers[drawNumbers.length - 1]]?.word_second)
    ) {
      setTimeout(() => {
        getRandomNumbers();
      }, 2000);
      console.log("correct");
      return true;
    } else {
      setTimeout(() => {
        getRandomNumbers();
      }, 2000);
      console.log("false");
      return false;
    }
  };

  useEffect(() => {
    if (questions && questions.length > 0) {
      getRandomNumbers();
    }
  }, [questions]);

  useEffect(() => {
    if (drawNumbers && drawNumbers.length > 0 && questionType < 2) {
      getRandomNumbersForAnswers();
    }
  }, [drawNumbers]);

  return (
    <div>
      {showConfetti && <Confetti recycle={false} gravity={0.2} />}
      {questionType < 2 ? (
        <ChooseMatching
          questions={[
            questions[drawNumbers[drawNumbers.length - 1]],
            questions[drawNumbersAnswers[0]],
            questions[drawNumbersAnswers[1]],
            questions[drawNumbersAnswers[2]],
          ]}
          type={questionType == 0 ? "word" : "photo"}
          checkIfCorrect={checkIfCorrect}
        ></ChooseMatching>
      ) : (
        <TypeCorrectWord
          question={questions[drawNumbers[drawNumbers.length - 1]]}
          type={questionType == 2 ? "word" : "speaker"}
          checkIfCorrect={checkIfCorrect}
        ></TypeCorrectWord>
      )}

      <button
        onClick={() => {
          console.log(drawNumbers);
          console.log(drawNumbersAnswers);
        }}
      >
        Kliknij mnie
      </button>
    </div>
  );
};

export default TestGame;
