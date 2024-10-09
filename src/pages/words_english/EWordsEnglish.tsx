import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import actionData from "../../hooks/actionData";
import FormTemplate, {
  FormData,
} from "../../components/crud_templates/CreateTemplate";
import useCategories from "../../hooks/useCategories";
import useWordsEnglish from "../../hooks/useWordsEnglish";
import useDifficultyLevels from "../../hooks/useDifficultyLevels";

const EWordsEnglish = () => {
  const { id } = useParams<{ id: string }>();
  const [refs, setRefs] = useState<
    (HTMLInputElement | HTMLSelectElement | null)[]
  >([]);
  const navigate = useNavigate();
  const routeName = "/wordsEnglish";
  const { putData } = actionData(routeName);

  const { data: categories, isLoading } = useCategories();
  const { data: difficultyLevels } = useDifficultyLevels();
  const { fetchAllDetailed } = useWordsEnglish(parseInt(id ?? "-1"));
  const { data } = fetchAllDetailed();

  const handleSave = () => {
    console.log("Refs:", refs);
    const formData = new URLSearchParams();
    formData.append("id", id || "");
    formData.append("word", refs[0]?.value ?? "");
    formData.append("definition", refs[1]?.value ?? "");
    formData.append("difficultylevel_id", refs[2]?.value ?? "");
    formData.append("categories_id", refs[3]?.value ?? "");
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

  if (isLoading) return <div>Ładowanie danych...</div>;

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
      },
      {
        inputName: "Category",
        inputType: "select",
        isRequired: false,
        data: categories?.map((cat) => ({ id: cat.id, value: cat.name })),
      },
      {
        inputName: "Part of speech",
        inputType: "select",
        isRequired: false,
        data: [
          { id: "noun", value: "noun" },
          { id: "verb", value: "verb" },
          { id: "adjective", value: "adjective" },
          { id: "adverb", value: "adverb" },
          { id: "pronoun", value: "pronoun" },
          { id: "article", value: "article" },
          { id: "preposition", value: "preposition" },
          { id: "conjunction", value: "conjunction" },
          { id: "numeral", value: "numeral" },
          { id: "other", value: "other" },
        ],
      },
    ],
    setRefs: function (): void {},
    onSave: handleSave,
    onCancel: handleCancel,
  };

  return <FormTemplate {...formData} setRefs={setRefs} />;
};

export default EWordsEnglish;
