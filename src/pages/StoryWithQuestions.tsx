import { useNavigate, useParams } from "react-router-dom";
import useStories from "../hooks/useStories";
import StoryAnswers from "../components/quizes/StoryAnswers";
import { Box, Text } from "@chakra-ui/react";
import TextTranslator from "../components/TextTranslator";
import { useState, useRef } from "react";
import GoBack from "../components/GoBack";

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

  function getSelectionText(e: React.MouseEvent) {
    console.log("getSelectionText");
    const y = Math.floor(e.nativeEvent.offsetY);
    let text = "";
    let position = { x: 0, y: 0 };

    if (window.getSelection) {
      const selection = window.getSelection();
      text = selection?.toString() ?? "";

      if (selection?.rangeCount) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        console.log(rect.top);
        console.log(y);

        position = {
          x: rect.left + window.scrollX,
          y: y + 190,
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

  return (
    <div>
      <GoBack
        goBack={() => {
          navigate("/flashcards");
        }}
      ></GoBack>
      <Text
        whiteSpace="pre-line"
        onMouseUp={(e) => getSelectionText(e)}
        marginTop="2%"
      >
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
        {questions.map((question) => (
          <Box marginBottom="2%" key={question.id}>
            <p style={{ fontWeight: "600" }}>{question.question}</p>
            <StoryAnswers
              question_id={question?.id ?? 0}
              checked={checked}
            ></StoryAnswers>
          </Box>
        ))}
      </Box>
      <button style={{ margin: "3%" }} onClick={() => setChecked(true)}>
        Sprawdź odpowiedzi
      </button>
    </div>
  );
};

export default StoryWithQuestions;
