import { useEffect, useState } from "react";
import FormTemplate, {
  FormData,
} from "../../components/crud_templates/CreateTemplate";
import useLanguages from "../../hooks/useLanguages";
import { HStack, Text, useToast } from "@chakra-ui/react";
import usePhrasesStorage from "../../hooks/usePhrasesStorage";
import useTranslationPL_ from "../../hooks/useTranslationPL_";
import actionData from "../../hooks/actionData";
import { useNavigate } from "react-router-dom";
import useTokenData from "../../others/useTokenData";
import AddPhraseButton from "../../components/quiz/AddPhraseButton";
import useCategories from "../../hooks/useCategories";
import useDifficultyLevels from "../../hooks/useDifficultyLevels";

export interface QuizzQuestion {
  id: number;
  translation_id?: number;
  word_pol?: string;
  category?: string;
  level?: string;
  language?: string;
}

const CQuiz = () => {
  const [refs, setRefs] = useState<
    (HTMLInputElement | HTMLSelectElement | null)[]
  >([]);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("ENG");
  const [phrasesData, setPhrasesData] = useState<QuizzQuestion[]>([]);
  const { data: languages } = useLanguages();
  const { fetchAll } = useTranslationPL_();
  const { data: translations } = fetchAll(selectedLanguage);
  const { postData: postQuiz } = actionData("/quizzes");
  const { postData: postQuizQuestions } = actionData("/quizzesQuestions");
  const { savedPhrases, isLoading, clearPhraseLocalStorage } =
    usePhrasesStorage(selectedLanguage);
  const navigate = useNavigate();
  const toast = useToast();
  const { GetUserId } = useTokenData();
  const [categoriesQuizz, setCategoriesQuizz] = useState<
    (string | undefined)[]
  >([""]);
  const [levelsQuizz, setLevelsQuizz] = useState<(string | undefined)[]>([""]);
  const { data: categories } = useCategories();
  const { data: difficultyLevels } = useDifficultyLevels();

  useEffect(() => {
    console.log("savedPhrases", savedPhrases);
  }, [savedPhrases]);

  const handleSave = async () => {
    console.log("phrasesData", phrasesData);
    console.log("phrasesData length", phrasesData.length);

    const uniqueTranslations = new Set<number | undefined>();

    phrasesData.forEach((phrase) => {
      uniqueTranslations.add(phrase.translation_id);
    });

    if (uniqueTranslations.size != phrasesData.length) {
      toast({
        title: "Na liście znajdują się duplikaty. Proszę je usunąć.",
        status: "error",
        position: "bottom-right",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    if (phrasesData.length < 15) {
      toast({
        title: "Minimalna wymagana ilość fraz wynosi 15.",
        status: "error",
        position: "bottom-right",
        duration: 5000,
        isClosable: true,
      });
      return;
    } else if (phrasesData.length > 25) {
      toast({
        title: "Minimalna wymagana ilość fraz wynosi 15.",
        status: "error",
        position: "bottom-right",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const formData = new URLSearchParams();
    formData.append("title", refs[0]?.value ?? "");
    formData.append("user_id", GetUserId().toString());
    formData.append(
      "language_id",
      (
        languages.find((lang) => lang.code == refs[1]?.value)?.id ?? -1
      )?.toString()
    );
    const dateNow = new Date().toJSON().substring(0, 10);
    formData.append("execution_date", dateNow.toString());
    formData.append("type", "quiz");

    const response = await postQuiz(formData);

    const questionData = new URLSearchParams();
    questionData.append("language", selectedLanguage);
    questionData.append("quiz_id", (response.id ?? 0).toString());
    questionData.append("data", JSON.stringify([...phrasesData]));
    postQuizQuestions(questionData);
    clearPhraseLocalStorage();
    return navigate("/flashcards");
  };

  const handleCancel = () => {
    return navigate("/flashcards");
  };

  useEffect(() => {
    toast({
      title: "Wczytano zawartość zapisanych fraz z listy",
      status: "success",
      position: "bottom-right",
      duration: 5000,
      isClosable: true,
    });
  }, [isLoading]);

  useEffect(() => {
    if (
      savedPhrases.length < 0 ||
      categories.length < 1 ||
      difficultyLevels.length < 0
    )
      return;
    let tempArray: QuizzQuestion[] = [];
    savedPhrases.forEach((sp, id) => {
      const foundPhrase = translations.find(
        (tr) => tr.id == sp?.translation_id
      );

      tempArray.push({
        category:
          categories.find((cat) => cat.id === foundPhrase?.category_id)?.name ??
          "",
        level:
          difficultyLevels.find(
            (dif) => dif.id === foundPhrase?.difficulty_level_id
          )?.level ?? "",
        translation_id: foundPhrase?.id,
        word_pol: foundPhrase?.word_polish,
        id: id,
        language: selectedLanguage,
      });
    });
    setPhrasesData(tempArray);
  }, [savedPhrases, categories, difficultyLevels]);

  useEffect(() => {
    const uniqueCategories = new Set<string | undefined>();
    const uniqueLevels = new Set<string | undefined>();

    phrasesData.forEach((phrase) => {
      uniqueCategories.add(phrase.category);
      uniqueLevels.add(phrase.level);
    });

    setCategoriesQuizz(Array.from(uniqueCategories).filter(Boolean));
    setLevelsQuizz(Array.from(uniqueLevels).filter(Boolean));
  }, [phrasesData]);

  const formData: FormData = {
    title: "Tworzenie Quizu",
    headers: [
      {
        inputName: "Tytuł",
        inputType: "text",
        isRequired: true,
        maxLength: 50,
      },
      {
        inputName: "Język",
        inputType: "select",
        isRequired: false,
        data:
          languages
            ?.map((lang) => ({ id: lang.code, value: lang.code }))
            .filter((lang) => lang.value != "POL") || [],
        onChange: (e) => setSelectedLanguage(e.target.value),
      },
    ],
    setRefs: function (): void {},
    onSave: handleSave,
    onCancel: handleCancel,
    others: (
      <div>
        <HStack marginBottom="2%" flexWrap="wrap" gap="10px">
          <Text>Kategorie:</Text>
          {categoriesQuizz.map((cq) => (
            <button className="tag_category" key={cq}>
              {cq}
            </button>
          ))}
        </HStack>
        <HStack marginBottom="2%" flexWrap="wrap" gap="10px">
          <Text>Poziomy trudności:</Text>
          {levelsQuizz.map((lq) => (
            <button className="tag_category" key={lq}>
              {lq}
            </button>
          ))}
        </HStack>

        <AddPhraseButton
          key={selectedLanguage}
          setPhrasesData={setPhrasesData}
          selectedLanguage={selectedLanguage}
          language={"POL"}
          phraseData={phrasesData}
        />
      </div>
    ),
  };

  return <FormTemplate {...formData} setRefs={setRefs} />;
};

export default CQuiz;
