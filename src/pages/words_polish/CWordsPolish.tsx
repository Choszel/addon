import { useState } from "react";
import { useNavigate } from "react-router-dom";
import actionData from "../../hooks/actionData";
import FormTemplate, {
  FormData,
} from "../../components/crud_templates/CreateTemplate";
import useCategories from "../../hooks/useCategories";
import AddTranslationButton from "../../components/dictionary/AddTranslationButton";

export interface Translation {
  id: number | undefined;
  word: string | undefined;
  language: string | undefined;
}

const CWordsPolish = () => {
  const [refs, setRefs] = useState<
    (HTMLInputElement | HTMLSelectElement | null)[]
  >([]);
  const [translationsData, setTranslationsData] = useState<Translation[]>();
  const navigate = useNavigate();
  const routeName = "/wordsPolish";
  const { postData } = actionData(routeName);
  const { postData: postTranslations } = actionData("/translationPLN_");
  const {
    data: categories,
    isLoading: catIsLoading,
    error: catError,
  } = useCategories();

  const handleSave = async () => {
    const formData = new URLSearchParams();
    formData.append("word", refs[0]?.value ?? "");
    formData.append("definition", refs[1]?.value ?? "");
    formData.append("category_id", refs[2]?.value ?? "");
    formData.append("photo", refs[3]?.value ?? "");

    const response = await postData(formData);
    if (response?.id) {
      translationsData?.forEach((element) => {
        const translation = new URLSearchParams();
        translation.append("language", element.language ?? "");
        translation.append("word_polish_id", (response.id ?? -1).toString());
        translation.append("word_second_id", element.id?.toString() ?? "");
        postTranslations(translation);
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
    title: "Dodawanie Polskiej Frazy",
    headers: [
      { inputName: "Fraza", inputType: "text", isRequired: true },
      { inputName: "Definicja", inputType: "text", isRequired: true },
      {
        inputName: "Kategoria",
        inputType: "select",
        isRequired: false,
        data: categories?.map((cat) => ({ id: cat.id, value: cat.name })),
        isLoading: catIsLoading,
        error: catError,
      },
      { inputName: "Zdjęcie", inputType: "text", isRequired: false },
    ],
    setRefs: function (): void {},
    onSave: handleSave,
    onCancel: handleCancel,
    others: (
      <AddTranslationButton
        langugeOption
        setTranslationsData={setTranslationsData}
      />
    ),
  };

  return (
    <div>
      <FormTemplate {...formData} setRefs={setRefs} />
    </div>
  );
};

export default CWordsPolish;
