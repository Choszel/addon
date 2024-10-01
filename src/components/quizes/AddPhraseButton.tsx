import { Box, Button, HStack, Select } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import SearchInput from "../dictionary/SearchInput";
import { QuizzQuestion } from "../../pages/CQuiz";
import { Phrase } from "../../pages/DictionarySearchResult";
import EnglishTranslation from "./EnglishTranslation";

interface Props {
  language: string;
  setPhrasesData: (Phrases: QuizzQuestion[]) => void;
  savedPhrases: Phrase[];
}

const AddPhraseButton = ({ language, setPhrasesData, savedPhrases }: Props) => {
  const [dataRow, setDataRow] = useState<
    {
      id: number;
      translation_id?: number;
      word_pln?: string;
      type: string;
      category?: string;
      level?: string;
    }[]
  >([]);
  const [translationId, setTranslationId] = useState<{
    row_id: number;
    translation_id: number;
    category: string;
    level: string;
  }>();

  const handleAddTranslation = () => {
    setDataRow((dataRow) => [
      ...dataRow,
      { id: Date.now(), type: "pln_phrase" },
    ]);
  };

  const handleDeleteTranslation = (id: number) => {
    setDataRow((dataRow) => dataRow.filter((row) => row.id !== id));
  };

  const onSearch = (id: number, word_pln: string) => {
    setDataRow((dataRow) =>
      dataRow.map((row) =>
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
    setDataRow((dataRow) =>
      dataRow.map((row) =>
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

  useEffect(() => {
    setPhrasesData(
      dataRow.map((row) => ({
        translation_id: row.translation_id,
        type: row.type,
        category: row.category,
        level: row.level,
      }))
    );
  }, [dataRow]);

  return (
    <>
      <HStack marginY="2%">
        <p className="p2">Frazy</p>
        <Button
          isDisabled={dataRow.length + savedPhrases.length > 24 ? true : false}
          onClick={handleAddTranslation}
        >
          Dodaj
        </Button>
      </HStack>
      {dataRow.map((row) => (
        <HStack key={row.id} marginY="1%">
          {row?.word_pln ? (
            <>
              <Box className="question">{row?.word_pln}</Box>
              <EnglishTranslation
                word={row.word_pln ?? ""}
                setTranslationId={setTranslationId}
                rowId={row.id}
              />
              <Select
                width="25%"
                onChange={(e) => {
                  setDataRow((dataRow) =>
                    dataRow.map((r) =>
                      r.id === row.id
                        ? {
                            ...r,
                            type: e.target.value,
                          }
                        : row
                    )
                  );
                }}
              >
                <option value="pln_phrase">Polska Fraza</option>
                <option value="photo">Obrazek</option>
                <option value="pln_def">Polska definicja</option>
                <option value={language + "_def"}>Angielska definicja</option>
              </Select>
            </>
          ) : (
            <SearchInput
              language="PLN"
              onSearch={(id, word) => onSearch(row.id, word)}
            />
          )}
          <Button onClick={() => handleDeleteTranslation(row.id)}>Usuń</Button>
          <Button onClick={() => console.log("dataRow", dataRow)}>
            kliknij mnie
          </Button>
        </HStack>
      ))}
    </>
  );
};

export default AddPhraseButton;
