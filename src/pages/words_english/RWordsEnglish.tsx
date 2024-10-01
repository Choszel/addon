import useWordsEnglish, { EnglishWord } from "../../hooks/useWordsEnglish";
import ReadTemplate, {
  TableData,
} from "../../components/crud_templates/ReadTemplate";

const RWordsEnglish = () => {
  const { fetchAllDetailed } = useWordsEnglish();
  const { data } = fetchAllDetailed();
  const headers = ["id", "word", "category", "level", "part of speech"];

  const tableData: TableData<EnglishWord> = {
    title: "Wykaz Angielskich słów",
    headers: headers,
    data: data,
    canCreate: true,
    canDelete: true,
    canEdit: true,
    details: true,
    routeName: "/wordsEnglish",
  };

  return <ReadTemplate {...tableData}></ReadTemplate>;
};

export default RWordsEnglish;
