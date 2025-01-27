import { HStack, Img, Text, Stack, Show } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SelectLanguage from "../../components/SelectLanguage";
import SearchInput from "../../components/dictionary/SearchInput";
import TranslationTab from "../../components/dictionary/TranslationTab";
import getCroppedImageUrl from "../../services/image-url";
import actionData from "../../hooks/actionData";
import { HiSpeakerWave } from "react-icons/hi2";
import RandomPhrase from "../../components/dictionary/RandomPhrase";
import SimilarPhrases from "../../components/dictionary/SimilarPhrases";
import useSpeechSynthesis from "../../hooks/useSpeechSynthesis";
import useLanguages from "../../hooks/useLanguages";

export interface Phrase {
  id: number;
  translation_id?: number | null;
  word: string;
  definition: string;
  photo?: string | null;
  category: string;
  level?: string | null;
  type?: string | null;
  part_of_speech?: string | null;
  popularity?: number | null;
  language?: string | null;
}

const DictionarySearchResult = () => {
  const { id, word, code } = useParams<{
    id: string;
    word: string;
    code: string;
  }>();
  const [selectedLanguage, setSelectedLanguage] = useState<string>(
    code ?? "ENG"
  );
  const [searchPhrase, setSearchPhrase] = useState<Phrase | null>(null);
  const [translations, setTranslations] = useState<Phrase[]>([]);
  const navigate = useNavigate();
  const { putData } = actionData("/words/raisePopularity");
  const [error, setError] = useState<boolean>(false);
  const { data: languages } = useLanguages();

  const fetchData = async (endpoint: string, params?: {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await fetch(
        `http://localhost:3001/api/${endpoint}?${queryString}`
      );
      return await response.json();
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const Load = async () => {
    console.log("Load");
    let data: Phrase[] = [];
    if (code == "POL") {
      try {
        const data = await fetchData("wordsPolishDetailed", { id: id || 0 });
        if (data[0].word == word) {
          data[0].language = "POL";
          const formData = new URLSearchParams();
          formData.append("language", code ?? "POL");
          formData.append("id", id || "");
          putData(formData);
          setSearchPhrase(data[0]);

          let data2: Phrase[] = [];
          const translationPromises = languages
            .filter((lang) => lang.code != "POL")
            .map(async (lang) => {
              let data3: Phrase[] = await fetchData(
                "translationPOL_Detailed/pol",
                {
                  language: lang.code,
                  id: id || 0,
                }
              );
              return data3.map((element) => ({
                ...element,
                language: lang.code,
              }));
            });

          const translationResults = await Promise.all(translationPromises);
          data2 = translationResults.flat();
          setTranslations(data2);
        }
      } catch (err) {
        console.log(err);
        setError(true);
      }
    } else {
      try {
        data = await fetchData("wordsSecondDetailed", {
          language: code,
          id: id || 0,
        });
        if (data[0]?.word == word) {
          data[0].language = code;
          setSearchPhrase(data[0]);
          const formData = new URLSearchParams();
          formData.append("language", code ?? "");
          formData.append("id", id || "");
          putData(formData);
          let data2: Phrase[] = await fetchData("translationPOL_Detailed/_", {
            language: code,
            id: id || 0,
          });
          data2 = data2.map((element) => ({
            ...element,
            language: "POL",
          }));

          setTranslations(data2);
        } else {
          data = await fetchData("wordsPolishDetailed", { id: id || 0 });
          const formData = new URLSearchParams();
          formData.append("language", "POL");
          formData.append("id", id || "");
          putData(formData);
          if (data[0].word == word) {
            data[0].language = "POL";
            setSearchPhrase(data[0]);
            let data2: Phrase[] = await fetchData(
              "translationPOL_Detailed/pol",
              {
                language: code,
                id: id || 0,
              }
            );
            data2 = data2.map((element) => ({
              ...element,
              language: code,
            }));
            setTranslations(data2);
          }
        }
      } catch (err) {
        console.log(err);
        setError(true);
      }
    }
  };

  useEffect(() => {
    if (id && code && word && languages.length > 0) {
      setSelectedLanguage(code);
      Load();
    }
  }, [id, code, word, languages]);

  const onSearch = (id: number, searchText: string) => {
    navigate(
      "/dictionary/searchResult/" +
        id +
        "/" +
        searchText +
        "/" +
        selectedLanguage
    );
    window.location.reload();
  };

  return (
    <>
      <Stack
        justify={{ base: "center", sm: "unset" }}
        align="center"
        direction={{ base: "column", md: "row" }}
        marginBottom={{ base: "5%", md: "unset" }}
      >
        <p>Wybrany język:</p>
        <SelectLanguage
          selectedLanguage={selectedLanguage}
          setSelectedLanguage={setSelectedLanguage}
        />
        <div style={{ width: "5%" }}></div>
        <SearchInput
          onSearch={(id, searchText) => onSearch(id, searchText)}
          language={selectedLanguage + "_POL"}
        ></SearchInput>
        <RandomPhrase
          onSearch={(id, searchText) => onSearch(id, searchText)}
          language={selectedLanguage}
        ></RandomPhrase>
      </Stack>
      <HStack justifyContent="space-around" alignItems="start">
        <div>
          <HStack
            marginBottom="3%"
            justifyContent={{ base: "center", md: "unset" }}
          >
            <h1>{searchPhrase?.word}</h1>
            <HiSpeakerWave
              size={40}
              onClick={() => {
                useSpeechSynthesis(
                  searchPhrase?.language ?? "",
                  searchPhrase?.word ?? ""
                );
              }}
              cursor={"pointer"}
            />
            <Show above="md">
              <Img
                boxSize="35%"
                marginX={"5%"}
                marginY="2%"
                borderRadius="20px"
                src={getCroppedImageUrl(
                  searchPhrase?.photo ?? translations[0]?.photo ?? ""
                )}
                bgColor="var(--copy)"
              />
            </Show>
          </HStack>
          <Show below="md">
            <Img
              boxSize="50%"
              marginY="4%"
              borderRadius="20px"
              src={getCroppedImageUrl(
                searchPhrase?.photo ?? translations[0]?.photo ?? ""
              )}
              justifySelf={{ base: "center", md: "unset" }}
            />
          </Show>
          {error ? (
            <Text display="flex" style={{ color: "var(--error)" }}>
              Błąd wczytywania tłumaczeń.
            </Text>
          ) : (
            <ul>
              {translations.map((phrase, index) => (
                <TranslationTab
                  key={phrase.word + phrase.id}
                  phrase={phrase}
                  index={index + 1}
                  link={true}
                  addToQuiz={true}
                  language={phrase.language ?? "ENG"}
                ></TranslationTab>
              ))}
            </ul>
          )}
          <Show below="md">
            <SimilarPhrases
              phrase={searchPhrase?.word ?? ""}
              inLanguage={selectedLanguage}
            />
          </Show>
        </div>
        <Show above="md">
          <SimilarPhrases
            phrase={searchPhrase?.word ?? ""}
            inLanguage={selectedLanguage}
          />
        </Show>
      </HStack>
    </>
  );
};

export default DictionarySearchResult;
