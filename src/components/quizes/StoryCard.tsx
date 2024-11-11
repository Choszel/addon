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
  ModalCloseButton,
  Button,
} from "@chakra-ui/react";
import { Quiz } from "../../hooks/useQuizzes";
import { useEffect, useState } from "react";
import useTokenData from "../../others/useTokenData";
import actionData from "../../hooks/actionData";
import GoBack from "../GoBack";
import { useNavigate } from "react-router-dom";
import useStories from "../../hooks/useStories";
import StoryDetails from "./StoryDetails";
import { IoTrashOutline } from "react-icons/io5";

interface Props {
  quiz: Quiz;
  isScore?: boolean;
  userId?: number;
  open?: boolean;
  selectedCategory: number;
  selectedLevel: number;
}

const StoryCard = ({ quiz, isScore, userId, open }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: deleteIsOpen,
    onOpen: deleteOnOpen,
    onClose: deleteOnClose,
  } = useDisclosure();
  const [score, setScore] = useState<number>(0.0);
  const { fetchUserQuestions, fetchAmountOfQuestions } = useStories();
  const {
    data: questions,
    isLoading: quesIsLoading,
    error: quesError,
  } = fetchUserQuestions(quiz.id ?? 0, userId);
  const { data: amountOfQuestions } = fetchAmountOfQuestions(quiz.id ?? 0);

  const { GetUserLogin } = useTokenData();
  const { deleteData } = actionData("/quizzes");
  const navigate = useNavigate();

  useEffect(() => {
    const answeredQuestions = questions.filter(
      (question) => question.done == true
    );
    const tempScore =
      answeredQuestions.length / amountOfQuestions[0]?.amount_of_questions;
    setScore(tempScore > 0 ? tempScore : 0);
  }, [amountOfQuestions]);

  useEffect(() => {
    if (open) onOpen();
  }, []);

  return (
    <>
      <Card
        border="solid var(--border) 1px"
        borderRadius={10}
        overflow="hidden"
        display="flex"
        flexDirection="column"
        alignItems="center"
        key={quiz.id}
        bg="var(--foreground)"
        height="100%"
      >
        <CardBody
          w="100%"
          height="100%"
          position="relative"
          className={
            score === 0
              ? "no_score"
              : score <= 0.25
              ? "low_score"
              : score <= 0.5
              ? "medium_score"
              : score <= 0.75
              ? "high_score"
              : score < 1
              ? "very_high_score"
              : "max_score"
          }
        >
          <HStack justifyContent="space-between">
            <Heading
              fontSize="xl"
              onClick={() => {
                navigate("/flashcards/" + quiz.id);
                onOpen();
              }}
            >
              {quiz?.title}
            </Heading>
            {GetUserLogin() == quiz.user ? (
              <IoTrashOutline
                cursor="pointer"
                color="var(--error)"
                size={35}
                onClick={deleteOnOpen}
                z={20}
              />
            ) : null}
          </HStack>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="flex-start"
            onClick={() => {
              navigate("/flashcards/" + quiz.id);
              onOpen();
            }}
          >
            <p>Twórca: {quiz.user ?? "No user"}</p>
            <p>Język: {quiz.language ?? "No language"}</p>
          </Box>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              position: "absolute",
              bottom: "30px",
              right: "20px",
            }}
            onClick={() => {
              navigate("/flashcards/" + quiz.id);
              onOpen();
            }}
          >
            {isScore ? <p>{(score * 100).toFixed(0) + "%"}</p> : <p>0%</p>}
          </div>
        </CardBody>
      </Card>

      <Modal
        isOpen={isOpen}
        onClose={() => {
          onClose();
          navigate("/flashcards");
        }}
      >
        <ModalOverlay />
        <ModalContent
          maxW="100%"
          width={{ base: "90%", md: "50%" }}
          bg="var(--foreground)"
        >
          <ModalBody>
            <GoBack
              goBack={() => {
                onClose();
                navigate("/flashcards");
              }}
              margin="5%"
              width="75%"
            />
            <StoryDetails
              quiz={quiz}
              userId={userId}
              questions={questions}
              isLoading={quesIsLoading}
              error={quesError}
            ></StoryDetails>
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal isOpen={deleteIsOpen} onClose={deleteOnClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody className="basic_style">
            <p>Czy na pewno chcesz usunąć dany quiz?</p>
            <p style={{ fontWeight: "bold" }}>
              UWAGA! Spowoduje to usunięcie wszytskich danych powiązanych z tym
              quizem!
            </p>
          </ModalBody>
          <ModalFooter className="basic_style">
            <Button
              colorScheme="red"
              mr={3}
              onClick={() => {
                console.log(quiz.title);
                console.log(quiz.id?.toString());
                const formData = new URLSearchParams();
                formData.append("id", quiz.id?.toString() ?? "");
                deleteData(formData);
                window.location.reload(); // nie widać po tym toast
              }}
            >
              Usuń
            </Button>
            <Button colorScheme="blue" mr={3} onClick={deleteOnClose}>
              Anuluj
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default StoryCard;