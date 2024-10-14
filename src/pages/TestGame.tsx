import { useParams } from "react-router-dom";
import useQuizzesQuestions from "../hooks/useQuizzesQuestions";

const TestGame = () => {
  const { id } = useParams();
  const { fetchENG } = useQuizzesQuestions();
  const { data: questions } = fetchENG(parseInt(id ?? "0"));

  return <div>TestGame</div>;
};

export default TestGame;
