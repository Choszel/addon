import { useNavigate, useParams } from "react-router-dom";
import useMissingPhrases from "../../hooks/useMissingPhrases";
import FormTemplate, {
  FormData,
} from "../../components/crud_templates/CreateTemplate";
import { useEffect, useState } from "react";
import useCategories from "../../hooks/useCategories";
import useDifficultyLevels from "../../hooks/useDifficultyLevels";
import useLanguages from "../../hooks/useLanguages";
import AddTranslationButton from "../../components/dictionary/AddTranslationButton";
import { Translation } from "../words_polish/CWordsPolish";
import actionData from "../../hooks/actionData";

const DetailsMissingPhrases = () => {
  const { id } = useParams<{ id: string }>();
  const { data } = useMissingPhrases(parseInt(id ?? "0"));
  const { data: categories } = useCategories();
  const { data: difficultyLevels } = useDifficultyLevels();
  const { data: languages } = useLanguages();
  const routeName = "/missingPhrases";
  const { postData } = actionData("/wordsEnglish");
  const { deleteData } = actionData(routeName);
  const { postData: postTranslations } = actionData("/translationPLNENG");
  const [refs, setRefs] = useState<
    (HTMLInputElement | HTMLSelectElement | null)[]
  >([]);
  const [translationsData, setTranslationsData] = useState<Translation[]>();
  const navigate = useNavigate();

  const handleSave = async () => {
    console.log("Refs:", refs);
    console.log("translationData:", translationsData);

    const formData = new URLSearchParams();
    formData.append("word", refs[0]?.value ?? "");
    formData.append("definition", refs[1]?.value ?? "");
    formData.append("difficultylevel_id", refs[3]?.value ?? "");
    formData.append("categories_id", refs[4]?.value ?? "");
    formData.append("part_of_speech", refs[5]?.value ?? "");
    console.log(formData);

    const response = await postData(formData);
    if (response?.id) {
      console.log("Po dodaniu słowa", response.id);

      translationsData?.forEach((element) => {
        const translation = new URLSearchParams();
        translation.append("words_polish_id", element.id?.toString() ?? "");
        translation.append("words_english_id", (response.id ?? -1).toString());
        postTranslations(translation);
        console.log("Po dodaniu tłumaczenia");
      });

      const formData = new URLSearchParams();
      formData.append("id", data[0].id.toString());
      deleteData(formData);
      return navigate(routeName);
    } else {
      console.error("Błąd: Nie udało się uzyskać ID nowo dodanego słowa");
    }
  };

  useEffect(() => {
    if (
      data &&
      refs[0] &&
      refs[1] &&
      refs[2] &&
      refs[3] &&
      refs[4] &&
      refs[5]
    ) {
      refs[0].value = data[0]?.phrase;
      refs[1].value = data[0]?.definition;
      refs[2].value =
        (
          languages.find((lan) => lan.code == data[0].code)?.id ?? 1
        ).toString() ?? "";
      refs[3].value =
        (
          difficultyLevels.find((dif) => dif.level == data[0].level)?.id ?? 1
        ).toString() ?? "";
      refs[4].value =
        (
          categories.find((cat) => cat.name == data[0].category)?.id ?? 1
        ).toString() ?? "";
      refs[5].value = data[0]?.part_of_speech.toString();
    }
  }, [data, refs]);

  const formData: FormData = {
    title: "Szczegóły i edycja brakującej frazy",
    headers: [
      { inputName: "Phrase", inputType: "text", isRequired: true },
      { inputName: "Definition", inputType: "text", isRequired: true },
      {
        inputName: "Language",
        inputType: "select",
        isRequired: false,
        data: languages?.map((lan) => ({ id: lan.id, value: lan.code })),
      },
      {
        inputName: "Level",
        inputType: "select",
        isRequired: false,
        data: difficultyLevels?.map((df) => ({ id: df.id, value: df.level })),
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
    onCancel: () => navigate(routeName),
    others: <AddTranslationButton setTranslationsData={setTranslationsData} />,
  };

  return <FormTemplate {...formData} setRefs={setRefs} />;
};

export default DetailsMissingPhrases;
