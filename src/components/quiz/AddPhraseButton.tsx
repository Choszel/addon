import { Box, Button, HStack, Stack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import SearchInput from "../dictionary/SearchInput";
import { QuizzQuestion } from "../../pages/quiz/CQuiz";
import PhraseTranslation from "./PhraseTranslation";

interface Props {
  language: string;
  selectedLanguage: string;
  phraseData: QuizzQuestion[];
  setPhrasesData: (Phrases: QuizzQuestion[]) => void;
}

const AddPhraseButton = ({
  language,
  selectedLanguage,
  phraseData,
  setPhrasesData,
}: Props) => {
  const [translationId, setTranslationId] = useState<{
    row_id: number;
    translation_id: number;
    category: string;
    level: string;
  }>();

  const handleAddTranslation = () => {
    setPhrasesData([
      ...phraseData,
      { id: Date.now(), language: selectedLanguage },
    ]);
  };

  const handleDeleteTranslation = (id: number) => {
    setPhrasesData(phraseData.filter((row) => row.id !== id));
  };

  const onSearch = (id: number, word_pol: string) => {
    setPhrasesData(
      phraseData.map((row) =>
        row.id === id
          ? {
              ...row,
              word_pol: word_pol,
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
        <Stack
          key={row.id}
          marginY={{ base: "7%", md: "2%" }}
          flexWrap="wrap"
          align={{ base: "unset", md: "center" }}
          direction={{ base: "column", md: "row" }}
          id="quiz-phrase"
        >
          {row.word_pol ? (
            <>
              <Box className="question">{row.word_pol}</Box>
              <PhraseTranslation
                key={`${row.id}-${row.language}`}
                word={row.word_pol}
                setTranslationId={setTranslationId}
                rowId={row.id}
                language={row.language ?? ""}
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
        </Stack>
      ))}
    </>
  );
};

export default AddPhraseButton;
