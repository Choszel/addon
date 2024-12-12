import { Button, HStack, useToast } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import SearchInput from "./SearchInput";
import useLanguages from "../../hooks/useLanguages";
import { Translation } from "../../pages/words_polish/CWordsPolish";

interface Props {
  langugeOption?: boolean;
  setTranslationsData: (translations: Translation[]) => void;
}

const AddTranslationButton = ({
  langugeOption,
  setTranslationsData,
}: Props) => {
  const [dataRow, setDataRow] = useState<
    { id: number; wordId?: number; word?: string; language: string }[]
  >([]);
  const localRefs = useRef<{
    [key: number]: { languageRef?: HTMLSelectElement | null };
  }>({});
  const { data: languages } = useLanguages();
  const toast = useToast();

  const handleAddTranslation = () => {
    setDataRow((dataRow) => [
      ...dataRow,
      { id: Date.now(), language: langugeOption ? "ENG" : "POL" },
    ]);
  };

  useEffect(() => {
    console.log("dataRow", dataRow);
  }, [dataRow]);

  const handleDeleteTranslation = (id: number) => {
    setDataRow((dataRow) => dataRow.filter((row) => row.id !== id));
    delete localRefs.current[id];
  };

  const onSearch = (
    id: number,
    word: string,
    wordId: number,
    language: string
  ) => {
    if (dataRow.find((e) => e.language == language && e.wordId == wordId)) {
      toast({
        title: "Element już został podany",
        status: "error",
        position: "bottom-right",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    setDataRow((dataRow) =>
      dataRow.map((row) =>
        row.id === id
          ? { ...row, word, wordId: wordId, language: language }
          : row
      )
    );
  };

  useEffect(() => {
    setTranslationsData(
      dataRow.map((row) => ({
        id: row.wordId,
        word: row.word,
        language: row.language,
      }))
    );
  }, [dataRow]);

  return (
    <>
      <HStack margin="4% 2% 2% 2%">
        <p className="p2">Tłumaczenia</p>
        <button className="button_secondary" onClick={handleAddTranslation}>
          Dodaj
        </button>
      </HStack>
      {dataRow.map((row) => (
        <HStack key={row.id} margin="2%">
          {langugeOption && (
            <select
              style={{ width: "20%" }}
              className="select-primary"
              value={row.language}
              disabled={row.wordId != null}
              onChange={(e) => {
                setDataRow((dataRow) =>
                  dataRow.map((r) =>
                    r.id === row.id ? { ...r, language: e.target.value } : r
                  )
                );
              }}
            >
              {languages.map((language) =>
                language.code != "POL" ? (
                  <option value={language.code} key={language.id}>
                    {language.code}
                  </option>
                ) : null
              )}
            </select>
          )}
          <div style={{ marginInline: "1%" }}>
            {row.word ? (
              <div key={row.id}>{row.word}</div>
            ) : (
              <SearchInput
                key={row.language}
                language={row.language}
                onSearch={(id, word) =>
                  onSearch(row.id, word, id, row.language)
                }
              />
            )}
          </div>
          <Button
            colorScheme="red"
            onClick={() => handleDeleteTranslation(row.id)}
          >
            Usuń
          </Button>
        </HStack>
      ))}
    </>
  );
};

export default AddTranslationButton;
