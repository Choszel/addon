import { useEffect, useRef, useState } from "react";
import useStories, { StoryAnswear } from "../../hooks/useStories";
import { Box } from "@chakra-ui/react";

interface Props {
  question_id: number;
  checked: boolean;
}

const StoryAnswers = ({ question_id, checked }: Props) => {
  const [shuffledNumbers, setShuffledNumbers] = useState<number[]>([]);
  const { fetchStoriesAnswers } = useStories();
  const { data: answers } = fetchStoriesAnswers(question_id);
  const [selectedValue, setSelectedValue] = useState<StoryAnswear | null>(null);
  const correctAnswear = useRef<HTMLLabelElement | null>(null);

  const shuffle = () => {
    const numbers = Array.from({ length: answers.length }, (_, i) => i);

    for (let i = numbers.length - 1; i > 0; i--) {
      const randomIndex = Math.floor(Math.random() * (i + 1));
      [numbers[i], numbers[randomIndex]] = [numbers[randomIndex], numbers[i]];
    }
    setShuffledNumbers(numbers);
  };

  useEffect(() => {
    shuffle();
  }, [answers]);

  useEffect(() => {
    if (checked) {
      console.log("Wybrana odpowiedź:", selectedValue);
      if (correctAnswear.current) {
        correctAnswear.current.style.backgroundColor = "var(--success)";
        correctAnswear.current.style.color = "var(--success-content)";
      }
    }
  }, [checked]);

  return (
    <Box marginX="3%">
      {shuffledNumbers.map((number, index) => (
        <div key={answers[number]?.id} style={{ marginBottom: "2%" }}>
          <input
            type="radio"
            id={`answer-${answers[number]?.id}`}
            name={question_id.toString()}
            value={answers[number]?.answear ?? ""}
            className="hidden_radio"
            onChange={() => {
              if (!checked) setSelectedValue(answers[number]);
            }}
            disabled={checked}
          />
          <label
            htmlFor={`answer-${answers[number]?.id}`}
            className="hidden_radio_label"
            ref={answers[number]?.correct ? correctAnswear : null}
          >
            {index + 1}. {answers[number]?.answear}
          </label>
        </div>
      ))}
    </Box>
  );
};

export default StoryAnswers;
