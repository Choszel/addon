import { SimpleGrid, Text } from "@chakra-ui/react";
import ItemCardContainer from "./ItemCardContainer";
import QuizCard from "./QuizCard";
import ItemCardSkeleton from "./ItemCardSkeleton";
import { Quiz } from "../../hooks/useQuizzes";
import useCategories from "../../hooks/useCategories";
import useDifficultyLevels from "../../hooks/useDifficultyLevels";
import StoryCard from "./StoryCard";

export interface QuizQuery {
  id: number;
  level: string;
  category: string;
  user: string;
  language: string;
  title: string;
}

interface Props {
  quiz_id?: string;
  data: Quiz[];
  error: string;
  isLoading: boolean;
  userId: number;
}

const QuizGrid = ({ quiz_id, data, error, isLoading, userId }: Props) => {
  const skeletons = [1, 2, 3, 4, 5, 6];
  const { data: categories } = useCategories();
  const { data: difficultyLevels } = useDifficultyLevels();

  if (error) return <Text color="var(--error)">{error}</Text>;
  if (data.length == 0) return <Text>Brak zestawów.</Text>;

  return (
    <div>
      <SimpleGrid
        columns={{ sm: 1, md: 2, lg: 2, xl: 3 }}
        paddingX={{ base: "0", md: "8" }}
        spacing={6}
      >
        {isLoading &&
          skeletons.map((skeleton) => (
            <ItemCardContainer key={skeleton}>
              <ItemCardSkeleton />
            </ItemCardContainer>
          ))}
        {data.map((quiz) => (
          <ItemCardContainer key={quiz.id}>
            {quiz.type == "quiz" ? (
              <QuizCard
                quiz={quiz}
                isScore={true}
                userId={userId}
                open={quiz.id == parseInt(quiz_id ?? "0") ? true : false}
                categories={categories}
                difficultyLevels={difficultyLevels}
              ></QuizCard>
            ) : (
              <StoryCard
                quiz={quiz}
                isScore={true}
                userId={userId}
                open={quiz.id == parseInt(quiz_id ?? "0") ? true : false}
              ></StoryCard>
            )}
          </ItemCardContainer>
        ))}
      </SimpleGrid>
    </div>
  );
};

export default QuizGrid;
