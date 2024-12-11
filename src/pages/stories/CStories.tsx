import { useState } from "react";
import FormTemplate, {
  FormData,
} from "../../components/crud_templates/CreateTemplate";
import actionData from "../../hooks/actionData";
import useLanguages from "../../hooks/useLanguages";
import { useNavigate } from "react-router-dom";
import useTokenData from "../../others/useTokenData";
import { useToast } from "@chakra-ui/react";
import AddStoryQuestionButton from "../../components/quiz/AddStoryQuestionButton";

interface Answear {
  id: number;
  answear: string;
  correct: boolean;
}

export interface CStoryQuestion {
  id: number;
  question?: string;
  answers?: Answear[];
}

const CStories = () => {
  const [refs, setRefs] = useState<
    (HTMLInputElement | HTMLSelectElement | null)[]
  >([]);
  const { data: languages } = useLanguages();
  const [selectedLanguage, setSelectedLanguage] = useState<string>("ENG");
  const { postData: postQuiz } = actionData("/quizzes");
  const { postData: postStory } = actionData("/stories");
  const { postData: postStoryQuestions } = actionData(
    "/storiesQuestionsAndAnswers"
  );
  const navigate = useNavigate();
  const { GetUserId } = useTokenData();
  const [questions, setQuestions] = useState<CStoryQuestion[]>([]);
  const toast = useToast();

  const handleSave = async () => {
    if (questions.length < 2) {
      toast({
        title: "Minimalna wymagana ilość pytań wynosi 2.",
        status: "error",
        position: "bottom-right",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const formData = new URLSearchParams();
    formData.append("title", refs[0]?.value ?? "");
    formData.append("user_id", GetUserId().toString());
    formData.append(
      "language_id",
      (
        languages.find((lang) => lang.code == selectedLanguage)?.id ?? -1
      )?.toString()
    );
    const dateNow = new Date().toJSON().substring(0, 10);
    formData.append("execution_date", dateNow.toString());
    formData.append("type", "story");
    const response = await postQuiz(formData);

    if (response) {
      const storyData = new URLSearchParams();
      storyData.append("quiz_id", (response.id ?? 0).toString());
      storyData.append("text", refs[2]?.value ?? "");
      postStory(storyData);

      const questionData = new URLSearchParams();
      questionData.append("quiz_id", (response.id ?? 0).toString());
      questionData.append("data", JSON.stringify([...questions]));
      postStoryQuestions(questionData);

      return navigate("/stories");
    }
  };

  const handleCancel = () => {
    return navigate("/stories");
  };

  const formData: FormData = {
    title: "Dodawanie Historii",
    headers: [
      { inputName: "Tytuł", inputType: "text", isRequired: true },
      {
        inputName: "Język",
        inputType: "select",
        isRequired: false,
        data:
          languages
            ?.map((lang) => ({ id: lang.code, value: lang.code }))
            .filter((lang) => lang.value != "PLN") || [],
        onChange: (e) => setSelectedLanguage(e.target.value),
      },
      { inputName: "Treść", inputType: "text", isRequired: true },
    ],
    setRefs: function (): void {},
    onSave: handleSave,
    onCancel: handleCancel,
    others: (
      <AddStoryQuestionButton
        questions={questions}
        setQuestions={setQuestions}
      />
    ),
  };

  return <FormTemplate {...formData} setRefs={setRefs} />;
};

export default CStories;
