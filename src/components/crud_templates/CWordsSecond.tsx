import { useState } from "react";
import { Translation } from "../../pages/words_polish/CWordsPolish";
import { useNavigate } from "react-router-dom";
import actionData from "../../hooks/actionData";
import useCategories from "../../hooks/useCategories";
import useDifficultyLevels from "../../hooks/useDifficultyLevels";
import usePartOfSpeech from "../../hooks/usePartOfSpeech";
import AddTranslationButton from "../../components/dictionary/AddTranslationButton";
import FormTemplate, {
  FormData,
} from "../../components/crud_templates/CreateTemplate";

interface Props {
  routeName: string;
  code: string;
  titlePart: string;
}

const CWordsSecond = ({ routeName, code, titlePart }: Props) => {
  const [refs, setRefs] = useState<
    (HTMLInputElement | HTMLSelectElement | null)[]
  >([]);
  const [translationsData, setTranslationsData] = useState<Translation[]>();
  const navigate = useNavigate();
  const { postData } = actionData("/wordsSecond");
  const { postData: postTranslations } = actionData("/translationPOL_");
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
    formData.append("language", code);
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
            translation.append("language", code);
            translation.append("word_polish_id", element.id?.toString() ?? "");
            translation.append(
              "word_second_id",
              (response.id ?? -1).toString()
            );
            postTranslations(translation);
            break;
        }
      });

      if (response.id != -1) return navigate(routeName);
    } else {
      console.error("Błąd: Nie udało się uzyskać ID nowo dodanego słowa");
    }
  };

  const handleCancel = () => {
    return navigate(routeName);
  };

  const formData: FormData = {
    title: "Dodawanie " + titlePart + " Frazy",
    headers: [
      {
        inputName: "Fraza",
        inputType: "text",
        isRequired: true,
        maxLength: 50,
      },
      {
        inputName: "Definicja",
        inputType: "text",
        isRequired: true,
        maxLength: 200,
      },
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

export default CWordsSecond;
