import { useParams } from "react-router-dom";
import useStories from "../hooks/useStories";
import StoryAnswers from "../components/quizes/StoryAnswers";
import { Box, Text } from "@chakra-ui/react";

const StoryWithQuestions = () => {
  const { id } = useParams();
  const { fetchStories, fetchStoriesQuestions } = useStories(
    parseInt(id ?? "")
  );
  const { data: story } = fetchStories();
  const { data: questions } = fetchStoriesQuestions();
  return (
    <>
      <Text whiteSpace="pre-line">{story[0]?.text}</Text>
      <br />
      <br />
      <br />
      <Box
        display="flex"
        flexDirection="column"
        alignItems="start"
        textAlign="left"
      >
        {questions.map((question) => (
          <Box marginBottom="2%">
            <p style={{ fontWeight: "600" }}>{question.question}</p>
            <StoryAnswers question_id={question?.id ?? 0}></StoryAnswers>
          </Box>
        ))}
      </Box>
      <button style={{ margin: "3%" }}>Sprawdź odpowiedzi</button>
    </>
  );
};

export default StoryWithQuestions;
