import { useEffect, useState } from "react";
import { WordsLike } from "./SearchInput";

interface Props {
  onSearch: (id: number, searchText: string) => void;
  language: string;
}

const RandomPhrase = ({ onSearch, language }: Props) => {
  const [words, setWords] = useState<WordsLike[]>();

  useEffect(() => {
    const getWords = async () => {
      switch (language) {
        default:
          try {
            const response = await fetch(
              "http://localhost:3001/api/wordsEnglish"
            );
            const data = await response.json();
            setWords(data);
          } catch (err) {
            console.log(err);
          }
          break;
      }
    };
    getWords();
  }, [language]);

  const findRandomPhrase = () => {
    const randomIndex = Math.floor(Math.random() * (words?.length ?? 0));
    if (words && words.length > 0)
      onSearch(words[randomIndex].id, words[randomIndex].word);
  };

  return (
    <button className="add_to_quiz_button" onClick={findRandomPhrase}>
      Losuj frazę
    </button>
  );
};

export default RandomPhrase;
