import { useEffect, useState } from "react";
import usePhrasesStorage from "../../hooks/usePhrasesStorage";
import "../../index.css";
import useTranslationPL_, {
  TranslationPL_,
} from "../../hooks/useTranslationPL_";
import useTokenData from "../../others/useTokenData";
import { useToast } from "@chakra-ui/react";
interface Props {
  text: string;
  maxTextLength?: number;
  inLanguage: string;
  outLanguage: string;
}

const TextTranslator = ({
  text,
  maxTextLength,
  inLanguage,
  outLanguage,
}: Props) => {
  const { addToSavedPhrases } = usePhrasesStorage(inLanguage);
  const { fetchAll } = useTranslationPL_();
  const { data: phrases } = fetchAll(inLanguage);
  const [foundPhrases, setFoundPhrases] = useState<TranslationPL_[]>([]);
  const [translation, setTranslation] = useState<string>();
  const { CheckUserType } = useTokenData();
  const toast = useToast();

  const responseGenerate = async (inputText: string) => {
    const prompt = {
      inLanguage: inLanguage,
      outLanguage: outLanguage,
      inputText: inputText,
    };

    const result = await fetch("http://localhost:3001/api/ai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(prompt),
    });

    if (result.ok) {
      const airespond = await result.json();
      setTranslation(airespond.analysis);
    } else {
      setTranslation("Error");
    }
  };

  useEffect(() => {
    if (maxTextLength && text.length > maxTextLength) {
      setTranslation("Podano zbyt długi tekst do przetłumaczenia.");
    } else if (text.length > 1) {
      setTranslation("Tłumaczenie...");
      responseGenerate(text);
    }
  }, [text]);

  const handleAddToQuiz = (phraseId: number) => {
    if (CheckUserType() != "none")
      addToSavedPhrases({
        translation_id: phraseId,
      });
    else
      toast({
        title: "Treść tylko dla zalogowanych użytkowników",
        status: "error",
        position: "bottom-right",
        duration: 5000,
        isClosable: true,
      });
  };

  useEffect(() => {
    if (phrases) {
      const phraseMap = new Map(
        phrases.map((phrase) => [phrase.word_second.toLowerCase(), phrase])
      );

      const words = text
        .replace(/[^\w\s]/gi, "")
        .toLowerCase()
        .split(/\s+/);

      const matchedPhrases = new Set<TranslationPL_>();
      words.forEach((word) => {
        if (phraseMap.has(word)) {
          matchedPhrases.add(phraseMap.get(word)!);
        }
      });

      setFoundPhrases(Array.from(matchedPhrases));
    }
  }, [text, phrases]);

  return (
    <>
      {translation}
      <div>
        {foundPhrases.map((phrase) => (
          <button
            key={phrase.id.toString()}
            onClick={() => handleAddToQuiz(phrase.id ?? 0)}
            style={{ marginLeft: "8px", color: "var(--primary-light)" }}
          >
            {phrase.word_second}
          </button>
        ))}
      </div>
    </>
  );
};

export default TextTranslator;
