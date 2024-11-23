import { HStack, Img, useToast, Text, Stack, Show } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SelectLanguage from "../../components/SelectLanguage";
import SearchInput from "../../components/dictionary/SearchInput";
import TranslationTab from "../../components/dictionary/TranslationTab";
import { PolishWord } from "../../hooks/useWordsPolish";
import getCroppedImageUrl from "../../services/image-url";
import actionData from "../../hooks/actionData";
import usePhrasesStorage from "../../hooks/usePhrasesStorage";
import { HiSpeakerWave } from "react-icons/hi2";
import useTokenData from "../../others/useTokenData";
import RandomPhrase from "../../components/dictionary/RandomPhrase";

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
  const { addToSavedPhrases } = usePhrasesStorage("ENG");
  const { CheckUserType } = useTokenData();
  const toast = useToast();
  const msg = new SpeechSynthesisUtterance();
  const [error, setError] = useState<boolean>(false);

  const Load = async () => {
    console.log("Load");
    switch (code) {
      case "ENG":
        try {
          const response = await fetch(
            "http://localhost:3001/api/wordsEnglishDetailed?id=" + id
          );
          const data: Phrase[] = await response.json();
          if (data[0].word == word) {
            const formData = new URLSearchParams();
            formData.append("table", "words_english");
            formData.append("id", id || "");
            putData(formData);
            setSearchPhrase(data[0]);
            const response2 = await fetch(
              "http://localhost:3001/api/translationPLNENGDetailed/eng?id=" + id
            );
            const data2: PolishWord[] = await response2.json();
            setTranslations(data2);
          } else {
            const response = await fetch(
              "http://localhost:3001/api/wordsPolishDetailed?id=" + id
            );
            const data: Phrase[] = await response.json();
            const formData = new URLSearchParams();
            formData.append("table", "words_polish");
            formData.append("id", id || "");
            putData(formData);
            if (data[0].word == word) {
              setSearchPhrase(data[0]);
              const response2 = await fetch(
                "http://localhost:3001/api/translationPLNENGDetailed/pln?id=" +
                  id
              );
              const data2: PolishWord[] = await response2.json();
              setTranslations(data2);
            }
          }
        } catch (err) {
          console.log(err);
          setError(true);
        }
        break;
      default:
        try {
          const response = await fetch(
            "http://localhost:3001/api/wordsPolishDetailed?id=" + id
          );
          const data: Phrase[] = await response.json();
          const formData = new URLSearchParams();
          formData.append("table", "words_polish");
          formData.append("id", id || "");
          putData(formData);
          if (data[0].word == word) {
            setSearchPhrase(data[0]);
            const response2 = await fetch(
              "http://localhost:3001/api/translationPLNENGDetailed/pln?id=" + id
            );
            const data2: PolishWord[] = await response2.json();
            setTranslations(data2);
          }
        } catch (err) {
          console.log(err);
        }
        break;
    }
  };

  useEffect(() => {
    if (id && code && word) {
      setSelectedLanguage(code);
      Load();
    }
  }, [id, code, word]);

  const handleAddToQuiz = (id: number) => {
    // localStorage.removeItem("translations_pln_eng");

    if (CheckUserType() != "none")
      addToSavedPhrases({
        translation_id: translations[id]?.translation_id ?? 0,
      });
    else
      toast({
        title: "Treść tylko dla zalogowanych użytkowników",
        status: "error",
        position: "bottom-right",
        duration: 5000,
        isClosable: true,
      });
  };

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
        speakLanguage = "en-US";
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
          language={selectedLanguage}
        ></SearchInput>
        <RandomPhrase
          onSearch={(id, searchText) => onSearch(id, searchText)}
          language={selectedLanguage ?? ""}
        ></RandomPhrase>
      </Stack>
      <HStack justifyContent="space-around">
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
                  key={phrase.id}
                  phrase={phrase}
                  index={index + 1}
                  link={true}
                  handleAddToQuiz={handleAddToQuiz}
                  language={code == "PLN" ? "ENG" : "PLN"}
                ></TranslationTab>
              ))}
            </ul>
          )}
        </div>
        <Show above="md">
          <Img
            boxSize="22%"
            marginY="2%"
            borderRadius="20px"
            src={getCroppedImageUrl(
              searchPhrase?.photo ?? translations[0]?.photo ?? ""
            )}
          />
        </Show>
      </HStack>
    </>
  );
};

export default DictionarySearchResult;
