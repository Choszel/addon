import { SimpleGrid, Text } from "@chakra-ui/react";
import QuizCardContainer from "./QuizCardContainer";
import QuizCard from "./QuizCard";
import QuizCardSkeleton from "./QuizCardSkeleton";
import useQuizzes from "../../hooks/useQuizzes";
import useTokenData from "../../others/useTokenData";

export interface QuizQuery {
  id: number;
  level: string;
  category: string;
  user: string;
  language: string;
  quizName: string;
}

interface Props {
  quizQuery: QuizQuery;
}

const QuizGrid = ({ quizQuery }: Props) => {
  const { data, error, isLoading } = useQuizzes(quizQuery);
  const skeletons = [1, 2, 3, 4, 5, 6];
  const { GetUserId } = useTokenData();

  if (error) return <Text>{error}</Text>;

  return (
    <div>
      <SimpleGrid
        columns={{ sm: 1, md: 2, lg: 2, xl: 3 }}
        padding={8}
        spacing={6}
      >
        {isLoading &&
          skeletons.map((skeleton) => (
            <QuizCardContainer key={skeleton}>
              <QuizCardSkeleton />
            </QuizCardContainer>
          ))}
        {data.map((quiz) => (
          <QuizCardContainer key={quiz.id}>
            <QuizCard
              quiz={quiz}
              isScore={true}
              userId={GetUserId()}
            ></QuizCard>
          </QuizCardContainer>
        ))}
      </SimpleGrid>
    </div>
  );
};

export default QuizGrid;
