import { useNavigate, useParams } from "react-router-dom";
import useTranslationPL_, {
  TranslationPL_,
} from "../../hooks/useTranslationPL_";
import { useState } from "react";
import { Translation } from "../../pages/words_polish/CWordsPolish";
import actionData from "../../hooks/actionData";
import { Button, Spinner, Stack, Text } from "@chakra-ui/react";
import GoBack from "../GoBack";
import ReadTemplate, { TableData } from "./ReadTemplate";
import AddTranslationButton from "../dictionary/AddTranslationButton";
import useWordsSecond from "../../hooks/useWordsSecond";

interface Props {
  routeName: string;
  code: string;
}

const DetailsWordsSecond = ({ routeName, code }: Props) => {
  const { id } = useParams<{ id: string }>();
  const { fetchFor_ } = useTranslationPL_();
  const {
    data: translations,
    isLoading: tranIsLoading,
    error: tranError,
  } = fetchFor_(code, parseInt(id ?? ""));
  const [translationsData, setTranslationsData] = useState<Translation[]>();
  const { postData: postTranslations } = actionData("/translationPOL_");
  const navigate = useNavigate();
  const { fetchAllDetailed } = useWordsSecond(code, parseInt(id ?? "-1"));
  const { data, isLoading, error } = fetchAllDetailed();

  const handleSave = async () => {
    translationsData?.forEach((element) => {
      const translation = new URLSearchParams();
      switch (element.language) {
        default:
          translation.append("language", code);
          translation.append("word_polish_id", element.id?.toString() ?? "");
          translation.append("word_second_id", data[0].id.toString());
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
            navigate(routeName);
          }}
        ></GoBack>
        <Text color="var(--error)">{error}</Text>
      </>
    );

  const tableData: TableData<TranslationPL_> = {
    title: "Tłumaczenia",
    headers: ["id", "word_polish"],
    data: translations,
    canDelete: true,
    routeName: "/translationPOL_?language=" + code,
    others: (
      <>
        <AddTranslationButton setTranslationsData={setTranslationsData} />
        <Button
          colorScheme="blue"
          onClick={handleSave}
          marginY={{ base: "5%", md: "2%" }}
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
          navigate(routeName);
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
          <div style={{ textAlign: "left", justifyContent: "space-between" }}>
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
        </Stack>
      ))}
      <br></br>
      <ReadTemplate {...tableData}></ReadTemplate>
    </>
  );
};

export default DetailsWordsSecond;
