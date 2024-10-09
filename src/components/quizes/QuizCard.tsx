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
  ModalCloseButton,
  Button,
} from "@chakra-ui/react";
import { Quiz } from "../../hooks/useQuizzes";
import QuizDetails from "./QuizDetails";
import { LuArrowLeft } from "react-icons/lu";
import { useEffect, useState } from "react";
import useQuizzesQuestions from "../../hooks/useQuizzesQuestions";
import useCategories from "../../hooks/useCategories";
import useDifficultyLevels from "../../hooks/useDifficultyLevels";
import useTokenData from "../../others/useTokenData";
import actionData from "../../hooks/actionData";

interface Props {
  quiz: Quiz;
  isScore?: boolean;
  userId?: number;
}

const QuizCard = ({ quiz, isScore, userId }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: deleteIsOpen,
    onOpen: deleteOnOpen,
    onClose: deleteOnClose,
  } = useDisclosure();
  const [score, setScore] = useState<number>(0.0);
  const { fetchUserQuestions, fetchAmountOfQuestions } = useQuizzesQuestions();
  const { data: questions } = fetchUserQuestions(quiz.id ?? 0, userId);
  const { data: amountOfQuestions } = fetchAmountOfQuestions(quiz.id ?? 0);
  const [categoriesQuizzes, setCategoriesQuizzes] = useState<string[]>([""]);
  const [levelsQuizzes, setLevelsQuizzes] = useState<string[]>([""]);
  const { data: categories } = useCategories();
  const { data: difficultyLevels } = useDifficultyLevels();
  const { GetUserLogin } = useTokenData();
  const { deleteData } = actionData("/quizzes");

  useEffect(() => {
    const answeredQuestions = questions.filter(
      (question) => question.done == true
    );
    setScore(
      answeredQuestions.length / amountOfQuestions[0]?.amount_of_questions
    );
    let questionsCategories = [
      ...new Set(
        questions.map(
          (q) => categories.find((c) => c.id == q.ws_category_id)?.name ?? ""
        )
      ),
    ];
    let questionsLevels = [
      ...new Set(
        questions.map(
          (q) =>
            difficultyLevels.find((df) => df.id == q.ws_level_id)?.level ?? ""
        )
      ),
    ];
    setCategoriesQuizzes(questionsCategories);
    setLevelsQuizzes(questionsLevels);
    console.log("questionsCategories", questionsCategories);
    console.log("questionsLevels", questionsLevels);
  }, [amountOfQuestions, categories, difficultyLevels]);

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
        key={quiz.id}
      >
        <CardBody w="100%">
          <HStack justifyContent="space-between">
            <Heading fontSize="xl">{quiz?.title}</Heading>
            {GetUserLogin() == quiz.user ? (
              <button
                className="tag_error"
                style={{ cursor: "pointer" }}
                onClick={deleteOnOpen}
              >
                X
              </button>
            ) : null}
          </HStack>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="flex-start"
            onClick={onOpen}
          >
            <p>Twórca: {quiz.user ?? "No user"}</p>
            <p>Język: {quiz.language ?? "No language"}</p>
            <HStack>
              {" "}
              <p>Kategria: </p>
              {categoriesQuizzes.length > 3 ? (
                <HStack>
                  <button className="tag_category">
                    {categoriesQuizzes[0] ?? "No category"}
                  </button>
                  <button className="tag_category">
                    {categoriesQuizzes[1] ?? "No category"}
                  </button>
                  <button className="tag_category">others</button>
                </HStack>
              ) : categoriesQuizzes.length == 0 ? (
                <button className="tag_error">X</button>
              ) : (
                categoriesQuizzes.map((cq) => (
                  <button className="tag_category">
                    {cq ?? "No category"}
                  </button>
                ))
              )}
            </HStack>
            <HStack>
              <p>Poziom: </p>
              {levelsQuizzes.length > 4 ? (
                <button className="tag_infinity">∞</button>
              ) : levelsQuizzes.length == 0 ? (
                <button className="tag_error">X</button>
              ) : (
                levelsQuizzes.map((lq) => (
                  <button className="tag_category">{lq ?? "No level"}</button>
                ))
              )}
            </HStack>
          </Box>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
            }}
          >
            {isScore ? <p>{(score * 100).toFixed(0) + "%"}</p> : <p>0%</p>}
          </div>
        </CardBody>
      </Card>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent maxW="100%" width="50%">
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
              categories={categoriesQuizzes}
              difficultyLevels={levelsQuizzes}
            ></QuizDetails>
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal isOpen={deleteIsOpen} onClose={deleteOnClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            <p>Czy na pewno chcesz usunąć dany quiz?</p>
            <p style={{ fontWeight: "bold" }}>
              UWAGA! Spowoduje to usunięcie wszytskich danych powiązanych z tym
              quizem!
            </p>
          </ModalBody>
          <ModalFooter>
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

export default QuizCard;
