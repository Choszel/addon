import { useState } from "react";
import { useNavigate } from "react-router-dom";
import actionData from "../../hooks/actionData";
import FormTemplate, {
  FormData,
} from "../../components/crud_templates/CreateTemplate";
import useCategories from "../../hooks/useCategories";
import AddTranslationButton from "../../components/dictionary/AddTranslationButton";
import { Translation } from "../words_polish/CWordsPolish";
import useDifficultyLevels from "../../hooks/useDifficultyLevels";

const CWordsEnglish = () => {
  const [refs, setRefs] = useState<
    (HTMLInputElement | HTMLSelectElement | null)[]
  >([]);
  const [translationsData, setTranslationsData] = useState<Translation[]>();
  const navigate = useNavigate();
  const routeName = "/wordsEnglish";
  const { postData } = actionData(routeName);
  const { postData: postTranslations } = actionData("/translationPLNENG");
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

  const handleSave = async () => {
    console.log("Refs:", refs);
    console.log("translationData:", translationsData);

    const formData = new URLSearchParams();
    formData.append("word", refs[0]?.value ?? "");
    formData.append("definition", refs[1]?.value ?? "");
    formData.append("difficultylevel_id", refs[2]?.value ?? "");
    formData.append("categories_id", refs[3]?.value ?? "");
    formData.append("part_of_speech", refs[4]?.value ?? "");
    console.log(formData);

    const response = await postData(formData);
    if (response?.id) {
      console.log("Po dodaniu słowa", response.id);

      translationsData?.forEach((element) => {
        const translation = new URLSearchParams();
        switch (element.language) {
          default:
            translation.append("words_polish_id", element.id?.toString() ?? "");
            translation.append(
              "words_english_id",
              (response.id ?? -1).toString()
            );
            postTranslations(translation);
            break;
        }
        console.log("Po dodaniu tłumaczenia");
      });

      return navigate(routeName);
    } else {
      console.error("Błąd: Nie udało się uzyskać ID nowo dodanego słowa");
    }
  };

  const handleCancel = () => {
    return navigate(routeName);
  };

  const formData: FormData = {
    title: "Dodawanie Angielskiej Frazy",
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
    others: <AddTranslationButton setTranslationsData={setTranslationsData} />,
  };

  return (
    <div>
      <FormTemplate {...formData} setRefs={setRefs} />
    </div>
  );
};

export default CWordsEnglish;
