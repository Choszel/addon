import {
  Flex,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  Tooltip,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { BsSearch } from "react-icons/bs";
import { useDebounce } from "use-debounce";

interface Props {
  searchValue: string;
  setSearchValue: (searchValue: string) => void;
}

export interface WordsLike {
  id: number;
  word: string;
}

const SearchInput = ({ setSearchValue }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [tempSearchValue, setTempSearchValue] = useState<string>("");
  const [debounceSearchInput] = useDebounce(
    tempSearchValue.toLowerCase(),
    1000
  );

  useEffect(() => {
    setSearchValue(debounceSearchInput);
  }, [debounceSearchInput]);

  return (
    <Flex
      display="flex"
      margin="2% 0% 3% 0%"
      alignContent="center"
      justifyContent="center"
    >
      <form>
        <HStack>
          <Tooltip
            label="Wpisz @użytkownik, aby wyszukać po użytkowniku"
            placement="top"
          >
            <InputGroup
              boxShadow="0 4px 8px rgba(0, 0, 0, 0.1)"
              borderRadius="20px"
            >
              <Input
                width={{ base: "unset", md: "500px" }}
                borderRadius={20}
                border="0px"
                placeholder="Wyszukaj quiz..."
                color="var(--neutral1)"
                focusBorderColor="var(--primary)"
                value={tempSearchValue}
                onChange={(e) => setTempSearchValue(e.target.value)}
                ref={inputRef}
              />
              <InputRightElement children={<BsSearch />} />
            </InputGroup>
          </Tooltip>
        </HStack>
      </form>
    </Flex>
  );
};

export default SearchInput;
