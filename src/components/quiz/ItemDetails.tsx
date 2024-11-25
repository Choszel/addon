import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Spinner,
  useDisclosure,
  Text,
  Stack,
} from "@chakra-ui/react";
import { Quiz } from "../../hooks/useQuizzes";
import { Link, useNavigate } from "react-router-dom";
import actionData from "../../hooks/actionData";
import { ReactNode } from "react";

interface Props {
  quiz: Quiz;
  userId?: number;
  isLoading: boolean;
  error: string;
  moreDetails?: ReactNode;
  games: { path: string; title: string }[];
  questionsNode: ReactNode;
}

const ItemDetails = ({
  quiz,
  userId,
  isLoading,
  error,
  moreDetails,
  games,
  questionsNode,
}: Props) => {
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
      <p style={{ marginBottom: "2%" }}>{quiz?.title}</p>
      <p
        style={{ cursor: "pointer", marginBottom: "2%" }}
        onClick={() => navigate("/user/details/" + quiz.user)}
      >
        Twórca: {quiz.user ?? "No user"}
      </p>
      <p style={{ marginBottom: "2%" }}>
        Język: {quiz.language ?? "No language"}
      </p>
      {moreDetails}
      <p>Data stworzenia {quiz.execution_date?.toString().substring(0, 10)}</p>
      <button className="button_primary" onClick={deleteOnOpen}>
        Usuń postępy
      </button>

      <h1 style={{ marginTop: "4%" }}>Zagraj</h1>

      <Stack
        direction={{ base: "column", md: "row" }}
        justify="center"
        align="center"
      >
        {games.map((game) => (
          <Link
            to={game.path + quiz.language + "/" + quiz.id}
            className="game_type"
            onClick={addToUserQuizzes}
            key={game.path}
          >
            {game.title}
          </Link>
        ))}
      </Stack>

      <h1 style={{ marginTop: "4%" }}>
        {quiz.type == "quiz" ? "Lista zwrotów" : "Lista pytań"}
      </h1>
      {isLoading && <Spinner size="xl" />}
      {error && <Text color="var(--error)">{error}</Text>}
      {questionsNode}

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

export default ItemDetails;
