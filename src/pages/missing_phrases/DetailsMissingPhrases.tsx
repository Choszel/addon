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
import { Spinner, Text } from "@chakra-ui/react";
import usePartOfSpeech from "../../hooks/usePartOfSpeech";

const DetailsMissingPhrases = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, error } = useMissingPhrases(parseInt(id ?? "0"));
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
  const {
    data: languages,
    isLoading: langIsLoading,
    error: langError,
  } = useLanguages();
  const routeName = "/missingPhrases";
  const [postRoute, setPostRoute] = useState<string>("/wordsSecond");
  const { postData } = actionData(postRoute);
  const { deleteData } = actionData(routeName);
  const { postData: postTranslations } = actionData("/translationPOL_");
  const [refs, setRefs] = useState<
    (HTMLInputElement | HTMLSelectElement | null)[]
  >([]);
  const [translationsData, setTranslationsData] = useState<Translation[]>();
  const navigate = useNavigate();
  const [languageValue, setLanguageValue] = useState<string>();

  const handleSave = async () => {
    const formData = new URLSearchParams();
    formData.append("language", languageValue ?? "");
    formData.append("word", refs[0]?.value ?? "");
    formData.append("definition", refs[1]?.value ?? "");
    formData.append("photo", refs[3]?.value ?? "");
    formData.append("difficulty_level_id", refs[4]?.value ?? "");
    formData.append("category_id", refs[5]?.value ?? "");
    formData.append("part_of_speech", refs[6]?.value ?? "");

    const response = await postData(formData);

    if (response?.id) {
      translationsData?.forEach((element) => {
        const translation = new URLSearchParams();
        switch (languageValue) {
          case "POL":
            translation.append("language", element.language ?? "");
            translation.append(
              "word_polish_id",
              (response.id ?? -1).toString()
            );
            translation.append("word_second_id", element.id?.toString() ?? "");
            break;
          default:
            translation.append("language", "POL");
            translation.append("word_polish_id", element.id?.toString() ?? "");
            translation.append(
              "word_second_id",
              (response.id ?? -1).toString()
            );
            break;
        }
        postTranslations(translation);
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
    if (languageValue) {
      console.log("languageValue", languageValue);
      disableUnused();
    }
  }, [languageValue]);

  const disableUnused = () => {
    switch (languageValue) {
      case "POL":
        setPostRoute("/wordsPolish");
        if (refs[3] && refs[4] && refs[6]) {
          console.log("disable");
          refs[3].disabled = false;
          refs[4].disabled = true;
          refs[6].disabled = true;
        }
        break;
      default:
        setPostRoute("/wordsSecond");
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
    if (
      data &&
      refs[0] &&
      refs[1] &&
      refs[2] &&
      refs[3] &&
      refs[4] &&
      refs[5] &&
      refs[6]
    ) {
      refs[0].value = data[0]?.phrase;
      refs[1].value = data[0]?.definition;
      refs[2].value =
        (
          languages.find((lan) => lan.code == data[0].code)?.code ?? "ENG"
        ).toString() ?? "";
      setLanguageValue(refs[2].value);
      refs[3].value = data[0]?.photo ?? "";
      refs[4].value =
        (
          difficultyLevels.find((dif) => dif.level == data[0].level)?.id ?? 1
        ).toString() ?? "";
      refs[5].value =
        (
          categories.find((cat) => cat.name == data[0].category)?.id ?? 1
        ).toString() ?? "";
      refs[6].value = data[0]?.part_of_speech?.toString() ?? "";
    }
  }, [data, refs]);

  const formData: FormData = {
    title: "Szczegóły i edycja brakującej frazy",
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
        data: languages?.map((lan) => ({ id: lan.code, value: lan.code })),
        isLoading: langIsLoading,
        error: langError,
        onChange: (e) => setLanguageValue(e.target.value),
      },
      { inputName: "Zdjęcie", inputType: "text", isRequired: false },
      {
        inputName: "Poziom trudności",
        inputType: "select",
        isRequired: false,
        data: difficultyLevels?.map((df) => ({ id: df.id, value: df.level })),
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
        maxLength: 15,
      },
    ],
    setRefs: function (): void {},
    onSave: handleSave,
    onCancel: () => navigate(routeName),
    others: (
      <AddTranslationButton
        langugeOption={languageValue == "POL"}
        setTranslationsData={setTranslationsData}
      />
    ),
  };

  if (isLoading) return <Spinner />;
  if (error) return <Text color="var(--error)">{error}</Text>;

  return <FormTemplate {...formData} setRefs={setRefs} />;
};

export default DetailsMissingPhrases;
