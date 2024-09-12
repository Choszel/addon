import { useParams } from "react-router-dom";
import useWordsPolish from "../../hooks/useWordsPolish";
import { Image } from "@chakra-ui/react";
import useTranslationPL_ENG, {
  TranslationPL_ENG,
} from "../../hooks/useTranslationPL_ENG";
import ReadTemplate, {
  TableData,
} from "../../components/crud_templates/ReadTemplate";

const DetailsWordsPolish = () => {
  const { id } = useParams<{ id: string }>();
  const { data } = useWordsPolish(parseInt(id ?? "-1"));
  const { fetchForPLN } = useTranslationPL_ENG();
  const { data: translations } = fetchForPLN(parseInt(id ?? "-1"));

  const tableData: TableData<TranslationPL_ENG> = {
    title: "Tłumaczenia",
    headers: ["id", "word"],
    data: translations,
    canCreate: true,
    canDelete: true,
    routeName: "/translationPLNENG",
  };

  return (
    <>
      {data.map((e) => (
        <div>
          <p>{e.id}</p>
          <p>{e.word}</p>
          <p>{e.definition}</p>
          <Image src={e.photo ?? ""}></Image>
          <p>{e.category}</p>
        </div>
      ))}
      <br></br>
      <ReadTemplate {...tableData}></ReadTemplate>
    </>
  );
};

export default DetailsWordsPolish;
