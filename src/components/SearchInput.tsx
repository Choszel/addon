import {
  Button,
  Flex,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import { useRef } from "react";
import { BsSearch } from "react-icons/bs";

interface Props {
  onSearch: (searchText: string) => void;
}

const SearchInput = ({ onSearch }: Props) => {
  const ref = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    event?.preventDefault();
    onSearch(ref.current?.value ?? "");
  };

  return (
    <Flex
      display="flex"
      margin="3% 0% 5% 0%"
      alignContent="center"
      justifyContent="center"
    >
      <form>
        <HStack>
          <InputGroup
            boxShadow="0 4px 8px rgba(0, 0, 0, 0.1)"
            borderRadius="20px"
          >
            <InputLeftElement children={<BsSearch />}></InputLeftElement>
            <Input
              width="500px"
              ref={ref}
              borderRadius={20}
              border="0px"
              placeholder="Wpisz szukaną frazę tutaj..."
              color="var(--neutral1)"
              focusBorderColor="var(--primary)"
              onChange={handleSubmit}
            ></Input>
          </InputGroup>
          <Button marginX="1%">Szukaj</Button>
        </HStack>
      </form>
    </Flex>
  );
};

export default SearchInput;
