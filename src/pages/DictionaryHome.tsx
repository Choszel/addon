import { Button, HStack } from "@chakra-ui/react";
import SearchInput from "../components/SearchInput";
import { useState } from "react";
import { Link } from "react-router-dom";
import SelectLanguage from "../components/SelectLanguage";

const DictionaryHome = () => {
  const [searchText, setSearchText] = useState<string | null>(null);
  const popularWords = ["cat", "dog", "duck"];

  return (
    <>
      <HStack>
        <p>Wybrany język:</p>
        <SelectLanguage />
      </HStack>
      <SearchInput
        onSearch={(id, searchText) => setSearchText(searchText)}
        language={""}
      ></SearchInput>
      <Button bgColor="var(--honeydew)">Losuj frazę</Button>
      <HStack display="flex" justifyContent="center" spacing={10} marginY="4%">
        <div className="gradient_box">
          <p>Popularne wyszukiwania w tym miesiącu</p>
          {popularWords.map((word, id) => (
            <HStack>
              <p>{id + 1}</p> <p>{word}</p>
            </HStack>
          ))}
        </div>
        <div className="gradient_box" style={{ height: "100%" }}>
          <p>Przeszukiwanie alfabetyczne</p>
          {popularWords.map((word, id) => (
            <HStack>
              <p>{id + 1}</p> <p>{word}</p>
            </HStack>
          ))}
        </div>
      </HStack>
      <HStack display="flex" alignContent="center" justifyContent="center">
        {/**ten HStack psuje szerokość strony */}
        <p>W słowniku brakuje jakiegoś zwrotu? Zgłoś brak tłumaczenia</p>
        <Link
          to="/noTranslation"
          style={{ textDecoration: "underline", color: "#0000EE" }}
        >
          tutaj
        </Link>
      </HStack>
    </>
  );
};

export default DictionaryHome;
