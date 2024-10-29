import { Button, HStack } from "@chakra-ui/react";
import SearchInput from "../components/dictionary/SearchInput";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SelectLanguage from "../components/SelectLanguage";
import useWordsEnglish, { EnglishWord } from "../hooks/useWordsEnglish";
import RandomPhrase from "../components/dictionary/RandomPhrase";

const DictionaryHome = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<string>("ENG_PLN");
  const { fetchAll } = useWordsEnglish();
  const { data: popularEnglishWords } = fetchAll();
  const navigate = useNavigate();
  const alphabet = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
  ];

  const slicedArray = popularEnglishWords.slice(0, 5);

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

  const redirectButton = (phrase: EnglishWord) => {
    navigate(
      "/dictionary/searchResult/" + phrase.id + "/" + phrase.word + "/ENG_PLN"
    );
  };

  return (
    <>
      <HStack>
        <p>Wybrany język:</p>
        <SelectLanguage setSelectedLanguage={setSelectedLanguage} />
      </HStack>
      <HStack display="flex" justifyContent="center">
        <SearchInput
          onSearch={(id, searchText) => onSearch(id, searchText)}
          language={selectedLanguage ?? ""}
        ></SearchInput>
        <RandomPhrase
          onSearch={(id, searchText) => onSearch(id, searchText)}
          language={selectedLanguage ?? ""}
        ></RandomPhrase>
      </HStack>
      <HStack display="flex" justifyContent="center" spacing={10} marginY="4%">
        <div className="gradient_box">
          <p>Popularne wyszukiwania w tym miesiącu</p>
          {slicedArray.map((word, id) => (
            <HStack
              width="90%"
              onClick={() => redirectButton(word)}
              cursor="pointer"
            >
              <p>{id + 1}.</p>
              <p>{word.word}</p>
              <p>{word.popularity}</p>
            </HStack>
          ))}
        </div>
        <div className="gradient_box" style={{ height: "100%" }}>
          <p>Przeszukiwanie alfabetyczne</p>
          <HStack
            display="flex"
            justifyContent="center"
            wrap="wrap"
            spacing={4}
            marginY="4%"
          >
            {alphabet.map((letter) => (
              <Link
                to={"alphabeticalSearch/" + selectedLanguage + "/" + letter}
                key={letter}
              >
                {letter}
              </Link>
            ))}
          </HStack>
        </div>
      </HStack>
      <HStack display="flex" alignContent="center" justifyContent="center">
        {/**ten HStack psuje szerokość strony */}
        <p>W słowniku brakuje jakiegoś zwrotu? Zgłoś brak tłumaczenia</p>
        <Link
          to="/noTranslation"
          style={{ textDecoration: "underline", color: "var(--secondary)" }}
        >
          tutaj
        </Link>
      </HStack>
    </>
  );
};

export default DictionaryHome;
