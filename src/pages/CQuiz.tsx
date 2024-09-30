import { useEffect, useState } from "react";
import FormTemplate, {
  FormData,
} from "../components/crud_templates/CreateTemplate";
import useLanguages from "../hooks/useLanguages";
import { Box, Button, HStack, Select, Text, useToast } from "@chakra-ui/react";
import usePhrasesStorage from "../hooks/usePhrasesStorage";
import useTranslationPL_ENG from "../hooks/useTranslationPL_ENG";
import actionData from "../hooks/actionData";
import { useNavigate } from "react-router-dom";
import useTokenData from "../others/useTokenData";
import AddPhraseButton from "../components/quizes/AddPhraseButton";

export interface QuizzQuestion {
  translation_id: number | undefined;
  type: string | undefined;
  category: string | undefined;
  level: string | undefined;
}

const CQuiz = () => {
  const [refs, setRefs] = useState<
    (HTMLInputElement | HTMLSelectElement | null)[]
  >([]);
  const [phrasesData, setPhrasesData] = useState<QuizzQuestion[]>();
  const { data: languages } = useLanguages();
  const { fetchAll } = useTranslationPL_ENG();
  const { data: translations } = fetchAll();
  const { postData: postQuiz } = actionData("/quizzes");
  const { postData: postQuizQuestions } = actionData("/quizzesQuestions/ENG");
  const { savedPhrases, isLoading } = usePhrasesStorage("ENG");
  const navigate = useNavigate();
  const toast = useToast();
  const { GetUserId } = useTokenData();
  const [categoriesQuizz, setCategoriesQuizz] = useState<
    (string | undefined)[]
  >([""]);
  const [levelsQuizz, setLevelsQuizz] = useState<(string | undefined)[]>([""]);

  const handleSave = async () => {
    if (
      savedPhrases.some((sp) =>
        phrasesData?.some(
          (pd) => pd.translation_id === sp.translation_id && pd.type === sp.type
        )
      )
    ) {
      toast({
        title: "Na liście znajdują się duplikaty. Proszę je usunąć.",
        status: "error",
        position: "bottom-right",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    if (savedPhrases.length + (phrasesData?.length ?? 0) < 1) {
      toast({
        title: "Minimalna wymagana ilość fraz wynosi 15. ",
        status: "error",
        position: "bottom-right",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    const formData = new URLSearchParams();
    formData.append("title", refs[0]?.value ?? "");
    formData.append("users_id", GetUserId().toString());
    formData.append("languages_id", refs[1]?.value ?? "");
    const dateNow = new Date().toJSON().substring(0, 10);
    formData.append("execution_date", dateNow.toString());

    const response = await postQuiz(formData);
    console.log(response.id);

    const questionData = new URLSearchParams();
    questionData.append("quiz_id", (response.id ?? 0).toString());
    questionData.append(
      "data",
      JSON.stringify([...savedPhrases, ...(phrasesData ?? [])])
    );
    postQuizQuestions(questionData);

    //return navigate("/fishCards");
  };

  const handleCancel = () => {
    return navigate("/fishCards");
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
    setCategoriesQuizz([...new Set(savedPhrases?.map((q) => q.category))]);
    setLevelsQuizz([...new Set(savedPhrases.map((q) => q.level ?? ""))]);
    savedPhrases.forEach((e) => (e.type = "pln_phrase"));
  }, [savedPhrases]);

  useEffect(() => {
    let questionsCategories = [
      ...new Set(savedPhrases?.map((q) => q.category)),
    ];
    let questionsLevels = [...new Set(savedPhrases?.map((q) => q.level ?? ""))];
    setCategoriesQuizz(() => [
      ...questionsCategories,
      ...(phrasesData
        ?.map((q) => q.category)
        .filter(
          (category) => !questionsCategories.includes(category ?? "")
        ) ?? [""]),
    ]);

    setLevelsQuizz(() => [
      ...questionsLevels,
      ...(phrasesData
        ?.map((q) => q.level)
        .filter((level) => !questionsLevels.includes(level ?? "")) ?? [""]),
    ]);
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
            <button className="tag_category">{cq}</button>
          ))}
        </HStack>
        <HStack marginBottom="2%">
          <Text>Poziomy trudności:</Text>
          {levelsQuizz.map((lq) => (
            <button className="tag_category">{lq}</button>
          ))}
        </HStack>
        {savedPhrases.length < 25 ? (
          <AddPhraseButton
            setPhrasesData={setPhrasesData}
            language={
              languages.find((l) => l.id == parseInt(refs[1]?.value ?? "1"))
                ?.code ?? "ENG"
            }
            savedPhrases={savedPhrases}
          />
        ) : (
          <HStack marginBottom="1%">
            <Text className="p2">Frazy:</Text>{" "}
          </HStack>
        )}
        {savedPhrases.map((phrase) => (
          <HStack>
            <Box className="question">
              <p>
                {
                  translations.find((tr) => tr.id == phrase?.translation_id)
                    ?.word_polish
                }
              </p>
            </Box>
            <Box className="question">
              <p>{phrase.word}</p>
            </Box>
            <Select
              width="25%"
              onChange={(e) => {
                phrase.type = e.target.value;
              }}
            >
              <option value="pln_phrase">Polska Fraza</option>
              <option value="photo">Obrazek</option>
              <option value="pln_def">Polska definicja</option>
              <option value="eng_def">Angielska definicja</option>
            </Select>
            <Button onClick={() => console.log("savedPhrases", savedPhrases)}>
              Kliknij mnie
            </Button>
          </HStack>
        ))}
      </div>
    ),
  };

  return <FormTemplate {...formData} setRefs={setRefs} />;
};

export default CQuiz;
