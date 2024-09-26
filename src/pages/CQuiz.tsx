import { useRef, useState } from "react";
import FormTemplate, {
  FormData,
} from "../components/crud_templates/CreateTemplate";
import useLanguages from "../hooks/useLanguages";
import AddTranslationButton from "../components/dictionary/AddTranslationButton";
import { Translation } from "./words_polish/CWordsPolish";
import { HStack, Text } from "@chakra-ui/react";
import usePhrasesStorage from "../hooks/usePhrasesStorage";

const CQuiz = () => {
  const [refs, setRefs] = useState<
    (HTMLInputElement | HTMLSelectElement | HTMLDivElement | null)[]
  >([]);
  const { data: languages } = useLanguages();
  const [translationsData, setTranslationsData] = useState<Translation[]>();
  const divRefs = useRef<(HTMLDivElement | null)[]>([]);

  const { savedPhrases } = usePhrasesStorage("ENG");

  const handleSave = () => {};
  const handleCancel = () => {};

  console.log(divRefs);
  console.log(savedPhrases);
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
      </div>
    ),
  };

  return <FormTemplate {...formData} setRefs={setRefs} />;
};

export default CQuiz;
