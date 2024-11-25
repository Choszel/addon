import { useNavigate, useParams } from "react-router-dom";
import useWordsPolish from "../../hooks/useWordsPolish";
import useTranslationPL_, {
  TranslationPL_,
} from "../../hooks/useTranslationPL_";
import ReadTemplate, {
  TableData,
} from "../../components/crud_templates/ReadTemplate";
import getCroppedImageUrl from "../../services/image-url";
import { Button, Image, Spinner, Stack, Text } from "@chakra-ui/react";
import AddTranslationButton from "../../components/dictionary/AddTranslationButton";
import { useState } from "react";
import { Translation } from "./CWordsPolish";
import actionData from "../../hooks/actionData";
import GoBack from "../../components/GoBack";

const DetailsWordsPolish = () => {
  const { id } = useParams<{ id: string }>();
  const { fetchWords } = useWordsPolish();
  const { data, isLoading, error } = fetchWords(parseInt(id ?? "-1"));
  const { fetchForPLN } = useTranslationPL_();
  const {
    data: translations,
    isLoading: tranIsLoading,
    error: tranError,
  } = fetchForPLN("ENG", parseInt(id ?? "-1"));
  const [translationsData, setTranslationsData] = useState<Translation[]>();
  const { postData: postTranslations } = actionData("/translationPLNENG");
  const navigate = useNavigate();

  const handleSave = async () => {
    translationsData?.forEach((element) => {
      const translation = new URLSearchParams();
      switch (element.language) {
        default:
          translation.append("word_polish_id", data[0].id.toString());
          translation.append("word_english_id", element.id?.toString() ?? "");
          postTranslations(translation);
          break;
      }
    });

    return window.location.reload();
  };

  if (isLoading) return <Spinner size="xl" />;
  if (error)
    return (
      <>
        <GoBack
          goBack={() => {
            navigate("/wordsPolish");
          }}
        ></GoBack>
        <Text color="var(--error)">{error}</Text>
      </>
    );

  const tableData: TableData<TranslationPL_> = {
    title: "Tłumaczenia",
    headers: ["id", "word"],
    data: translations,
    canDelete: true,
    routeName: "/translationPLNENG",
    others: (
      <>
        <AddTranslationButton
          langugeOption
          setTranslationsData={setTranslationsData}
        />
        <Button
          colorScheme="blue"
          onClick={handleSave}
          marginY={{ base: "5%", md: "0%" }}
        >
          Zapisz zmiany
        </Button>
      </>
    ),
    isLoading: tranIsLoading,
    error: tranError,
  };

  return (
    <>
      <GoBack
        goBack={() => {
          navigate("/wordsPolish");
        }}
      ></GoBack>
      {data.map((e) => (
        <Stack
          spacing="15%"
          marginX="2%"
          direction={{ base: "column", md: "row" }}
          marginY={{ base: "5%", md: "2%" }}
          key={"stack" + e.id}
        >
          <div key={e.id} style={{ textAlign: "left" }}>
            <p>
              <strong>ID:</strong> {e.id}
            </p>
            <p>
              <strong>Słowo:</strong> {e.word}
            </p>
            <p>
              <strong>Definicja:</strong> {e.definition}
            </p>
            <p>
              <strong>Kategoria:</strong> {e.category}
            </p>
          </div>
          <Image
            boxSize={{ base: "60%", md: "20%" }}
            src={getCroppedImageUrl(e.photo)}
            borderRadius="20px"
          ></Image>
        </Stack>
      ))}
      <br></br>
      <ReadTemplate {...tableData}></ReadTemplate>
    </>
  );
};

export default DetailsWordsPolish;
