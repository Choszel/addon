import { Box, Text } from "@chakra-ui/react";
import { useState } from "react";

interface Props {
  phrase: string;
  inLanguage: string;
}

const SimilarPhrases = ({ phrase, inLanguage }: Props) => {
  const [similarPhrases, setSimilarPhrases] = useState<string>("Ładowanie...");
  const [send, setSend] = useState<boolean>(false);

  const loadSimilarPhrases = async () => {
    setSend(true);
    const prompt = {
      inputText: phrase,
      inLanguage: inLanguage,
    };
    const result = await fetch("http://localhost:3001/api/ai/similarPhrases", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(prompt),
    });

    if (result.ok) {
      const airespond = await result.json();
      setSimilarPhrases(airespond.analysis);
      console.log(airespond.analysis);
    } else {
      setSimilarPhrases("Error");
    }
  };

  return (
    <Box width={{ base: "100%", md: "40%" }}>
      {send == false ? (
        <button className="button_primary" onClick={loadSimilarPhrases}>
          Wczytaj podobne zwroty
        </button>
      ) : (
        <Text whiteSpace="pre-line">{similarPhrases}</Text>
      )}
    </Box>
  );
};

export default SimilarPhrases;
