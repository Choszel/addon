import { Box } from "@chakra-ui/react";
import useTranslationPL_ENG from "../../hooks/useTranslationPL_ENG";
import { useEffect } from "react";

interface Props {
  word: string;
  rowId: number;
  setTranslationId: (value: {
    row_id: number;
    translation_id: number;
    category: string;
    level: string;
  }) => void;
}

const EnglishTranslation = ({ word, rowId, setTranslationId }: Props) => {
  const { fetchForPLNWord } = useTranslationPL_ENG();
  const { data: englishTranslations } = fetchForPLNWord(word);

  useEffect(() => {
    setTranslationId({
      row_id: rowId,
      translation_id: englishTranslations[0]?.translation_id ?? 0,
      category: englishTranslations[0]?.category,
      level: englishTranslations[0]?.level,
    });
  }, [englishTranslations]);

  return (
    <Box className="question">
      <select
        className="select-primary"
        onChange={(e) => {
          const selectedPhrase = englishTranslations.find(
            (et) => et.id == parseInt(e.target.value)
          );
          setTranslationId({
            row_id: rowId,
            translation_id: selectedPhrase?.translation_id ?? 0,
            category: selectedPhrase?.category ?? "",
            level: selectedPhrase?.level ?? "",
          });
        }}
        key={rowId}
      >
        {englishTranslations.map((et) => (
          <option value={et.id} key={et.id}>
            {et.word}
          </option>
        ))}
      </select>
    </Box>
  );
};

export default EnglishTranslation;
