import { useEffect, useState } from "react";
import usePhrasesStorage from "../hooks/usePhrasesStorage";
import "../index.css";
import useTranslationPL_ENG, {
  TranslationPL_ENG,
} from "../hooks/useTranslationPL_ENG";
interface Props {
  text: string;
  popupRef: React.RefObject<HTMLSpanElement>;
}

const TextTranslator = ({ text, popupRef }: Props) => {
  const { addToSavedPhrases } = usePhrasesStorage("ENG");
  const { fetchAll } = useTranslationPL_ENG();
  const { data: phrases } = fetchAll();
  const [foundPhrases, setFoundPhrases] = useState<TranslationPL_ENG[]>([]);
  const [translation, setTranslation] = useState<string>();

  const responseGenerate = async (inputText: string) => {
    const prompt = {
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
    // if (text.length > 1) {
    //   responseGenerate(text);
    // }
  }, [text]);

  useEffect(() => {
    if (phrases) {
      const sortedPhrases = [...phrases].sort((a, b) =>
        a.word_english > b.word_english ? 1 : -1
      );

      const words = text.replace(/[^\w\s]/gi, "").split(/[ \n]/);
      const matchedPhrases = new Set<TranslationPL_ENG>();

      words.forEach((word) => {
        sortedPhrases.forEach((phrase) => {
          if (word.toLowerCase() === phrase.word_english.toLowerCase()) {
            matchedPhrases.add(phrase);
          }
        });
      });
      setFoundPhrases(Array.from(matchedPhrases).filter(Boolean));
      console.log(words);
    }
  }, [text, phrases]);

  useEffect(() => {
    console.log(foundPhrases);
  }, [foundPhrases]);

  return (
    <span className="popuptext" id="tranlatorPopup" ref={popupRef}>
      {translation}
      <div>
        {foundPhrases.map((phrase) => (
          <button
            key={phrase.id.toString()}
            onClick={() => addToSavedPhrases({ translation_id: phrase.id })}
            style={{ marginLeft: "8px", color: "var(--primary-light)" }}
          >
            {phrase.word_english}
          </button>
        ))}
      </div>
    </span>
  );
};

export default TextTranslator;
