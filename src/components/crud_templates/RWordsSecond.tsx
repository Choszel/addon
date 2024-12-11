import ReadTemplate, {
  TableData,
} from "../../components/crud_templates/ReadTemplate";
import { SecondWord } from "../../hooks/useWordsEnglish";

interface Props {
  routeName: string;
  titlePart: string;
  fetchAllDetailed: () => {
    data: SecondWord[];
    isLoading: boolean;
    error: string;
  };
}

const RWordsSecond = ({ routeName, titlePart, fetchAllDetailed }: Props) => {
  const { data, isLoading, error } = fetchAllDetailed();
  const headers = ["id", "word", "category", "level", "part of speech"];

  const tableData: TableData<SecondWord> = {
    title: "Wykaz " + titlePart + " słów",
    headers: headers,
    data: data,
    isLoading: isLoading,
    error: error,
    canCreate: true,
    canDelete: true,
    canEdit: true,
    details: true,
    routeName: routeName,
  };

  return <ReadTemplate {...tableData}></ReadTemplate>;
};

export default RWordsSecond;
