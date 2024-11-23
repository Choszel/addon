import { Box, HStack, Spacer, Spinner, Stack } from "@chakra-ui/react";
import SearchInput from "../../components/dictionary/SearchInput";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SelectLanguage from "../../components/SelectLanguage";
import RandomPhrase from "../../components/dictionary/RandomPhrase";
import useAlphabet from "../../hooks/useAlphabet";
import usePopularWords, { PopularWord } from "../../hooks/usePopularWords";

const DictionaryHome = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<string>("ENG");
  const {
    data: popularWords,
    isLoading,
    error,
  } = usePopularWords(selectedLanguage);
  const navigate = useNavigate();
  const alphabet = useAlphabet(selectedLanguage);

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

  const redirectButton = (phrase: PopularWord) => {
    navigate(
      "/dictionary/searchResult/" +
        phrase.id +
        "/" +
        phrase.word +
        "/" +
        selectedLanguage
    );
  };

  return (
    <>
      <HStack>
        <p>Wybrany język:</p>
        <SelectLanguage
          selectedLanguage={selectedLanguage}
          setSelectedLanguage={setSelectedLanguage}
        />
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
        <button
          className="button_secondary"
          onClick={() => {
            navigate("/dictionary/textDetection");
          }}
        >
          Przetłumacz tekst
        </button>
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
          {popularWords.map((phrase, id) => (
            <HStack
              width="90%"
              onClick={() => redirectButton(phrase)}
              cursor="pointer"
              marginY="0.7%"
              key={id}
            >
              <p>{id + 1}.</p>
              <p>{phrase.word}</p>
              <Spacer />
              <p>{phrase.popularity}</p>
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
