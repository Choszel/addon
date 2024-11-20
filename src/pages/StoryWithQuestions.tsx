import { useNavigate, useParams } from "react-router-dom";
import useStories from "../hooks/useStories";
import StoryAnswers from "../components/quizes/StoryAnswers";
import {
  Box,
  Text,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  useDisclosure,
  Button,
} from "@chakra-ui/react";
import TextTranslator from "../components/TextTranslator";
import { useState, useRef, useEffect } from "react";
import GoBack from "../components/GoBack";
import actionData from "../hooks/actionData";
import useQuizzesQuestions from "../hooks/useQuizzesQuestions";
import useTokenData from "../others/useTokenData";

const StoryWithQuestions = () => {
  const { id } = useParams();
  const { fetchStories, fetchStoriesQuestions } = useStories(
    parseInt(id ?? "")
  );
  const { data: story } = fetchStories();
  const { data: questions } = fetchStoriesQuestions();
  const [marked, setMarked] = useState<string>("");
  const popupRef = useRef<HTMLSpanElement | null>(null);
  const [checked, setChecked] = useState<boolean>(false);
  const navigate = useNavigate();
  const [correctAnswers, setCorrectAnswers] = useState<number[]>([]);
  const [correctCaptured, setCorrectCaptured] = useState<boolean>(false);
  const { GetUserId } = useTokenData();
  const [currentScore, setCurrentScore] = useState<number>(0);
  const { fetchUserQuestions, fetchUserScores } = useQuizzesQuestions();
  const { data: userScores } = fetchUserScores(GetUserId());
  const { data: userQuestions } = fetchUserQuestions(currentScore);
  const { postData: postUserQuestions } = actionData("/usersQuizzesQuestions");
  const { isOpen, onOpen, onClose } = useDisclosure();

  function getSelectionText() {
    let text = "";
    let position = { x: 0, y: 0 };

    if (window.getSelection) {
      const selection = window.getSelection();
      text = selection?.toString() ?? "";

      if (selection?.rangeCount) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();

        if (popupRef.current)
          position = {
            x: rect.left + window.scrollX,
            y: rect.top + window.scrollY,
          };
      }
    }

    if (text !== "") setMarked(text);

    if (popupRef.current) {
      popupRef.current.style.left = `${position.x - 10}px`;
      popupRef.current.style.top = `${position.y - 75}px`;
      popupRef.current.classList.toggle("show", !!text);
    }
  }

  const checkAnswers = () => {
    setChecked(true);
    setTimeout(() => {
      onOpen();
    }, 250);
  };

  useEffect(() => {
    if (!correctCaptured) return;
    if (correctAnswers.length < 1) return;

    setCorrectAnswers(
      correctAnswers.filter(
        (answer) =>
          !userQuestions.some((uq) => uq.users_quizzes_scores_id === answer)
      )
    );

    const formData = new URLSearchParams();
    formData.append("quiz_score_id", currentScore.toString());
    formData.append("data", JSON.stringify([...correctAnswers]));
    postUserQuestions(formData);
  }, [correctCaptured]);

  useEffect(() => {
    const currentScore = userScores.find(
      (score) => score.id == parseInt(id ?? "0")
    );
    setCurrentScore(currentScore?.quiz_score_id ?? 0);
  }, [userScores]);

  return (
    <div>
      <GoBack
        goBack={() => {
          navigate("/flashcards");
        }}
      ></GoBack>
      <Text whiteSpace="pre-line" onMouseUp={getSelectionText} marginTop="2%">
        {story[0]?.text}
      </Text>
      <TextTranslator text={marked} popupRef={popupRef}></TextTranslator>
      <br />
      <br />
      <Box
        display="flex"
        flexDirection="column"
        alignItems="start"
        textAlign="left"
      >
        {questions.map((question, index) => (
          <Box marginBottom="2%" key={question.id}>
            <p style={{ fontWeight: "600" }}>{question.question}</p>
            <StoryAnswers
              question_id={question?.id ?? 0}
              checked={checked}
              setCorrectAnswers={setCorrectAnswers}
              correctAnswers={correctAnswers}
              setCorrectCaptured={
                index == questions.length - 1 ? setCorrectCaptured : undefined
              }
            ></StoryAnswers>
          </Box>
        ))}
      </Box>
      <button style={{ margin: "3%" }} onClick={() => checkAnswers()}>
        Sprawdź odpowiedzi
      </button>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalBody className="basic_style">
            <p style={{ fontWeight: "bold", margin: "2% 0%" }}>
              Twój wynik to: {correctAnswers.length} / {questions.length}
            </p>
            <p>
              Gratulacje ukończonej historyjki! Powrót do listy zwrotów znajduje
              się na górze strony.
            </p>
          </ModalBody>
          <ModalFooter className="basic_style">
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              OK
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default StoryWithQuestions;
