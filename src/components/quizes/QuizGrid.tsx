import { SimpleGrid, Text } from "@chakra-ui/react";
import QuizCardContainer from "./QuizCardContainer";
import QuizCard from "./QuizCard";
import QuizCardSkeleton from "./QuizCardSkeleton";
import useQuizzes from "../../hooks/useQuizzes";
import useTokenData from "../../others/useTokenData";
import useCategories from "../../hooks/useCategories";
import useDifficultyLevels from "../../hooks/useDifficultyLevels";

export interface QuizQuery {
  id: number;
  level: string;
  category: string;
  user: string;
  language: string;
  title: string;
}

interface Props {
  quizQuery: QuizQuery;
  quiz_id?: string;
  selectedCategory: number;
  selectedLevel: number;
}

const QuizGrid = ({
  quizQuery,
  quiz_id,
  selectedCategory,
  selectedLevel,
}: Props) => {
  const { data, error, isLoading } = useQuizzes(quizQuery);
  const skeletons = [1, 2, 3, 4, 5, 6];
  const { GetUserId } = useTokenData();
  const { data: categories } = useCategories();
  const { data: difficultyLevels } = useDifficultyLevels();

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
              open={quiz.id == parseInt(quiz_id ?? "0") ? true : false}
              categories={categories}
              difficultyLevels={difficultyLevels}
              selectedCategory={selectedCategory}
              selectedLevel={selectedLevel}
            ></QuizCard>
          </QuizCardContainer>
        ))}
      </SimpleGrid>
    </div>
  );
};

export default QuizGrid;
