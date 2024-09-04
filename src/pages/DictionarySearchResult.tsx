import { HStack } from "@chakra-ui/react";
import useEnglishWords from "../hooks/useEnglishWords";
import SelectLanguage from "../components/SelectLanguage";
import SearchInput from "../components/SearchInput";
import { useState } from "react";

const DictionarySearchResult = () => {
  const { data, error, isLoading, isFetching } = useEnglishWords(1);
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
      <ul>
        {data.map((element) => (
          <li key={element.id}>
            {element.id} {element.word}
          </li>
        ))}
      </ul>
    </>
  );
};

export default DictionarySearchResult;
