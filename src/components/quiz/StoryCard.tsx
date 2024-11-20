import { Quiz } from "../../hooks/useQuizzes";
import useStories from "../../hooks/useStories";
import StoryDetails from "./StoryDetails";
import ItemCard from "./ItemCard";

interface Props {
  quiz: Quiz;
  isScore?: boolean;
  userId?: number;
  open?: boolean;
}

const StoryCard = ({ quiz, isScore, userId, open }: Props) => {
  const { fetchUserQuestions, fetchAmountOfQuestions } = useStories();
  const {
    data: questions,
    isLoading: quesIsLoading,
    error: quesError,
  } = fetchUserQuestions(quiz.id ?? 0, userId);
  const { data: amountOfQuestions } = fetchAmountOfQuestions(quiz.id ?? 0);

  return (
    <ItemCard
      quiz={quiz}
      isScore={isScore}
      userId={userId}
      open={open}
      questions={questions}
      amountOfQuestions={amountOfQuestions}
      modalDetails={
        <StoryDetails
          quiz={quiz}
          userId={userId}
          questions={questions}
          isLoading={quesIsLoading}
          error={quesError}
        ></StoryDetails>
      }
    />
  );
};

export default StoryCard;
