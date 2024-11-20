import { useNavigate, useParams } from "react-router-dom";
import useQuizzes from "../../hooks/useQuizzes";
import ChooseMatching from "../../components/quiz/ChooseMatching";
import { useEffect, useState } from "react";
import TypeCorrectWord from "../../components/quiz/TypeCorrectWord";
import actionData from "../../hooks/actionData";
import useTokenData from "../../others/useTokenData";
import { Show } from "@chakra-ui/react";
import GameLayout from "../../components/quiz/GameLayout";

const TestGame = () => {
  const { id } = useParams();
  const { GetUserId } = useTokenData();
  const { fetchENG, fetchUserScores, fetchUserQuestions } = useQuizzes();
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
    if (!questions) return;
    if (drawNumbers.length === questions.length) {
      setShowConfetti(true);

      setTimeout(() => {
        handleSave();
        setModalOpen(true);
      }, 250);
      return;
    }

    setQuestionType(Math.floor(Math.random() * 4));
    let randomIndex: number;
    let maxAttempts = 100;
    do {
      randomIndex = Math.floor(Math.random() * questions.length);
      maxAttempts--;
    } while (drawNumbers.includes(randomIndex) && maxAttempts > 0);
    setDrawNumbers((prevDrawNumbers) => [...prevDrawNumbers, randomIndex]);
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

  const getRandomNumbersForAnswers = () => {
    let maxAttempts = 100;
    let randomIndex: number;
    let tempArray: number[] = [];

    do {
      randomIndex = Math.floor(Math.random() * questions.length);
      if (randomIndex != drawNumbers[drawNumbers.length - 1])
        if (!tempArray.includes(randomIndex)) tempArray.push(randomIndex);
      maxAttempts--;
    } while (tempArray.length < 3 && maxAttempts > 0);
    setDrawNumbersAnswers(tempArray);
  };

  const checkIfCorrect = (word: string) => {
    setTimeout(() => {
      getRandomNumbers();
    }, 2000);
    if (
      (questionType < 2 &&
        word === questions[drawNumbers[drawNumbers.length - 1]]?.word_polish) ||
      (questionType > 1 &&
        questions.find(
          (question) =>
            question.word_second == word &&
            question.word_polish ==
              questions[drawNumbers[drawNumbers.length - 1]]?.word_polish
        ))
    ) {
      const tempArray = correctAnswers;
      tempArray.push(questions[drawNumbers[drawNumbers.length - 1]]?.id ?? 0);
      setCorrectAnswers(tempArray);
      return true;
    } else {
      return false;
    }
  };

  useEffect(() => {
    const currentScore = userScores.find(
      (score) => score.id == parseInt(id ?? "0")
    );
    setCurrentScore(currentScore?.quiz_score_id ?? 0);
  }, [userScores]);

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
    <GameLayout
      showConfetti={showConfetti}
      goBack={() => {
        navigate("/flashcards/" + id);
      }}
      isModalOpen={isModalOpen}
      saveProgress={true}
      quizId={id ?? ""}
    >
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
    </GameLayout>
  );
};

export default TestGame;
