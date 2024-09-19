import { HStack, Img } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SelectLanguage from "../components/SelectLanguage";
import SearchInput from "../components/SearchInput";
import TranslationTab from "../components/TranslationTab";
import { PolishWord } from "../hooks/useWordsPolish";
import getCroppedImageUrl from "../services/image-url";

export interface Phrase {
  id: number;
  word: string;
  definition: string;
  photo?: string | null;
  category: string;
  level?: string | null;
}

const DictionarySearchResult = () => {
  const { id, word, code } = useParams<{
    id: string;
    word: string;
    code: string;
  }>();
  const [selectedLanguage, setSelectedLanguage] = useState<string>("ENG_PLN");
  const [searchPhrase, setSearchPhrase] = useState<Phrase | null>(null);
  const [translations, setTranslations] = useState<Phrase[]>([]);
  const navigate = useNavigate();

  const Load = async () => {
    switch (code) {
      case "ENG_PLN":
        try {
          const response = await fetch(
            "http://localhost:3001/api/wordsEnglishDetailed?id=" + id
          );
          const data: Phrase[] = await response.json();
          if (data[0].word == word) {
            setSearchPhrase(data[0]);
            console.log("wordsEnglishDetailed", searchPhrase);
            const response2 = await fetch(
              "http://localhost:3001/api/translationPLNENGDetailed/eng?id=" + id
            );
            const data2: PolishWord[] = await response2.json();
            setTranslations(data2);
            console.log("translationPLNENGDetailed", data);
          } else {
            const response = await fetch(
              "http://localhost:3001/api/wordsPolishDetailed?id=" + id
            );
            const data: Phrase[] = await response.json();
            if (data[0].word == word) {
              setSearchPhrase(data[0]);
              console.log("wordsPolishDetailed", searchPhrase);
              const response2 = await fetch(
                "http://localhost:3001/api/translationPLNENGDetailed/pln?id=" +
                  id
              );
              const data2: PolishWord[] = await response2.json();
              setTranslations(data2);
              console.log("translationPLNENGDetailed", data);
            }
          }
        } catch (err) {
          console.log(err);
        }
        break;
      default:
        try {
          const response = await fetch(
            "http://localhost:3001/api/translationPLNENGDetailed/eng?id=" + id
          );
          const data = await response.json();
          setSearchPhrase(data);
        } catch (err) {
          console.log(err);
        }
        break;
    }
  };

  useEffect(() => {
    Load();
  }, [id, code]);

  const onSearch = (id: number, searchText: string) => {
    console.log("onSearch", id, searchText);
    navigate(
      "/dictionary/searchResult/" +
        id +
        "/" +
        searchText +
        "/" +
        selectedLanguage
    );
    console.log("onSearch Po navigate", id, searchText);
    window.location.reload();
  };

  return (
    <>
      <HStack>
        <p>Wybrany język:</p>
        <SelectLanguage setSelectedLanguage={setSelectedLanguage} />
        <SearchInput
          onSearch={(id, searchText) => onSearch(id, searchText)}
          language={selectedLanguage}
        ></SearchInput>
      </HStack>
      <h1>{searchPhrase?.word}</h1>
      <Img
        boxSize="22%"
        marginY="2%"
        src={getCroppedImageUrl(
          searchPhrase?.photo ?? translations[0]?.photo ?? ""
        )}
      />
      <ul>
        {translations.map((phrase, index) => (
          <TranslationTab
            key={phrase.id}
            phrase={phrase}
            index={index + 1}
          ></TranslationTab>
        ))}
      </ul>
    </>
  );
};

export default DictionarySearchResult;
