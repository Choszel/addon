import { useEffect, useState } from "react";
import usePhrasesStorage from "../hooks/usePhrasesStorage";
import useWordsEnglish, { EnglishWord } from "../hooks/useWordsEnglish";
import "../index.css";
interface Props {
  text: string;
  popupRef: React.RefObject<HTMLSpanElement>;
}

const TextTranslator = ({ text, popupRef }: Props) => {
  const { addToSavedPhrases } = usePhrasesStorage("ENG");
  const { fetchAllDetailed } = useWordsEnglish();
  const { data: phrases } = fetchAllDetailed();
  const [foundPhrases, setFoundPhrases] = useState<EnglishWord[]>([]);
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
        a.word > b.word ? 1 : -1
      );

      const words = text.replace(/[^\w\s]/gi, "").split(/[ \n]/);
      const matchedPhrases: EnglishWord[] = [];

      words.forEach((word) => {
        sortedPhrases.forEach((phrase) => {
          if (word.toLowerCase() === phrase.word.toLowerCase()) {
            matchedPhrases.push(phrase);
          }
        });
      });
      setFoundPhrases(matchedPhrases);
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
            onClick={() => addToSavedPhrases(phrase)}
            style={{ marginLeft: "8px", color: "var(--primary-light)" }}
          >
            {phrase.word}
          </button>
        ))}
      </div>
    </span>
  );
};

export default TextTranslator;
