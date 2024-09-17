import ReadTemplate, {
  TableData,
} from "../../components/crud_templates/ReadTemplate";
import useMissingPhrases, {
  MissingPhrase,
} from "../../hooks/useMissingPhrases";

const RMissingPhrases = () => {
  const { data } = useMissingPhrases();

  const headers = ["id", "phrase", "code", "level", "category", "login"];

  const tableData: TableData<MissingPhrase> = {
    title: "Wykaz brakujących fraz",
    headers: headers,
    data: data,
    canDelete: true,
    details: true,
    routeName: "/missingPhrases",
  };

  return <ReadTemplate {...tableData}></ReadTemplate>;
};

export default RMissingPhrases;
