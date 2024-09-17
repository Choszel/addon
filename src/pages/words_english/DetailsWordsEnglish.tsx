import { useParams } from "react-router-dom";
import useWordsEnglish from "../../hooks/useWordsEnglish";
import useTranslationPL_ENG, {
  TranslationPL_ENG,
} from "../../hooks/useTranslationPL_ENG";
import ReadTemplate, {
  TableData,
} from "../../components/crud_templates/ReadTemplate";
import AddTranslationButton from "../../components/AddTranslationButton";
import { Button } from "@chakra-ui/react";
import actionData from "../../hooks/actionData";
import { useState } from "react";
import { Translation } from "../words_polish/CWordsPolish";

const DetailsWordsEnglish = () => {
  const { id } = useParams<{ id: string }>();
  const { data } = useWordsEnglish(parseInt(id ?? "-1"));
  const { fetchForENG } = useTranslationPL_ENG();
  const { data: translations } = fetchForENG(parseInt(id ?? "-1"));
  const [translationsData, setTranslationsData] = useState<Translation[]>();
  const { postData: postTranslations } = actionData("/translationPLNENG");

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
  };

  return (
    <>
      {data.map((e) => (
        <div>
          <p>{e.id}</p>
          <p>{e.word}</p>
          <p>{e.definition}</p>
          <p>{e.level}</p>
          <p>{e.category}</p>
        </div>
      ))}
      <br></br>
      <ReadTemplate {...tableData}></ReadTemplate>
    </>
  );
};

export default DetailsWordsEnglish;
