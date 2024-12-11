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
import usePartOfSpeech from "../../hooks/usePartOfSpeech";

const CWordsEnglish = () => {
  const [refs, setRefs] = useState<
    (HTMLInputElement | HTMLSelectElement | null)[]
  >([]);
  const [translationsData, setTranslationsData] = useState<Translation[]>();
  const navigate = useNavigate();
  const routeName = "/wordsEnglish";
  const { postData } = actionData(routeName);
  const { postData: postTranslations } = actionData("/translationPLN_");
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
    const formData = new URLSearchParams();
    formData.append("word", refs[0]?.value ?? "");
    formData.append("definition", refs[1]?.value ?? "");
    formData.append("difficulty_level_id", refs[2]?.value ?? "");
    formData.append("category_id", refs[3]?.value ?? "");
    formData.append("part_of_speech", refs[4]?.value ?? "");

    const response = await postData(formData);
    if (response?.id) {
      translationsData?.forEach((element) => {
        const translation = new URLSearchParams();
        switch (element.language) {
          default:
            translation.append("language", "ENG");
            translation.append("word_polish_id", element.id?.toString() ?? "");
            translation.append(
              "word_second_id",
              (response.id ?? -1).toString()
            );
            postTranslations(translation);
            break;
        }
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
      { inputName: "Fraza", inputType: "text", isRequired: true },
      { inputName: "Definicja", inputType: "text", isRequired: true },
      {
        inputName: "Poziom trudności",
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
        inputName: "Kategoria",
        inputType: "select",
        isRequired: false,
        data: categories?.map((cat) => ({ id: cat.id, value: cat.name })),
        isLoading: catIsLoading,
        error: catError,
      },
      {
        inputName: "Część mowy",
        inputType: "select",
        isRequired: false,
        data: usePartOfSpeech(),
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
