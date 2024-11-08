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
import QuizDetails from "./QuizDetails";
import { useEffect, useState } from "react";
import useQuizzesQuestions from "../../hooks/useQuizzesQuestions";
import { Category } from "../../hooks/useCategories";
import { DifficultyLevel } from "../../hooks/useDifficultyLevels";
import useTokenData from "../../others/useTokenData";
import actionData from "../../hooks/actionData";
import GoBack from "../GoBack";
import { useNavigate } from "react-router-dom";
import { IoTrashOutline } from "react-icons/io5";

interface Props {
  quiz: Quiz;
  isScore?: boolean;
  userId?: number;
  open?: boolean;
  categories: Category[];
  difficultyLevels: DifficultyLevel[];
  selectedCategory: number;
  selectedLevel: number;
}

const QuizCard = ({
  quiz,
  isScore,
  userId,
  open,
  categories,
  difficultyLevels,
  selectedCategory,
  selectedLevel,
}: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: deleteIsOpen,
    onOpen: deleteOnOpen,
    onClose: deleteOnClose,
  } = useDisclosure();
  const [score, setScore] = useState<number>(0.0);
  const { fetchUserQuestionsDetailed, fetchAmountOfQuestions } =
    useQuizzesQuestions();
  const {
    data: questions,
    isLoading: quesIsLoading,
    error: quesError,
  } = fetchUserQuestionsDetailed(quiz.id ?? 0, userId);
  const { data: amountOfQuestions } = fetchAmountOfQuestions(quiz.id ?? 0);
  const [categoriesQuizzes, setCategoriesQuizzes] = useState<string[]>([""]);
  const [levelsQuizzes, setLevelsQuizzes] = useState<string[]>([""]);

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
    let questionsCategories = [
      ...new Set(
        questions.map(
          (q) => categories?.find((c) => c.id == q.ws_category_id)?.name ?? ""
        )
      ),
    ];
    let questionsLevels = [
      ...new Set(
        questions.map(
          (q) =>
            difficultyLevels?.find((df) => df.id == q.ws_level_id)?.level ?? ""
        )
      ),
    ];
    setCategoriesQuizzes(questionsCategories);
    setLevelsQuizzes(questionsLevels);
    console.log("questionsCategories", questionsCategories);
    console.log("questionsLevels", questionsLevels);
  }, [amountOfQuestions, categories, difficultyLevels]);

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
      >
        <CardBody
          w="100%"
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
            <>
              <HStack>
                <p>Kategorie: </p>
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
            </>
          </Box>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
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
        <ModalContent maxW="100%" width="50%" bg="var(--foreground)">
          <ModalBody>
            <GoBack
              goBack={() => {
                onClose();
                navigate("/flashcards");
              }}
              margin="5%"
              width="75%"
            />
            <QuizDetails
              quiz={quiz}
              userId={userId}
              questions={questions}
              categories={categoriesQuizzes}
              difficultyLevels={levelsQuizzes}
              isLoading={quesIsLoading}
              error={quesError}
            ></QuizDetails>
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal isOpen={deleteIsOpen} onClose={deleteOnClose} isCentered>
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

export default QuizCard;
