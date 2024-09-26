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

const CQuiz = () => {
  const [refs, setRefs] = useState<
    (HTMLInputElement | HTMLSelectElement | HTMLDivElement | null)[]
  >([]);
  const [translationsData, setTranslationsData] = useState<Translation[]>();
  const divRefs = useRef<(HTMLDivElement | null)[]>([]);
  const { data: languages } = useLanguages();
  const { fetchAll } = useTranslationPL_ENG();
  const { data: translations } = fetchAll();
  const { savedPhrases, isLoading } = usePhrasesStorage("ENG");
  const toast = useToast();

  const handleSave = () => {};
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
