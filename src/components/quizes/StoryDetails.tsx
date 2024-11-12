import {
  Button,
  Card,
  CardBody,
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
import { Link, useNavigate } from "react-router-dom";
import actionData from "../../hooks/actionData";
import { StoryQuestion } from "../../hooks/useStories";

interface Props {
  quiz: Quiz;
  userId?: number;
  questions: StoryQuestion[];
  isLoading: boolean;
  error: string;
}

const StoryDetails = ({ quiz, userId, questions, isLoading, error }: Props) => {
  console.log(quiz);
  console.log(questions);
  const { postData, deleteData } = actionData("/usersQuizzesScores");
  const { putData } = actionData("/quizzes/raisePopularity");
  const {
    isOpen: deleteIsOpen,
    onOpen: deleteOnOpen,
    onClose: deleteOnClose,
  } = useDisclosure();
  const navigate = useNavigate();

  const addToUserQuizzes = async () => {
    const formData = new URLSearchParams();
    formData.append("user_id", (userId ?? 0).toString());
    formData.append("quiz_id", (quiz.id ?? 0).toString());
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
    formData.append("user_id", (userId ?? 0).toString());
    formData.append("quiz_id", (quiz.id ?? 0).toString());
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
      <p>Data stworzenia {quiz.execution_date?.toString().substring(0, 10)}</p>
      <button className="button_primary" onClick={deleteOnOpen}>
        Usuń postępy
      </button>

      <h1 style={{ marginTop: "4%" }}>Zagraj</h1>

      <>
        <Link
          to={"/quiz/story/" + quiz.id}
          className="game_type"
          onClick={addToUserQuizzes}
          style={{ justifySelf: "center" }}
        >
          <p>Tekst oraz quiz</p>
        </Link>
        <h1 style={{ marginTop: "4%" }}>Lista pytań</h1>
        {isLoading && <Spinner size="xl" />}
        {error && <Text color="var(--error)">{error}</Text>}
        {questions.map((question) => (
          <Card
            bg={
              userId ? (question.done ? "var(--success)" : "var(--error)") : ""
            }
            color={
              userId
                ? question.done
                  ? "var(--success-content)"
                  : "var(--error-content)"
                : ""
            }
            w="100%"
            height="auto"
            marginY={{ base: "5%", md: "2%" }}
          >
            <CardBody
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <p>{question?.question}</p>
            </CardBody>
          </Card>
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
export default StoryDetails;
