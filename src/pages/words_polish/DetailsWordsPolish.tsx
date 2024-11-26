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
    data: translationsENG,
    isLoading: tranENGIsLoading,
    error: tranENGError,
  } = fetchForPLN("ENG", parseInt(id ?? "-1"));
  const {
    data: translationsSPA,
    isLoading: tranSPAIsLoading,
    error: tranSPAError,
  } = fetchForPLN("SPA", parseInt(id ?? "-1"));
  const [translationsData, setTranslationsData] = useState<Translation[]>();
  const { postData: postTranslations } = actionData("/translationPLN_");
  const navigate = useNavigate();

  const handleSave = async () => {
    translationsData?.forEach((element) => {
      const translation = new URLSearchParams();
      translation.append("language", element.language ?? "");
      translation.append("word_polish_id", data[0].id.toString());
      translation.append("word_second_id", element.id?.toString() ?? "");
      postTranslations(translation);
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

  const tableDataENG: TableData<TranslationPL_> = {
    title: "Tłumaczenia angielskie",
    headers: ["id", "word"],
    data: translationsENG,
    canDelete: true,
    routeName: "/translationPLN_?language=ENG",
    isLoading: tranENGIsLoading,
    error: tranENGError,
  };
  const tableDataSPA: TableData<TranslationPL_> = {
    title: "Tłumaczenia hiszpańskie",
    headers: ["id", "word"],
    data: translationsSPA,
    canDelete: true,
    routeName: "/translationPLN_?language=SPA",
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
    isLoading: tranSPAIsLoading,
    error: tranSPAError,
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
      <ReadTemplate {...tableDataENG}></ReadTemplate>
      <br></br>
      <br></br>
      <ReadTemplate {...tableDataSPA}></ReadTemplate>
    </>
  );
};

export default DetailsWordsPolish;
