import { HStack, Img, Stack, Text, useToast, VStack } from "@chakra-ui/react";
import { Phrase } from "../../pages/dictionary/DictionarySearchResult";
import { useNavigate } from "react-router-dom";
import { HiSpeakerWave } from "react-icons/hi2";
import usePhrasesStorage from "../../hooks/usePhrasesStorage";
import useTokenData from "../../others/useTokenData";
import getFlag from "../../hooks/useFlags";
import useSpeechSynthesis from "../../hooks/useSpeechSynthesis";

interface Props {
  phrase: Phrase;
  index: number;
  link?: boolean;
  addToQuiz?: boolean;
  language: string;
}

const TranslationTab = ({
  phrase,
  index,
  link,
  addToQuiz,
  language,
}: Props) => {
  const navigator = useNavigate();
  const { addToSavedPhrases } = usePhrasesStorage(language);
  const { CheckUserType } = useTokenData();
  const toast = useToast();

  const handleAddToQuiz = () => {
    if (CheckUserType() != "none")
      addToSavedPhrases({
        translation_id: phrase?.translation_id ?? 0,
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

  const redirectButton = () => {
    if (link) {
      navigator(
        "/dictionary/searchResult/" +
          phrase.id +
          "/" +
          phrase.word +
          "/" +
          language
      );
      window.location.reload();
    }
  };

  return (
    <VStack marginBottom={{ base: "10%", md: "4%" }}>
      <Stack
        key={phrase.word + phrase.id}
        marginBottom="1%"
        direction={{ base: "column", xl: "row" }}
        justify="center"
        align="center"
      >
        <Stack direction={{ base: "column", md: "row" }}>
          <HStack
            onClick={redirectButton}
            cursor={link ? "pointer" : "default"}
          >
            {phrase?.language != null && (
              <Img src={getFlag(phrase?.language ?? "")}></Img>
            )}
            <p>{index}.</p>
            <p>{phrase.word}</p>
          </HStack>

          <HStack marginY={{ base: "2%", md: "0%" }} justifyContent="center">
            <HiSpeakerWave
              size={phrase?.level ? "40px" : "40px"}
              onClick={() => {
                useSpeechSynthesis(language, phrase.word);
              }}
              cursor={"pointer"}
              width="100%"
            />
            {phrase.part_of_speech != undefined ? (
              <Text>{"[" + phrase.part_of_speech + "]"}</Text>
            ) : null}
          </HStack>
        </Stack>

        <HStack>
          {phrase.level != undefined ? (
            <button className="tag_category">{phrase.level}</button>
          ) : null}
          {phrase.category != undefined ? (
            <button className="tag_category">{phrase.category}</button>
          ) : null}
        </HStack>

        {phrase?.level ? (
          <button
            className="button_secondary"
            onClick={() => {
              if (addToQuiz) handleAddToQuiz();
            }}
          >
            Dodaj do quizu
          </button>
        ) : null}
      </Stack>
      <p style={{ display: "flex", margin: "10px 25px" }}>
        {phrase.definition}
      </p>
    </VStack>
  );
};

export default TranslationTab;
