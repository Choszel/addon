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

const NoTranslation = () => {
  const [refs, setRefs] = useState<
    (HTMLInputElement | HTMLSelectElement | null)[]
  >([]);
  const navigate = useNavigate();
  const routeName = "/missingPhrases";
  const { postData } = actionData(routeName);
  const { data: languages } = useLanguages();
  const { data: levels } = useDifficultyLevels();
  const { data: categories } = useCategories();
  const { GetUserId } = useTokenData();

  const handleSave = () => {
    console.log("Refs:", refs);
    console.log(refs[0]?.value);
    const formData = new URLSearchParams();
    formData.append("phrase", refs[0]?.value ?? "");
    formData.append("definition", refs[1]?.value ?? "");
    formData.append("languages_id", refs[2]?.value ?? "");
    formData.append("users_id", GetUserId().toString());
    formData.append("difficulty_level", refs[3]?.value ?? "");
    formData.append("category", refs[4]?.value ?? "");
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
    ],
    setRefs: function (): void {},
    onSave: handleSave,
    onCancel: handleCancel,
  };

  return <FormTemplate {...formData} setRefs={setRefs} />;
};

export default NoTranslation;
