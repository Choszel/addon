import { useEffect, useState } from "react";
import FormTemplate, {
  FormData,
} from "../components/crud_templates/CreateTemplate";
import useLanguages from "../hooks/useLanguages";
import { HStack, Text, useToast } from "@chakra-ui/react";
import usePhrasesStorage from "../hooks/usePhrasesStorage";
import useTranslationPL_ENG from "../hooks/useTranslationPL_ENG";
import actionData from "../hooks/actionData";
import { useNavigate } from "react-router-dom";
import useTokenData from "../others/useTokenData";
import AddPhraseButton from "../components/quizes/AddPhraseButton";
import useCategories from "../hooks/useCategories";
import useDifficultyLevels from "../hooks/useDifficultyLevels";

export interface QuizzQuestion {
  id: number;
  translation_id?: number;
  word_pln?: string;
  category?: string;
  level?: string;
}

const CQuiz = () => {
  const [refs, setRefs] = useState<
    (HTMLInputElement | HTMLSelectElement | null)[]
  >([]);
  const [phrasesData, setPhrasesData] = useState<QuizzQuestion[]>([]);
  const { data: languages } = useLanguages();
  const { fetchAll } = useTranslationPL_ENG();
  const { data: translations } = fetchAll();
  const { postData: postQuiz } = actionData("/quizzes");
  const { postData: postQuizQuestions } = actionData("/quizzesQuestions/ENG");
  const { savedPhrases, isLoading, clearPhraseLocalStorage } =
    usePhrasesStorage("ENG");
  const navigate = useNavigate();
  const toast = useToast();
  const { GetUserId } = useTokenData();
  const [categoriesQuizz, setCategoriesQuizz] = useState<
    (string | undefined)[]
  >([""]);
  const [levelsQuizz, setLevelsQuizz] = useState<(string | undefined)[]>([""]);
  const { data: categories } = useCategories();
  const { data: difficultyLevels } = useDifficultyLevels();

  const handleSave = async () => {
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

    if (phrasesData?.length ?? 0 < 15) {
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
    formData.append("language_id", refs[1]?.value ?? "");
    const dateNow = new Date().toJSON().substring(0, 10);
    formData.append("execution_date", dateNow.toString());

    const response = await postQuiz(formData);

    const questionData = new URLSearchParams();
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
      savedPhrases.length < 1 ||
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
        word_pln: foundPhrase?.word_polish,
        id: id,
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
      { inputName: "Tytuł", inputType: "text", isRequired: true },
      {
        inputName: "Język",
        inputType: "select",
        isRequired: false,
        data:
          languages?.map((lang) => ({ id: lang.id, value: lang.code })) || [],
      },
    ],
    setRefs: function (): void {},
    onSave: handleSave,
    onCancel: handleCancel,
    others: (
      <div>
        <HStack marginBottom="2%">
          <Text>Kategorie:</Text>
          {categoriesQuizz.map((cq) => (
            <button className="tag_category" key={cq}>
              {cq}
            </button>
          ))}
        </HStack>
        <HStack marginBottom="2%">
          <Text>Poziomy trudności:</Text>
          {levelsQuizz.map((lq) => (
            <button className="tag_category" key={lq}>
              {lq}
            </button>
          ))}
        </HStack>

        <AddPhraseButton
          setPhrasesData={setPhrasesData}
          language={"PLN"}
          phraseData={phrasesData}
        />
      </div>
    ),
  };

  return <FormTemplate {...formData} setRefs={setRefs} />;
};

export default CQuiz;
