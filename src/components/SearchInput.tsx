import {
  Flex,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { useRef } from "react";
import { BsSearch } from "react-icons/bs";
import { Link } from "react-router-dom";

interface Props {
  onSearch: (searchText: string) => void;
}

const SearchInput = ({ onSearch }: Props) => {
  const ref = useRef<HTMLInputElement>(null);

  const handleTyping = () => {
    event?.preventDefault();
    onSearch(ref.current?.value ?? "");
  };

  const handleKeyPress = (event: { key: string }) => {
    if (event.key === "Enter") {
    }
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
          <InputGroup
            boxShadow="0 4px 8px rgba(0, 0, 0, 0.1)"
            borderRadius="20px"
          >
            <Input
              width="500px"
              ref={ref}
              borderRadius={20}
              border="0px"
              placeholder="Wpisz szukaną frazę tutaj..."
              color="var(--neutral1)"
              focusBorderColor="var(--primary)"
              onChange={handleTyping}
              onKeyPress={handleKeyPress}
            ></Input>
            <Link to="/dSearchResult">
              <InputRightElement children={<BsSearch />}></InputRightElement>
            </Link>
          </InputGroup>
        </HStack>
      </form>
    </Flex>
  );
};

export default SearchInput;
