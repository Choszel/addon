import {
  Flex,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  Text,
} from "@chakra-ui/react";
import { KeyboardEvent, useEffect, useRef, useState } from "react";
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
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const getWords = async () => {
      if (debounceSearchInput.trim() === "") {
        setWords([]);
        return;
      }

      try {
        let data = [];
        const queryString = new URLSearchParams({
          language: language.substring(0, 3) ?? "",
          word: debounceSearchInput ?? "",
        }).toString();

        const response = await fetch(
          `http://localhost:3001/api/wordsSecond/word?${queryString}`
        );
        data = await response.json();

        let data2 = [];
        if (!language.substring(0, 3).includes("PLN")) {
          const response2 = await fetch(
            "http://localhost:3001/api/wordsPolish/word?word=" +
              debounceSearchInput
          );
          data2 = await response2.json();
        }
        setWords(data.concat(data2));
      } catch (err) {
        console.log(err);
      }
    };
    getWords();
  }, [debounceSearchInput, language]);

  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    event.preventDefault();
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
          <InputGroup className="search_input">
            <Input
              width={{ base: "100%", md: "500px" }}
              borderRadius={20}
              border="0px"
              placeholder="Wpisz szukaną frazę tutaj..."
              className="basic_style"
              focusBorderColor="var(--primary)"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyUp={(e) => handleKeyPress(e)}
              ref={inputRef}
            />
            <InputRightElement
              children={<BsSearch />}
              onClick={() => {
                if (words) onSearch(words[0].id, words[0].word);
              }}
              cursor="pointer"
              id="search-button"
            />
          </InputGroup>
        </HStack>
        {words && (
          <SearchResultList
            results={words ?? null}
            listElementClicked={handleResultClick}
          />
        )}
        {words?.length == 0 && debounceSearchInput.trim() !== "" && (
          <Text marginTop="1%" style={{ color: "var(--error)" }}>
            Nieznana fraza.
          </Text>
        )}
      </form>
    </Flex>
  );
};

export default SearchInput;
