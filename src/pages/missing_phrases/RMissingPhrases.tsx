import useHeaders from "../../hooks/useHeaders";
import ReadTemplate, {
  TableData,
} from "../../components/crud_templates/ReadTemplate";
import useMissingPhrases, {
  MissingPhrase,
} from "../../hooks/useMissingPhrases";

const RMissingPhrases = () => {
  const { data: headers } = useHeaders("missing_phrases");
  const { data } = useMissingPhrases();

  const tableData: TableData<MissingPhrase> = {
    title: "Wykaz brakujących fraz",
    headers: headers,
    data: data,
  };
  return <ReadTemplate {...tableData}></ReadTemplate>;
};

export default RMissingPhrases;
