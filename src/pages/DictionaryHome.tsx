import { Box, HStack, Spacer, Spinner, Stack } from "@chakra-ui/react";
import SearchInput from "../components/dictionary/SearchInput";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SelectLanguage from "../components/SelectLanguage";
import useWordsEnglish, { EnglishWord } from "../hooks/useWordsEnglish";
import RandomPhrase from "../components/dictionary/RandomPhrase";

const DictionaryHome = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<string>("ENG_PLN");
  const { fetchAll } = useWordsEnglish();
  const { data: popularEnglishWords, isLoading, error } = fetchAll();
  const [slicedArray, setSlicedArray] = useState<EnglishWord[]>([]);
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

  useEffect(() => {
    setSlicedArray(popularEnglishWords.slice(0, 5));
  }, [popularEnglishWords]);

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
      <Stack
        direction={{ base: "column", md: "row" }}
        justify="center"
        align="center"
        marginY={{ base: "10%", md: "unset" }}
      >
        <SearchInput
          onSearch={(id, searchText) => onSearch(id, searchText)}
          language={selectedLanguage ?? ""}
        ></SearchInput>
        <RandomPhrase
          onSearch={(id, searchText) => onSearch(id, searchText)}
          language={selectedLanguage ?? ""}
        ></RandomPhrase>
      </Stack>
      <Stack
        justify="center"
        align="center"
        spacing={10}
        margin="2% 0% 4% 0%"
        direction={{ base: "column", md: "row" }}
      >
        <Box className="gradient_box" width={{ base: "unset", md: "40%" }}>
          <p style={{ marginBottom: "2%" }}>
            Popularne wyszukiwania w tym miesiącu
          </p>
          {isLoading && <Spinner boxSize={100} marginY="9%" />}
          {error && <p>Przepraszamy, wystąpił błąd serwera.</p>}
          {slicedArray.map((word, id) => (
            <HStack
              width="90%"
              onClick={() => redirectButton(word)}
              cursor="pointer"
              marginY="0.7%"
              key={id}
            >
              <p>{id + 1}.</p>
              <p>{word.word}</p>
              <Spacer />
              <p>{word.popularity}</p>
            </HStack>
          ))}
        </Box>
        <Box className="gradient_box" width={{ base: "unset", lg: "40%" }}>
          <p>Przeszukiwanie alfabetyczne</p>
          <HStack
            display="flex"
            justifyContent="center"
            wrap="wrap"
            spacing={6}
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
        </Box>
      </Stack>
      <Stack
        direction={{ base: "column", md: "row" }}
        justify="center"
        align="center"
        marginTop={{ base: "10%", md: "unset" }}
      >
        <p>W słowniku brakuje jakiegoś zwrotu? Zgłoś brak tłumaczenia</p>
        <Link
          to="/noTranslation"
          style={{ textDecoration: "underline", color: "var(--secondary)" }}
        >
          tutaj
        </Link>
      </Stack>
    </>
  );
};

export default DictionaryHome;
