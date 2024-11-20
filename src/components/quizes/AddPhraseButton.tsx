import { Box, Button, HStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import SearchInput from "../dictionary/SearchInput";
import { QuizzQuestion } from "../../pages/quiz/CQuiz";
import EnglishTranslation from "./EnglishTranslation";

interface Props {
  language: string;
  phraseData: QuizzQuestion[];
  setPhrasesData: (Phrases: QuizzQuestion[]) => void;
}

const AddPhraseButton = ({ language, phraseData, setPhrasesData }: Props) => {
  const [translationId, setTranslationId] = useState<{
    row_id: number;
    translation_id: number;
    category: string;
    level: string;
  }>();

  const handleAddTranslation = () => {
    setPhrasesData([...phraseData, { id: Date.now() }]);
  };

  const handleDeleteTranslation = (id: number) => {
    setPhrasesData(phraseData.filter((row) => row.id !== id));
  };

  const onSearch = (id: number, word_pln: string) => {
    setPhrasesData(
      phraseData.map((row) =>
        row.id === id
          ? {
              ...row,
              word_pln: word_pln,
            }
          : row
      )
    );
  };

  useEffect(() => {
    setPhrasesData(
      phraseData.map((row) =>
        row.id === translationId?.row_id
          ? {
              ...row,
              translation_id: translationId.translation_id,
              category: translationId.category,
              level: translationId.level,
            }
          : row
      )
    );
  }, [translationId]);

  return (
    <>
      <HStack marginY="2%">
        <p className="p2">Frazy</p>
        <button
          onClick={handleAddTranslation}
          disabled={phraseData.length > 25}
          className="button_secondary"
        >
          Dodaj
        </button>
      </HStack>
      {phraseData.map((row) => (
        <HStack key={row.id} marginY="1%">
          {row.word_pln ? (
            <>
              <Box className="question">{row.word_pln}</Box>
              <EnglishTranslation
                word={row.word_pln}
                setTranslationId={setTranslationId}
                rowId={row.id}
              />
            </>
          ) : (
            <SearchInput
              language={language}
              onSearch={(id, word) => onSearch(row.id, word)}
            />
          )}
          <Button
            onClick={() => handleDeleteTranslation(row.id)}
            colorScheme="red"
          >
            Usuń
          </Button>
        </HStack>
      ))}
    </>
  );
};

export default AddPhraseButton;
