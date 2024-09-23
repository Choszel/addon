import { useParams } from "react-router-dom";
import useWordsPolish from "../../hooks/useWordsPolish";
import useTranslationPL_ENG, {
  TranslationPL_ENG,
} from "../../hooks/useTranslationPL_ENG";
import ReadTemplate, {
  TableData,
} from "../../components/crud_templates/ReadTemplate";
import getCroppedImageUrl from "../../services/image-url";
import { Button, Image } from "@chakra-ui/react";
import AddTranslationButton from "../../components/dictionary/AddTranslationButton";
import { useState } from "react";
import { Translation } from "./CWordsPolish";
import actionData from "../../hooks/actionData";

const DetailsWordsPolish = () => {
  const { id } = useParams<{ id: string }>();
  const { fetchWords } = useWordsPolish();
  const { data } = fetchWords(parseInt(id ?? "-1"));
  const { fetchForPLN } = useTranslationPL_ENG();
  const { data: translations } = fetchForPLN(parseInt(id ?? "-1"));
  const [translationsData, setTranslationsData] = useState<Translation[]>();
  const { postData: postTranslations } = actionData("/translationPLNENG");

  const handleSave = async () => {
    console.log("translationData:", translationsData);

    translationsData?.forEach((element) => {
      const translation = new URLSearchParams();
      switch (element.language) {
        default:
          translation.append("words_polish_id", data[0].id.toString());
          translation.append("words_english_id", element.id?.toString() ?? "");
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
        <AddTranslationButton
          langugeOption
          setTranslationsData={setTranslationsData}
        />
        <Button onClick={handleSave}>Zapisz</Button>
      </>
    ),
  };

  return (
    <>
      {data.map((e) => (
        <div key={e.id}>
          <p>{e.id}</p>
          <p>{e.word}</p>
          <p>{e.definition}</p>
          <Image boxSize="20%" src={getCroppedImageUrl(e.photo)}></Image>
          <p>{e.category}</p>
        </div>
      ))}
      <br></br>
      <ReadTemplate {...tableData}></ReadTemplate>
    </>
  );
};

export default DetailsWordsPolish;
