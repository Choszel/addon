import { useEffect, useRef, useState } from "react";
import FormTemplate, {
  FormData,
} from "../components/crud_templates/CreateTemplate";
import useLanguages from "../hooks/useLanguages";
import AddTranslationButton from "../components/dictionary/AddTranslationButton";
import { Translation } from "./words_polish/CWordsPolish";
import { Box, HStack, Text, useToast } from "@chakra-ui/react";
import usePhrasesStorage from "../hooks/usePhrasesStorage";
import useTranslationPL_ENG from "../hooks/useTranslationPL_ENG";
import actionData from "../hooks/actionData";
import { useNavigate } from "react-router-dom";
import useTokenData from "../others/useTokenData";

const CQuiz = () => {
  const [refs, setRefs] = useState<
    (HTMLInputElement | HTMLSelectElement | null)[]
  >([]);
  const [translationsData, setTranslationsData] = useState<Translation[]>();
  const divRefs = useRef<(HTMLDivElement | null)[]>([]);
  const { data: languages } = useLanguages();
  const { fetchAll } = useTranslationPL_ENG();
  const { data: translations } = fetchAll();
  const { postData } = actionData("/quizzes");
  const { savedPhrases, isLoading } = usePhrasesStorage("ENG");
  const navigate = useNavigate();
  const toast = useToast();
  const { GetUserId } = useTokenData();

  const handleSave = () => {
    const formData = new URLSearchParams();
    formData.append("title", refs[0]?.value ?? "");
    formData.append("users_id", GetUserId().toString());
    formData.append("languages_id", refs[1]?.value ?? "");
    const dateNow = new Date().toJSON().substring(0, 10);
    formData.append("execution_date", dateNow.toString());
    postData(formData);
    return navigate("/fishCards");
  };
  const handleCancel = () => {};

  useEffect(() => {
    toast({
      title: "Wczytano zawartość zapisanych fraz z listy",
      status: "success",
      position: "bottom-right",
      duration: 5000,
      isClosable: true,
    });
  }, [isLoading]);

  console.log(divRefs);
  console.log(savedPhrases);
  console.log(
    "phrase something",
    translations?.find((tr) => tr.id == savedPhrases[0]?.translation_id)
      ?.word_polish
  );
  console.log("phrase", savedPhrases[0]);
  console.log("translations", translations);

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
          <div ref={(el) => el && divRefs.current.push(el)}></div>
        </HStack>
        <HStack marginBottom="2%">
          <Text>Poziomy trudności:</Text>
          <div ref={(el) => el && divRefs.current.push(el)}></div>
        </HStack>
        <AddTranslationButton
          setTranslationsData={setTranslationsData}
          title={"Frazy"}
        />
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
          </HStack>
        ))}
      </div>
    ),
  };

  return <FormTemplate {...formData} setRefs={setRefs} />;
};

export default CQuiz;
