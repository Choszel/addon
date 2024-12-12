import { HStack, Show, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import SelectLanguage from "../../components/SelectLanguage";
import SearchInput from "../../components/dictionary/SearchInput";
import { useNavigate, useParams } from "react-router-dom";
import { Phrase } from "./DictionarySearchResult";
import TranslationTab from "../../components/dictionary/TranslationTab";

const AlphabeticalSearch = () => {
  const { language, letter } = useParams<{
    language: string;
    letter: string;
  }>();
  const [selectedLanguage, setSelectedLanguage] = useState<string>(
    language ?? "ENG"
  );
  const [words, setWords] = useState<Phrase[]>();
  const navigate = useNavigate();
  const [error, setError] = useState<boolean>(false);

  const Load = async () => {
    const queryString = new URLSearchParams({
      language: language ?? "",
      word: letter?.toLowerCase() ?? "",
    }).toString();

    try {
      const response = await fetch(
        `http://localhost:3001/api/wordsSecond/word?${queryString}`
      );
      const data: Phrase[] = await response.json();
      setWords(data);
    } catch (err) {
      console.log(err);
      setError(true);
    }
  };

  useEffect(() => {
    Load();
  }, [selectedLanguage]);

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
      <HStack marginBottom={{ base: "5%", md: "unset" }}>
        <p>Wybrany język:</p>
        <SelectLanguage
          selectedLanguage={selectedLanguage}
          setSelectedLanguage={setSelectedLanguage}
        />
      </HStack>
      <SearchInput
        onSearch={(id, searchText) => onSearch(id, searchText)}
        language={selectedLanguage ?? ""}
      ></SearchInput>
      <Show below="md">
        <br />
      </Show>
      {error ? (
        <Text marginBottom="2%" style={{ color: "var(--error)" }}>
          Błąd serwera.
        </Text>
      ) : (
        words?.map((word, index) => (
          <TranslationTab
            phrase={word}
            index={index + 1}
            link={true}
            language={selectedLanguage}
            key={index + 1}
          ></TranslationTab>
        ))
      )}
    </>
  );
};

export default AlphabeticalSearch;
