import { useNavigate, useParams } from "react-router-dom";
import useWordsEnglish from "../../hooks/useWordsEnglish";
import useTranslationPL_ENG, {
  TranslationPL_ENG,
} from "../../hooks/useTranslationPL_ENG";
import ReadTemplate, {
  TableData,
} from "../../components/crud_templates/ReadTemplate";
import AddTranslationButton from "../../components/dictionary/AddTranslationButton";
import { Button, HStack, Spinner, Text } from "@chakra-ui/react";
import actionData from "../../hooks/actionData";
import { useState } from "react";
import { Translation } from "../words_polish/CWordsPolish";
import GoBack from "../../components/GoBack";

const DetailsWordsEnglish = () => {
  const { id } = useParams<{ id: string }>();
  const { fetchAllDetailed } = useWordsEnglish(parseInt(id ?? "-1"));
  const { data, isLoading, error } = fetchAllDetailed();
  const { fetchForENG } = useTranslationPL_ENG();
  const {
    data: translations,
    isLoading: tranIsLoading,
    error: tranError,
  } = fetchForENG(parseInt(id ?? "-1"));
  const [translationsData, setTranslationsData] = useState<Translation[]>();
  const { postData: postTranslations } = actionData("/translationPLNENG");
  const navigate = useNavigate();

  const handleSave = async () => {
    console.log("translationData:", translationsData);

    translationsData?.forEach((element) => {
      const translation = new URLSearchParams();
      switch (element.language) {
        default:
          translation.append("words_polish_id", element.id?.toString() ?? "");
          translation.append("words_english_id", data[0].id.toString());
          postTranslations(translation);
          break;
      }
      console.log("Po dodaniu tłumaczenia");
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

  const tableData: TableData<TranslationPL_ENG> = {
    title: "Tłumaczenia",
    headers: ["id", "word"],
    data: translations,
    canDelete: true,
    routeName: "/translationPLNENG",
    others: (
      <>
        <AddTranslationButton setTranslationsData={setTranslationsData} />
        <Button onClick={handleSave}>Zapisz</Button>
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
        <HStack spacing="15%" marginX="2%" marginTop="1%">
          <div
            key={e.id}
            style={{ textAlign: "left", justifyContent: "space-between" }}
          >
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
            <p>
              <strong>Poziom trudności:</strong> {e.level}
            </p>
            <p>
              <strong>Część mowy:</strong> {e.part_of_speech}
            </p>
          </div>
        </HStack>
      ))}
      <br></br>
      <ReadTemplate {...tableData}></ReadTemplate>
    </>
  );
};

export default DetailsWordsEnglish;
