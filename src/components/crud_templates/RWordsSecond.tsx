import ReadTemplate, {
  TableData,
} from "../../components/crud_templates/ReadTemplate";
import { SecondWord } from "../../hooks/useWordsSecond";
import useWordsSecond from "../../hooks/useWordsSecond";

interface Props {
  routeName: string;
  titlePart: string;
  code: string;
}

const RWordsSecond = ({ routeName, titlePart, code }: Props) => {
  const { fetchAllDetailed } = useWordsSecond(code);
  const { data, isLoading, error } = fetchAllDetailed();
  const headers = ["id", "word", "category", "level", "part of speech"];

  const tableData: TableData<SecondWord> = {
    title: "Wykaz " + titlePart + " fraz",
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
