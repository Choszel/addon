import useStories from "../../hooks/useStories";

interface Props {
  question_id: number;
}

const StoryAnswers = ({ question_id }: Props) => {
  const { fetchStoriesAnswers } = useStories();
  const { data: answers } = fetchStoriesAnswers(question_id);

  return (
    <div style={{ marginLeft: "3%" }}>
      {answers.map((answear, index) => (
        <p>
          {index + 1}. {answear.answear}
        </p>
      ))}
    </div>
  );
};

export default StoryAnswers;
