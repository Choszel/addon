import {
  Flex,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { BsSearch } from "react-icons/bs";

interface Props {
  onSearch: (id: number, searchText: string) => void;
  language: string;
}

export interface WordsLike {
  id: number;
  word: string;
}

const SearchInput = ({}: Props) => {
  const [searchValue, setSearchValue] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

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
              placeholder="Wyszukaj quiz..."
              color="var(--neutral1)"
              focusBorderColor="var(--primary)"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              ref={inputRef}
            />
            <InputRightElement children={<BsSearch />} />
          </InputGroup>
          )
        </HStack>
      </form>
    </Flex>
  );
};

export default SearchInput;
