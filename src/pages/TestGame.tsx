import { useNavigate, useParams } from "react-router-dom";
import useQuizzesQuestions from "../hooks/useQuizzesQuestions";
import ChooseMatching from "../components/quizes/ChooseMatching";
import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import TypeCorrectWord from "../components/quizes/TypeCorrectWord";
import GoBack from "../components/GoBack";
import EndOfTheQuizModal from "../components/EndOfTheQuizModal";
import actionData from "../hooks/actionData";
import useTokenData from "../others/useTokenData";
import { Show } from "@chakra-ui/react";

const TestGame = () => {
  const { id } = useParams();
  const { GetUserId } = useTokenData();
  const { fetchENG, fetchUserScores, fetchUserQuestions } =
    useQuizzesQuestions();
  const { data: questions } = fetchENG(parseInt(id ?? "0"));
  const { data: userScores } = fetchUserScores(GetUserId());
  const [currentScore, setCurrentScore] = useState<number>(0);
  const { data: userQuestions } = fetchUserQuestions(currentScore);
  const [drawNumbers, setDrawNumbers] = useState<number[]>([]);
  const [questionType, setQuestionType] = useState<number>(0);
  const [drawNumbersAnswers, setDrawNumbersAnswers] = useState<number[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const navigate = useNavigate();
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [correctAnswers, setCorrectAnswers] = useState<number[]>([]);
  const { postData: postUserQuestions } = actionData("/usersQuizzesQuestions");

  const getRandomNumbers = () => {
    console.log("drawNumbers przed: ", drawNumbers);
    if (!questions) return;
    if (drawNumbers.length === questions.length) {
      console.log("done");
      setShowConfetti(true);
      setTimeout(() => {
        handleSave();
        setModalOpen(true);
      }, 250);
      console.log(correctAnswers);
      console.log(questions);

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

  const handleSave = async () => {
    if (correctAnswers.length < 1) return;

    setCorrectAnswers(
      correctAnswers.filter(
        (answer) =>
          !userQuestions.some((uq) => uq.users_quizzes_scores_id === answer)
      )
    );

    const formData = new URLSearchParams();
    formData.append("quiz_score_id", currentScore.toString());
    formData.append("data", JSON.stringify([...correctAnswers]));
    postUserQuestions(formData);
  };

  useEffect(() => {
    const currentScore = userScores.find(
      (score) => score.id == parseInt(id ?? "0")
    );
    setCurrentScore(currentScore?.quiz_score_id ?? 0);
  }, [userScores]);

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
    setTimeout(() => {
      getRandomNumbers();
    }, 2000);
    if (
      word ===
      (questionType < 2
        ? questions[drawNumbers[drawNumbers.length - 1]]?.word_polish
        : questions[drawNumbers[drawNumbers.length - 1]]?.word_second)
    ) {
      console.log("correct");
      const tempArray = correctAnswers;
      tempArray.push(questions[drawNumbers[drawNumbers.length - 1]]?.id ?? 0);
      setCorrectAnswers(tempArray);
      return true;
    } else {
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
      <GoBack
        goBack={() => {
          navigate("/flashcards/" + id);
        }}
        margin="2%"
      />
      {showConfetti && (
        <Confetti recycle={false} gravity={0.2} width={window.innerWidth} />
      )}
      <Show below="md">
        <br />
      </Show>
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
      <EndOfTheQuizModal
        isOpen={isModalOpen}
        goBackTo={"/flashcards/" + id}
        saveProgress={true}
      ></EndOfTheQuizModal>
    </div>
  );
};

export default TestGame;
