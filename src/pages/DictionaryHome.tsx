import { Button, HStack } from "@chakra-ui/react";
import SearchInput from "../components/SearchInput";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SelectLanguage from "../components/SelectLanguage";

const DictionaryHome = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<string>("ENG_PLN");
  const popularWords = ["cat", "dog", "duck"];
  const navigate = useNavigate();
  const onSearch = (id: number, searchText: string) => {
    console.log("onSearch", id, searchText);
    return navigate(
      "/dictionary/searchResult/" +
        id +
        "/" +
        searchText +
        "/" +
        selectedLanguage
    );
  };

  return (
    <>
      <HStack>
        <p>Wybrany język:</p>
        <SelectLanguage setSelectedLanguage={setSelectedLanguage} />
      </HStack>
      <SearchInput
        onSearch={(id, searchText) => onSearch(id, searchText)}
        language={selectedLanguage ?? ""}
      ></SearchInput>
      <Button bgColor="var(--honeydew)" marginTop="10%">
        Losuj frazę
      </Button>
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
