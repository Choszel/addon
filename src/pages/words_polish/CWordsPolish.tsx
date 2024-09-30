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
  const { postData: postTranslations } = actionData("/translationPLNENG");
  const { data: categories, isLoading } = useCategories();

  const handleSave = async () => {
    console.log("Refs:", refs);
    console.log("translationData:", translationsData);

    const formData = new URLSearchParams();
    formData.append("word", refs[0]?.value ?? "");
    formData.append("definition", refs[1]?.value ?? "");
    formData.append("categories_id", refs[2]?.value ?? "");
    formData.append("photo", refs[3]?.value ?? "");
    console.log(formData);

    const response = await postData(formData);
    if (response?.id) {
      console.log("Po dodaniu słowa", response.id);

      translationsData?.forEach((element) => {
        const translation = new URLSearchParams();
        switch (element.language) {
          default:
            translation.append(
              "words_polish_id",
              (response.id ?? -1).toString()
            );
            translation.append(
              "words_english_id",
              element.id?.toString() ?? ""
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

  if (isLoading) return <div>Ładowanie danych...</div>;

  const formData: FormData = {
    title: "Dodawanie Polskiej Frazy",
    headers: [
      { inputName: "Word", inputType: "text", isRequired: true },
      { inputName: "Definition", inputType: "text", isRequired: true },
      {
        inputName: "Category",
        inputType: "select",
        isRequired: false,
        data: categories?.map((cat) => ({ id: cat.id, value: cat.name })),
      },
      { inputName: "Photo", inputType: "text", isRequired: false },
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
