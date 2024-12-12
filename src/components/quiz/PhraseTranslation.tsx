import { Box } from "@chakra-ui/react";
import useTranslationPL_ from "../../hooks/useTranslationPL_";
import { useEffect } from "react";

interface Props {
  word: string;
  rowId: number;
  language: string;
  setTranslationId: (value: {
    row_id: number;
    translation_id: number;
    category: string;
    level: string;
  }) => void;
}

const PhraseTranslation = ({
  word,
  rowId,
  setTranslationId,
  language,
}: Props) => {
  const { fetchForPOLWord } = useTranslationPL_();
  const { data: PhraseTranslations } = fetchForPOLWord(language, word);

  useEffect(() => {
    console.log("PhraseTranslations", PhraseTranslations);
    setTranslationId({
      row_id: rowId,
      translation_id: PhraseTranslations[0]?.translation_id ?? 0,
      category: PhraseTranslations[0]?.category,
      level: PhraseTranslations[0]?.level ?? "",
    });
  }, [PhraseTranslations]);

  return (
    <Box className="question">
      <select
        className="select-primary"
        name="select-phrase"
        onChange={(e) => {
          const selectedPhrase = PhraseTranslations.find(
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
        {PhraseTranslations.map((et) => (
          <option value={et.id} key={et.id}>
            {et.word}
          </option>
        ))}
      </select>
    </Box>
  );
};

export default PhraseTranslation;
