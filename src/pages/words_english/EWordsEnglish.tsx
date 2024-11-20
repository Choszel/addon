import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import actionData from "../../hooks/actionData";
import FormTemplate, {
  FormData,
} from "../../components/crud_templates/CreateTemplate";
import useCategories from "../../hooks/useCategories";
import useWordsEnglish from "../../hooks/useWordsEnglish";
import useDifficultyLevels from "../../hooks/useDifficultyLevels";
import { Spinner, Text } from "@chakra-ui/react";
import usePartOfSpeech from "../../hooks/usePartOfSpeech";

const EWordsEnglish = () => {
  const { id } = useParams<{ id: string }>();
  const [refs, setRefs] = useState<
    (HTMLInputElement | HTMLSelectElement | null)[]
  >([]);
  const navigate = useNavigate();
  const routeName = "/wordsEnglish";
  const { putData } = actionData(routeName);

  const {
    data: categories,
    isLoading: catIsLoading,
    error: catError,
  } = useCategories();
  const {
    data: difficultyLevels,
    isLoading: diffIsLoading,
    error: diffError,
  } = useDifficultyLevels();
  const { fetchAllDetailed } = useWordsEnglish(parseInt(id ?? "-1"));
  const { data, isLoading, error } = fetchAllDetailed();

  const handleSave = () => {
    console.log("Refs:", refs);
    const formData = new URLSearchParams();
    formData.append("id", id || "");
    formData.append("word", refs[0]?.value ?? "");
    formData.append("definition", refs[1]?.value ?? "");
    formData.append("difficulty_level_id", refs[2]?.value ?? "");
    formData.append("category_id", refs[3]?.value ?? "");
    formData.append("part_of_speech", refs[4]?.value ?? "");
    putData(formData);
    return navigate(routeName);
  };

  const handleCancel = () => {
    return navigate(routeName);
  };

  useEffect(() => {
    if (data && refs[0] && refs[1]) {
      refs[0].value = data[0].word;
      refs[1].value = data[0].definition;
    }
  }, [data, refs]);

  if (isLoading) return <Spinner size="xl" />;
  if (error) return <Text color="var(--error)">{error}</Text>;

  const formData: FormData = {
    title: "Edytowanie Angielskiej Frazy",
    headers: [
      { inputName: "Word", inputType: "text", isRequired: true },
      { inputName: "Definition", inputType: "text", isRequired: true },
      {
        inputName: "Difficulty Level",
        inputType: "select",
        isRequired: false,
        data: difficultyLevels?.map((cat) => ({
          id: cat.id,
          value: cat.level,
        })),
        isLoading: diffIsLoading,
        error: diffError,
      },
      {
        inputName: "Category",
        inputType: "select",
        isRequired: false,
        data: categories?.map((cat) => ({ id: cat.id, value: cat.name })),
        isLoading: catIsLoading,
        error: catError,
      },
      {
        inputName: "Part of speech",
        inputType: "select",
        isRequired: false,
        data: usePartOfSpeech(),
      },
    ],
    setRefs: function (): void {},
    onSave: handleSave,
    onCancel: handleCancel,
  };

  return <FormTemplate {...formData} setRefs={setRefs} />;
};

export default EWordsEnglish;
