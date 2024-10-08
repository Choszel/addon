import {
  Flex,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { BsSearch } from "react-icons/bs";
import { useDebounce } from "use-debounce";
import SearchResultList from "../SearchResultList";

interface Props {
  onSearch: (id: number, searchText: string) => void;
  language: string;
}

export interface WordsLike {
  id: number;
  word: string;
}

const SearchInput = ({ onSearch, language }: Props) => {
  const [words, setWords] = useState<WordsLike[]>();
  const [searchValue, setSearchValue] = useState<string>("");
  const [debounceSearchInput] = useDebounce(searchValue.toLowerCase(), 1000);
  // const [endpoint, setEndpoint] = useState<string>();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const getWords = async () => {
      if (debounceSearchInput.trim() === "") {
        setWords([]);
        return;
      }

      switch (language) {
        case "ENG":
          try {
            const response = await fetch(
              "http://localhost:3001/api/wordsEnglish/word?word=" +
                debounceSearchInput
            );
            const data = await response.json();
            setWords(data);
          } catch (err) {
            console.log(err);
          }
          break;
        case "ENG_PLN":
          try {
            const response = await fetch(
              "http://localhost:3001/api/wordsEnglish/word?word=" +
                debounceSearchInput
            );
            const data = await response.json();
            const response2 = await fetch(
              "http://localhost:3001/api/wordsPolish/word?word=" +
                debounceSearchInput
            );
            const data2 = await response2.json();
            setWords(data.concat(data2));
          } catch (err) {
            console.log(err);
          }
          break;
        default:
          try {
            const response = await fetch(
              "http://localhost:3001/api/wordsPolish/word?word=" +
                debounceSearchInput
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
  }, [debounceSearchInput, language]);

  const handleKeyPress = (event: { key: string }) => {
    if (event.key === "Enter") {
      if (words) onSearch(words[0].id, words[0].word);
    }
  };

  const handleResultClick = (id: number, word: string) => {
    setSearchValue(word);
    onSearch(id, word);
  };

  return (
    <Flex
      display="flex"
      margin="2% 0% 3% 0%"
      alignContent="center"
      justifyContent="center"
    >
      <form>
        <HStack>
          (
          <InputGroup
            boxShadow="0 4px 8px rgba(0, 0, 0, 0.1)"
            borderRadius="20px"
          >
            <Input
              width="500px"
              borderRadius={20}
              border="0px"
              placeholder="Wpisz szukaną frazę tutaj..."
              color="var(--neutral1)"
              focusBorderColor="var(--primary)"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyUp={handleKeyPress}
              ref={inputRef}
            />
            <InputRightElement
              children={<BsSearch />}
              onClick={() => handleKeyPress({ key: "Enter" })}
            />
          </InputGroup>
          )
        </HStack>
        {words && (
          <SearchResultList
            results={words ?? null}
            listElementClicked={handleResultClick}
          />
        )}
      </form>
    </Flex>
  );
};

export default SearchInput;
