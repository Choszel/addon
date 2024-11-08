import ReadTemplate, {
  TableData,
} from "../../components/crud_templates/ReadTemplate";
import useDifficultyLevels, {
  DifficultyLevel,
} from "../../hooks/useDifficultyLevels";
import useHeaders from "../../hooks/useHeaders";

const RDifficultyLevel = () => {
  const { data: headers } = useHeaders("difficulty_levels");
  const { data, isLoading, error } = useDifficultyLevels();

  const tableData: TableData<DifficultyLevel> = {
    title: "Wykaz poziomów trudności",
    headers: headers,
    data: data,
    isLoading: isLoading,
    error: error,
  };
  return <ReadTemplate {...tableData}></ReadTemplate>;
};

export default RDifficultyLevel;
