import ReadTemplate, {
  TableData,
} from "../../components/crud_templates/ReadTemplate";
import useWordsPolish, { PolishWord } from "../../hooks/useWordsPolish";

const RWordsPolish = () => {
  const { fetchWords } = useWordsPolish();
  const { data, isLoading, error } = fetchWords();

  const tableData: TableData<PolishWord> = {
    title: "Wykaz Polskich fraz",
    headers: ["id", "word", "category", "definition"],
    data: data,
    isLoading: isLoading,
    error: error,
    canCreate: true,
    canDelete: true,
    canEdit: true,
    details: true,
    routeName: "/wordsPolish",
  };

  return <ReadTemplate {...tableData}></ReadTemplate>;
};

export default RWordsPolish;
