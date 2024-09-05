import { HStack } from "@chakra-ui/react";
import useEnglishWords from "../hooks/useEnglishWords";
import SelectLanguage from "../components/SelectLanguage";
import SearchInput from "../components/SearchInput";
import { useState } from "react";
import useTranslationPL_ENG from "../hooks/useTranslationPL_ENG";
import TranslationTab from "../components/TranslationTab";

const DictionarySearchResult = () => {
  const { data, error, isLoading, isFetching } = useEnglishWords(1);
  const {
    data: translation,
    error: translationError,
    isLoading: loadingTranslation,
    isFetching: fetchingTranslation,
  } = useTranslationPL_ENG(1);
  const [searchText, setSearchText] = useState<string | null>(null);

  return (
    <>
      <HStack>
        <p>Wybrany język:</p>
        <SelectLanguage />
        <SearchInput
          onSearch={(searchText) => setSearchText(searchText)}
        ></SearchInput>
      </HStack>
      <h1>{data[0]?.word}</h1>
      <ul>
        {translation.map((element) => (
          <TranslationTab id={element.words_polish_id}></TranslationTab>
        ))}
      </ul>
    </>
  );
};

export default DictionarySearchResult;
