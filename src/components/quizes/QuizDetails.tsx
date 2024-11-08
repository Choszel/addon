import {
  Button,
  Card,
  CardBody,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Spinner,
  useDisclosure,
  Text,
} from "@chakra-ui/react";
import { Quiz } from "../../hooks/useQuizzes";
import { QuizQuestion } from "../../hooks/useQuizzesQuestions";
import { Link, useNavigate } from "react-router-dom";
import actionData from "../../hooks/actionData";

interface Props {
  quiz: Quiz;
  userId?: number;
  questions: QuizQuestion[];
  isLoading: boolean;
  error: string;
  categories: string[];
  difficultyLevels: string[];
}

const QuizDetails = ({
  quiz,
  userId,
  questions,
  isLoading,
  error,
  categories,
  difficultyLevels,
}: Props) => {
  console.log(quiz);
  console.log(questions);
  const { postData, deleteData } = actionData("/usersQuizzesScores");
  const {
    isOpen: deleteIsOpen,
    onOpen: deleteOnOpen,
    onClose: deleteOnClose,
  } = useDisclosure();
  const navigate = useNavigate();
  const { putData } = actionData("/quizzes/raisePopularity");

  const addToUserQuizzes = async () => {
    const formData = new URLSearchParams();
    formData.append("users_id", (userId ?? 0).toString());
    formData.append("quizzes_id", (quiz.id ?? 0).toString());
    const response = await postData(formData);
    console.log(response.message);
    if (response.message == "Rozpoczęto nowy quiz") {
      const formPutData = new URLSearchParams();
      formPutData.append("id", (quiz.id ?? 0).toString());
      putData(formPutData);
    }
  };

  const deleteProgress = () => {
    const formData = new URLSearchParams();
    formData.append("users_id", (userId ?? 0).toString());
    formData.append("quizzes_id", (quiz.id ?? 0).toString());
    deleteData(formData);
    window.location.reload();
  };

  return (
    <>
      <h1>Szczegóły</h1>
      <p>{quiz?.title}</p>
      <p
        style={{ cursor: "pointer" }}
        onClick={() => navigate("/user/details/" + quiz.user)}
      >
        Twórca: {quiz.user ?? "No user"}
      </p>
      <p>Język: {quiz.language ?? "No language"}</p>
      <HStack>
        <p>Kategria: </p>
        {categories.length > 3 ? (
          <HStack>
            <button className="tag_category">
              {categories[0] ?? "No category"}
            </button>
            <button className="tag_category">
              {categories[1] ?? "No category"}
            </button>
            <button className="tag_category">others</button>
          </HStack>
        ) : categories.length == 0 ? (
          <button className="tag_error">X</button>
        ) : (
          categories.map((cat) => (
            <button className="tag_category">{cat ?? "No category"}</button>
          ))
        )}
      </HStack>
      <HStack>
        <p>Poziom: </p>
        {difficultyLevels.length > 4 ? (
          <button className="tag_infinity">∞</button>
        ) : difficultyLevels.length == 0 ? (
          <button className="tag_error">X</button>
        ) : (
          difficultyLevels.map((dl) => (
            <button className="tag_category">{dl ?? "No level"}</button>
          ))
        )}
      </HStack>
      <p>Data stworzenia {quiz.execution_date?.toString().substring(0, 10)}</p>
      <button className="button_primary" onClick={deleteOnOpen}>
        Usuń postępy
      </button>

      <h1 style={{ marginTop: "4%" }}>Zagraj</h1>
      <>
        <HStack>
          <Link
            to={"/quiz/flashcardGame/" + quiz.id}
            className="game_type"
            onClick={addToUserQuizzes}
          >
            <p>Fiszki</p>
          </Link>
          <Link
            to={"/quiz/matchGame/" + quiz.id}
            className="game_type"
            onClick={addToUserQuizzes}
          >
            <p>Dopasowanie</p>
          </Link>
          <Link
            to={"/quiz/testGame/" + quiz.id}
            className="game_type"
            onClick={addToUserQuizzes}
          >
            <p>Test</p>
          </Link>
        </HStack>
        <h1 style={{ marginTop: "4%" }}>Lista zwrotów</h1>
        {isLoading && <Spinner size="xl" />}
        {error && <Text color="var(--error)">{error}</Text>}
        {questions.map((question) => (
          <HStack margin="3% 3%">
            <Card
              bg={
                userId
                  ? question.done
                    ? "var(--success)"
                    : "var(--error)"
                  : ""
              }
              color={
                userId
                  ? question.done
                    ? "var(--success-content)"
                    : "var(--error-content)"
                  : ""
              }
              w="100%"
              height="150px"
            >
              <CardBody
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <p>{question.word_polish}</p>
              </CardBody>
            </Card>
            <Card
              bg={
                userId
                  ? question.done
                    ? "var(--success)"
                    : "var(--error)"
                  : ""
              }
              color={
                userId
                  ? question.done
                    ? "var(--success-content)"
                    : "var(--error-content)"
                  : ""
              }
              w="100%"
              height="150px"
            >
              <CardBody
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <p>{question.word_second}</p>
              </CardBody>
            </Card>
          </HStack>
        ))}
      </>

      <Modal isOpen={deleteIsOpen} onClose={deleteOnClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody className="basic_style">
            <p>Czy na pewno chcesz usunąć dane tego quizu?</p>
            <p style={{ fontWeight: "bold" }}>
              UWAGA! Spowoduje to usunięcie wszytskich danych powiązanych z tym
              quizem!
            </p>
          </ModalBody>
          <ModalFooter className="basic_style">
            <Button colorScheme="red" mr={3} onClick={deleteProgress}>
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

export default QuizDetails;
