import { Box, HStack, Show, Text } from "@chakra-ui/react";
import { Phrase } from "../../pages/DictionarySearchResult";
import { useNavigate } from "react-router-dom";
import { HiSpeakerWave } from "react-icons/hi2";

interface Props {
  phrase: Phrase;
  index: number;
  link?: boolean;
  handleAddToQuiz?: (id: number) => void;
}

const TranslationTab = ({ phrase, index, link, handleAddToQuiz }: Props) => {
  const navigator = useNavigate();
  const msg = new SpeechSynthesisUtterance();

  const handleSpeak = () => {
    if (phrase?.level) {
      msg.lang = "en-US";

      const voices = speechSynthesis
        .getVoices()
        .filter((voice) => voice.lang === "en-US");
      msg.voice = voices[0];
    } else {
      msg.lang = "pl-PL";

      const voices = speechSynthesis
        .getVoices()
        .filter((voice) => voice.lang === "pl-PL");
      msg.voice = voices[1];
    }

    msg.text = phrase.word;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(msg);
  };

  const redirectButton = () => {
    if (link) {
      navigator(
        "/dictionary/searchResult/" + phrase.id + "/" + phrase.word + "/ENG_PLN"
      );
    }
  };

  return (
    <Box marginBottom={{ base: "10%", md: "4%" }}>
      <HStack key={phrase.id} marginBottom="1%" width="120%">
        <HStack onClick={redirectButton} cursor={link ? "pointer" : "default"}>
          <p>{index}.</p>
          <p>{phrase.word}</p>
        </HStack>
        <HiSpeakerWave
          size={phrase?.level ? "5%" : "5%"}
          onClick={() => {
            handleSpeak();
          }}
          cursor={"pointer"}
        />
        {phrase.part_of_speech != undefined ? (
          <Text>{"[" + phrase.part_of_speech + "]"}</Text>
        ) : null}
        {phrase.level != undefined ? (
          <button style={{ cursor: "default" }} className="tag_category">
            {phrase.level}
          </button>
        ) : null}
        {phrase.category != undefined ? (
          <button style={{ cursor: "default" }} className="tag_category">
            {phrase.category}
          </button>
        ) : null}
        <Show above="md">
          {phrase?.level ? (
            <button
              className="button_secondary"
              onClick={() => {
                if (handleAddToQuiz) handleAddToQuiz(index - 1);
              }}
              style={{ whiteSpace: "nowrap" }}
            >
              Dodaj do quizu
            </button>
          ) : null}
        </Show>
      </HStack>
      <p style={{ display: "flex", marginInline: "25px" }}>
        {phrase.definition}
      </p>
      <Show below="md">
        {phrase?.level ? (
          <button
            className="button_secondary"
            onClick={() => {
              if (handleAddToQuiz) handleAddToQuiz(index - 1);
            }}
            style={{ whiteSpace: "nowrap", margin: "3% 0% 0% 0%" }}
          >
            Dodaj do quizu
          </button>
        ) : null}
      </Show>
    </Box>
  );
};

export default TranslationTab;
