import {
  Box,
  Card,
  CardBody,
  HStack,
  Heading,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  useDisclosure,
  Text,
} from "@chakra-ui/react";
import { Quiz } from "../../hooks/useQuizzes";
import QuizDetails from "./QuizDetails";
import { LuArrowLeft } from "react-icons/lu";
import { useEffect, useState } from "react";
import useQuizzesQuestions from "../../hooks/useQuizzesQuestions";

interface Props {
  quiz: Quiz;
  isScore?: boolean;
  userId?: number;
}

const QuizCard = ({ quiz, isScore, userId }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [score, setScore] = useState<number>(0.0);
  const { fetchUserQuestions, fetchAmountOfQuestions } = useQuizzesQuestions();
  const { data: questions } = fetchUserQuestions(quiz.id ?? 0, userId);
  const { data: amountOfQuestions } = fetchAmountOfQuestions(quiz.id ?? 0);

  useEffect(() => {
    const answeredQuestions = questions.filter(
      (question) => question.done == true
    );
    setScore(
      answeredQuestions.length / amountOfQuestions[0]?.amount_of_questions ?? 0
    );
  }, [amountOfQuestions]);

  return (
    <>
      <Card
        border="solid black 1px"
        borderRadius={10}
        overflow="hidden"
        bg="white"
        display="flex"
        flexDirection="column"
        alignItems="center"
        // color="var(--neutral1)"
        onClick={onOpen}
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
          {isScore ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
              }}
            >
              <p>{score}</p>
            </div>
          ) : null}
        </CardBody>
      </Card>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalBody>
            <HStack marginY="5%" width="75%" onClick={onClose} cursor="pointer">
              <LuArrowLeft size={32} />
              <Text
                textTransform="uppercase"
                className="product_list_text_main"
                marginX="5%"
              >
                {" "}
                Powrót
              </Text>
            </HStack>
            <QuizDetails
              quiz={quiz}
              userId={userId}
              questions={questions}
            ></QuizDetails>
          </ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default QuizCard;
