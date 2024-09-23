import { Box, Card, CardBody, HStack, Heading } from "@chakra-ui/react";
import { Quiz } from "../../hooks/useQuizes";

interface Props {
  quiz: Quiz;
}

const QuizCard = ({ quiz }: Props) => {
  return (
    <Card
      border="solid black 1px"
      borderRadius={10}
      overflow="hidden"
      bg="white"
      display="flex"
      flexDirection="column"
      alignItems="center"
      // color="var(--neutral1)"
    >
      <CardBody>
        <Heading fontSize="xl">{quiz?.title}</Heading>
        <Box display="flex" flexDirection="column" alignItems="flex-start">
          <p>Twórca: {quiz.user ?? "No user"}</p>
          <p>Język: {quiz.language ?? "No language"}</p>
          <HStack>
            {" "}
            <p>Kategria: </p>
            <button className="gradient_button">
              {quiz.category ?? "No category"}
            </button>
          </HStack>
          <HStack>
            <p>Poziom: </p>
            <button className="gradient_button">
              {quiz.level ?? "No level"}
            </button>
          </HStack>
        </Box>
      </CardBody>
    </Card>
  );
};

export default QuizCard;
