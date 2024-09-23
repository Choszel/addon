import { HStack, SimpleGrid, Text } from "@chakra-ui/react";
import QuizCardContainer from "./QuizCardContainer";
import QuizCard from "./QuizCard";
import QuizCardSkeleton from "./QuizCardSkeleton";
import useQuizes from "../../hooks/useQuizes";
import { BsFire } from "react-icons/bs";

export interface QuizQuery {
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
  const { data, error, isLoading } = useQuizes(quizQuery);
  const skeletons = [1, 2, 3, 4, 5, 6];

  if (error) return <Text>{error}</Text>;

  return (
    <div>
      <HStack>
        <h1>Lista zestawów do nauki na Topie</h1>
        <BsFire size={45} />
      </HStack>
      <SimpleGrid
        columns={{ sm: 1, md: 2, lg: 3, xl: 4 }}
        padding={10}
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
            <QuizCard quiz={quiz}></QuizCard>
          </QuizCardContainer>
        ))}
      </SimpleGrid>
    </div>
  );
};

export default QuizGrid;
