import { useState } from "react";
import { useNavigate } from "react-router-dom";
import actionData from "../../hooks/actionData";
import FormTemplate, {
  FormData,
} from "../../components/crud_templates/CreateTemplate";
import useLanguages from "../../hooks/useLanguages";
import useCategories from "../../hooks/useCategories";
import useDifficultyLevels from "../../hooks/useDifficultyLevels";
import useTokenData from "../../others/useTokenData";
import { Spinner, Text } from "@chakra-ui/react";
import usePartOfSpeech from "../../hooks/usePartOfSpeech";

const NoTranslation = () => {
  const [refs, setRefs] = useState<
    (HTMLInputElement | HTMLSelectElement | null)[]
  >([]);
  const navigate = useNavigate();
  const routeName = "/missingPhrases";
  const { postData } = actionData(routeName);
  const {
    data: languages,
    isLoading: langIsLoading,
    error: langError,
  } = useLanguages();
  const {
    data: levels,
    isLoading: levelsAreLoading,
    error: levelsError,
  } = useDifficultyLevels();
  const {
    data: categories,
    isLoading: catIsLoading,
    error: catError,
  } = useCategories();
  const { GetUserId } = useTokenData();

  const handleSave = () => {
    const formData = new URLSearchParams();
    formData.append("phrase", refs[0]?.value ?? "");
    formData.append("definition", refs[1]?.value ?? "");
    formData.append("language_id", refs[2]?.value ?? "");
    formData.append("user_id", GetUserId().toString());
    formData.append("difficulty_level_id", refs[3]?.value ?? "");
    formData.append("category_id", refs[4]?.value ?? "");
    formData.append("part_of_speech", refs[5]?.value ?? "");
    postData(formData);
    return navigate("/dictionary");
  };

  const handleCancel = () => {
    return navigate("/dictionary");
  };

  const formData: FormData = {
    title: "Proszę wypełnić poniższy formularz",
    headers: [
      { inputName: "Brakująca fraza", inputType: "text", isRequired: true },
      {
        inputName: "Definicja (max. 250 znaków)",
        inputType: "text",
        isRequired: true,
      },
      {
        inputName: "Język, w którym jest podana fraza",
        inputType: "select",
        isRequired: false,
        data:
          languages?.map((lang) => ({ id: lang.id, value: lang.code })) || [],
      },
      {
        inputName: "Poziom trudności",
        inputType: "select",
        isRequired: false,
        data: levels?.map((level) => ({ id: level.id, value: level.level })),
      },
      {
        inputName: "Kategoria",
        inputType: "select",
        isRequired: false,
        data: categories?.map((cat) => ({ id: cat.id, value: cat.name })),
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

  if (langIsLoading || levelsAreLoading || catIsLoading) return <Spinner />;
  if (langError || levelsError || catError)
    return (
      <Text color="var(--error)">{langError || levelsError || catError}</Text>
    );

  return <FormTemplate {...formData} setRefs={setRefs} />;
};

export default NoTranslation;
