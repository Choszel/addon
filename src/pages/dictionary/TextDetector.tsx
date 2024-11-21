import { ChangeEvent, useEffect, useRef, useState } from "react";
import Tesseract from "tesseract.js";
import GoBack from "../../components/GoBack";
import { useNavigate } from "react-router-dom";
import { Box, Stack, Text } from "@chakra-ui/react";
import SelectLanguage from "../../components/SelectLanguage";
import TextTranslator from "../../components/quiz/TextTranslator";

const TextDetector = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [recognizedText, setRecognizedText] = useState<string>("");
  const [textLanguage, setTextLanguage] = useState<string>("ENG");
  const [translateLanguage, setTranslateLanguage] = useState<string>("ENG");
  const translationRef = useRef<HTMLSpanElement | null>(null);
  const navigate = useNavigate();

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const image = event.target.files[0];
      setSelectedImage(URL.createObjectURL(image));
    }
  };

  const recognizeText = async () => {
    if (selectedImage) {
      setRecognizedText("Tłumaczenie...");
      const result = await Tesseract.recognize(selectedImage);
      setRecognizedText(result.data.text);
    }
  };

  useEffect(() => {}, [textLanguage]);

  useEffect(() => {
    let position = { x: 0, y: 0 };

    if (translationRef.current) {
      translationRef.current.style.left = `${position.x - 10}px`;
      translationRef.current.style.top = `${position.y - 75}px`;
      translationRef.current.classList.toggle("show", !!recognizedText);
    }
  }, [recognizedText]);

  return (
    <>
      <GoBack
        goBack={() => {
          navigate("/dictionary");
        }}
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => handleImageUpload(e)}
        className="button_primary"
      />
      <Box justifySelf="center" marginY={"2%"}>
        {selectedImage && (
          <img
            src={selectedImage}
            alt="Selected"
            style={{ maxHeight: "500px" }}
          />
        )}
      </Box>
      <Stack direction="row" marginY="2%" align="center">
        <Text> Język, w którym jest podany tekst:</Text>
        <SelectLanguage setSelectedLanguage={setTextLanguage} />
      </Stack>
      <Stack direction="row" marginY="2%" align="center">
        <Text> Język, na który ma zostać przetłumaczona fraza:</Text>
        <SelectLanguage setSelectedLanguage={setTranslateLanguage} />
      </Stack>
      <button className="button_primary" onClick={() => recognizeText()}>
        Tłumacz
      </button>
      <Stack
        direction="column"
        justify="center"
        align="center"
        marginY={{ base: "10%", md: "unset" }}
        spacing={2}
      >
        <Stack>
          <p className="p2">Rozpoznany tekst:</p>
          <p>{recognizedText}</p>
        </Stack>
        {textLanguage == translateLanguage && (
          <Text color="var(--error)">Proszę podać dwa różne języki</Text>
        )}
        {textLanguage != translateLanguage && selectedImage && (
          <Stack marginY={"2%"}>
            <p className="p2">Przetłumaczony tekst:</p>
            <TextTranslator
              text={recognizedText}
              inLanguage={textLanguage.slice(0, 3)}
              outLanguage={translateLanguage.slice(0, 3)}
            />
          </Stack>
        )}
      </Stack>
    </>
  );
};

export default TextDetector;
