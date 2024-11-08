import ReadTemplate, {
  TableData,
} from "../../components/crud_templates/ReadTemplate";
import useMissingPhrases, {
  MissingPhrase,
} from "../../hooks/useMissingPhrases";

const RMissingPhrases = () => {
  const { data, isLoading, error } = useMissingPhrases();

  const headers = ["id", "phrase", "code", "level", "category", "user"];

  const tableData: TableData<MissingPhrase> = {
    title: "Wykaz brakujących fraz",
    headers: headers,
    data: data,
    canDelete: true,
    details: true,
    routeName: "/missingPhrases",
    isLoading: isLoading,
    error: error,
  };

  return <ReadTemplate {...tableData}></ReadTemplate>;
};

export default RMissingPhrases;
