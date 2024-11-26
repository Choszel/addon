import useWordsSpanish from "../../hooks/useWordsSpanish";
import ReadTemplate, {
  TableData,
} from "../../components/crud_templates/ReadTemplate";
import { SecondWord } from "../../hooks/useWordsEnglish";

const RWordsSpanish = () => {
  const { fetchAllDetailed } = useWordsSpanish();
  const { data, isLoading, error } = fetchAllDetailed();
  const headers = ["id", "word", "category", "level", "part of speech"];

  const tableData: TableData<SecondWord> = {
    title: "Wykaz Hiszpańskich słów",
    headers: headers,
    data: data,
    isLoading: isLoading,
    error: error,
    canCreate: true,
    canDelete: true,
    canEdit: true,
    details: true,
    routeName: "/wordsSpanish",
  };

  return <ReadTemplate {...tableData}></ReadTemplate>;
};

export default RWordsSpanish;
