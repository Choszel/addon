import { HStack } from "@chakra-ui/react";
import { Phrase } from "../pages/DictionarySearchResult";

const TranslationTab = ({
  phrase,
  index,
}: {
  phrase: Phrase;
  index: number;
}) => {
  return (
    <div style={{ marginBottom: "2%" }}>
      <HStack key={phrase.id} marginBottom="1%">
        <p>{index}.</p>
        <p>{phrase.word}</p>
        {phrase.level != undefined ? (
          <button style={{ cursor: "default" }} className="gradient_button">
            {phrase.level}
          </button>
        ) : null}
        <button style={{ cursor: "default" }} className="gradient_button">
          {phrase.category}
        </button>
        <button className="add_to_quiz_button">Dodaj do quizu</button>
      </HStack>
      <p style={{ display: "flex", marginInline: "25px" }}>
        {phrase.definition}
      </p>
    </div>
  );
};

export default TranslationTab;
