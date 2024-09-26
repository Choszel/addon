import { HStack } from "@chakra-ui/react";
import { Phrase } from "../../pages/DictionarySearchResult";
import { useNavigate } from "react-router-dom";

interface Props {
  phrase: Phrase;
  index: number;
  link?: boolean;
  handleAddToQuiz: (id: number) => void;
}

const TranslationTab = ({ phrase, index, link, handleAddToQuiz }: Props) => {
  const navigator = useNavigate();
  const redirectButton = () => {
    if (link) {
      navigator(
        "/dictionary/searchResult/" + phrase.id + "/" + phrase.word + "/ENG_PLN"
      );
    }
  };

  return (
    <div style={{ marginBottom: "2%" }}>
      <HStack key={phrase.id} marginBottom="1%">
        <HStack onClick={redirectButton} cursor={link ? "pointer" : "default"}>
          <p>{index}.</p>
          <p>{phrase.word}</p>
        </HStack>
        {phrase.level != undefined ? (
          <button style={{ cursor: "default" }} className="gradient_button">
            {phrase.level}
          </button>
        ) : null}
        {phrase.category != undefined ? (
          <button style={{ cursor: "default" }} className="gradient_button">
            {phrase.category}
          </button>
        ) : null}
        {phrase?.level ? (
          <button
            className="add_to_quiz_button"
            onClick={() => handleAddToQuiz(index - 1)}
          >
            Dodaj do quizu
          </button>
        ) : null}
      </HStack>
      <p style={{ display: "flex", marginInline: "25px" }}>
        {phrase.definition}
      </p>
    </div>
  );
};

export default TranslationTab;
