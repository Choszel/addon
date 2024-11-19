import { HStack, Stack, Text, VStack } from "@chakra-ui/react";
import { Phrase } from "../../pages/DictionarySearchResult";
import { useNavigate } from "react-router-dom";
import { HiSpeakerWave } from "react-icons/hi2";

interface Props {
  phrase: Phrase;
  index: number;
  link?: boolean;
  handleAddToQuiz?: (id: number) => void;
  language: string;
}

const TranslationTab = ({
  phrase,
  index,
  link,
  handleAddToQuiz,
  language,
}: Props) => {
  const navigator = useNavigate();
  const msg = new SpeechSynthesisUtterance();

  const handleSpeak = () => {
    msg.lang = language;

    const voices = speechSynthesis
      .getVoices()
      .filter((voice) => voice.lang === language);
    msg.voice = voices[1];

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
    <VStack marginBottom={{ base: "10%", md: "4%" }}>
      <Stack
        key={phrase.id}
        marginBottom="1%"
        direction={{ base: "column", md: "row" }}
        justify="center"
        align="center"
      >
        <HStack>
          <HStack
            onClick={redirectButton}
            cursor={link ? "pointer" : "default"}
          >
            <p>{index}.</p>
            <p>{phrase.word}</p>
          </HStack>

          <HiSpeakerWave
            size={phrase?.level ? "40px" : "40px"}
            onClick={() => {
              handleSpeak();
            }}
            cursor={"pointer"}
          />
          {phrase.part_of_speech != undefined ? (
            <Text>{"[" + phrase.part_of_speech + "]"}</Text>
          ) : null}
        </HStack>

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
              if (handleAddToQuiz) handleAddToQuiz(index - 1);
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
