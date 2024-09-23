import { HStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import SelectLanguage from "../components/SelectLanguage";
import SearchInput from "../components/dictionary/SearchInput";
import { useNavigate, useParams } from "react-router-dom";
import { Phrase } from "./DictionarySearchResult";
import TranslationTab from "../components/dictionary/TranslationTab";

const AlphabeticalSearch = () => {
  const { language, letter } = useParams<{
    language: string;
    letter: string;
  }>();
  const [selectedLanguage, setSelectedLanguage] = useState<string>(
    language ?? "ENG_PLN"
  );
  const [words, setWords] = useState<Phrase[]>();
  const navigate = useNavigate();

  const Load = async () => {
    switch (language) {
      case "ENG_PLN":
        try {
          const response = await fetch(
            "http://localhost:3001/api/wordsEnglish/word?word=" +
              letter?.toLowerCase()
          );
          const data: Phrase[] = await response.json();
          setWords(data);
        } catch (err) {
          console.log(err);
        }
        break;
      default:
        try {
          const response = await fetch(
            "http://localhost:3001/api/wordsEnglish/word?word=" +
              letter?.toLowerCase()
          );
          const data = await response.json();
          setWords(data);
        } catch (err) {
          console.log(err);
        }
        break;
    }
  };

  useEffect(() => {
    Load();
  }, [language, letter]);

  const onSearch = (id: number, searchText: string) => {
    console.log("onSearch", id, searchText);
    return navigate(
      "/dictionary/searchResult/" +
        id +
        "/" +
        searchText +
        "/" +
        selectedLanguage
    );
  };

  return (
    <>
      <HStack>
        <p>Wybrany język:</p>
        <SelectLanguage setSelectedLanguage={setSelectedLanguage} />
      </HStack>
      <SearchInput
        onSearch={(id, searchText) => onSearch(id, searchText)}
        language={selectedLanguage ?? ""}
      ></SearchInput>
      {words?.map((word, index) => (
        <TranslationTab
          phrase={word}
          index={index + 1}
          link={true}
        ></TranslationTab>
      ))}
    </>
  );
};

export default AlphabeticalSearch;
