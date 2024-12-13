import { useEffect, useState } from "react";
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
  const [languageValue, setLanguageValue] = useState<string>("ENG");

  const handleSave = async () => {
    const formData = new URLSearchParams();
    formData.append("phrase", refs[0]?.value ?? "");
    formData.append("definition", refs[1]?.value ?? "");
    formData.append(
      "language_id",
      languages.find((lang) => lang.code === refs[2]?.value)?.id.toString() ??
        ""
    );
    formData.append("user_id", GetUserId().toString());
    formData.append("category_id", refs[5]?.value ?? "");
    if (languageValue != "POL") {
      formData.append("part_of_speech", refs[6]?.value ?? "");
      formData.append("difficulty_level_id", refs[4]?.value ?? "");
    } else {
      formData.append("photo", refs[3]?.value ?? "");
    }
    const response = await postData(formData);
    if (response.id != -1) return navigate("/dictionary");
  };

  const handleCancel = () => {
    return navigate("/dictionary");
  };

  const disableUnused = () => {
    switch (languageValue) {
      case "POL":
        if (refs[3] && refs[4] && refs[6]) {
          console.log("disable");
          refs[3].disabled = false;
          refs[4].disabled = true;
          refs[6].disabled = true;
        }
        break;
      default:
        if (refs[3] && refs[4] && refs[6]) {
          console.log("enable");
          refs[3].disabled = true;
          refs[4].disabled = false;
          refs[6].disabled = false;
        }
        break;
    }
  };

  useEffect(() => {
    if (languageValue) {
      console.log("languageValue", languageValue);
      disableUnused();
    }
  }, [languageValue]);

  useEffect(() => {
    if (
      refs[0] &&
      refs[1] &&
      refs[2] &&
      refs[3] &&
      refs[4] &&
      refs[5] &&
      refs[6]
    ) {
      disableUnused();
    }
  }, [refs]);

  const formData: FormData = {
    title: "Proszę wypełnić poniższy formularz",
    headers: [
      {
        inputName: "Brakująca fraza",
        inputType: "text",
        isRequired: true,
        maxLength: 250,
      },
      {
        inputName: "Definicja (max. 250 znaków)",
        inputType: "text",
        isRequired: true,
        maxLength: 250,
      },
      {
        inputName: "Język, w którym jest podana fraza",
        inputType: "select",
        isRequired: false,
        data:
          languages?.map((lang) => ({ id: lang.code, value: lang.code })) || [],
        onChange: (e) => setLanguageValue(e.target.value),
      },
      { inputName: "Zdjęcie", inputType: "text", isRequired: false },
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
        inputName: "Część mowy",
        inputType: "select",
        isRequired: false,
        data: usePartOfSpeech(),
        maxLength: 15,
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
