import { useParams } from "react-router-dom";
import useWordsEnglish from "../../hooks/useWordsEnglish";
import useTranslationPL_ENG, {
  TranslationPL_ENG,
} from "../../hooks/useTranslationPL_ENG";
import ReadTemplate, {
  TableData,
} from "../../components/crud_templates/ReadTemplate";

const DetailsWordsEnglish = () => {
  const { id } = useParams<{ id: string }>();
  const { data } = useWordsEnglish(parseInt(id ?? "-1"));
  const { fetchForENG } = useTranslationPL_ENG();
  const { data: translations } = fetchForENG(parseInt(id ?? "-1"));

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
