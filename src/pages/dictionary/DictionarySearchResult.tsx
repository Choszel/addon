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
  const msg = new SpeechSynthesisUtterance();
  const [error, setError] = useState<boolean>(false);

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
    if (code == "PLN") {
      try {
        const data = await fetchData("wordsPolishDetailed", { id: id || 0 });
        if (data[0].word == word) {
          const formData = new URLSearchParams();
          formData.append("language", code ?? "PLN");
          formData.append("id", id || "");
          putData(formData);
          setSearchPhrase(data[0]);
          let data2: Phrase[] = await fetchData("translationPLN_Detailed/pln", {
            language: "ENG",
            id: id || 0,
          });
          data2 = data2.map((element) => ({
            ...element,
            language: "ENG",
          }));

          let data3: Phrase[] = await fetchData("translationPLN_Detailed/pln", {
            language: "SPA",
            id: id || 0,
          });
          data3 = data3.map((element) => ({
            ...element,
            language: "SPA",
          }));

          setTranslations(data2.concat(data3));
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      try {
        switch (code) {
          case "ENG":
            data = await fetchData("wordsEnglishDetailed", { id: id || 0 });
            break;
          case "SPA":
            data = await fetchData("wordsSpanishDetailed", { id: id || 0 });
            break;
          default:
            break;
        }
        if (data[0].word == word) {
          setSearchPhrase(data[0]);
          const formData = new URLSearchParams();
          formData.append("language", code ?? "");
          formData.append("id", id || "");
          putData(formData);
          let data2: Phrase[] = await fetchData("translationPLN_Detailed/_", {
            language: code,
            id: id || 0,
          });
          data2 = data2.map((element) => ({
            ...element,
            language: "PLN",
          }));

          setTranslations(data2);
        } else {
          data = await fetchData("wordsPolishDetailed", { id: id || 0 });
          const formData = new URLSearchParams();
          formData.append("language", "PLN");
          formData.append("id", id || "");
          putData(formData);
          if (data[0].word == word) {
            setSearchPhrase(data[0]);
            let data2: Phrase[] = await fetchData(
              "translationPLN_Detailed/pln",
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
    if (id && code && word) {
      setSelectedLanguage(code);
      Load();
    }
  }, [id, code, word]);

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

  const handleSpeak = () => {
    let speakLanguage = "pl-PL";
    switch (code) {
      case "ENG":
        speakLanguage = "en-GB";
        break;
      case "SPA":
        speakLanguage = "es-ES";
        break;
      default:
        break;
    }
    const voices = speechSynthesis
      .getVoices()
      .filter((voice) => voice.lang === speakLanguage);
    msg.voice = speakLanguage == "pl-PL" ? voices[1] : voices[0];

    msg.text = searchPhrase?.word ?? "";
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(msg);
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
          language={selectedLanguage + "_PLN"}
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
                handleSpeak();
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
