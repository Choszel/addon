import ReadTemplate, {
  TableData,
} from "../../components/crud_templates/ReadTemplate";
import useHeaders from "../../hooks/useHeaders";
import useStories, { Story } from "../../hooks/useStories";

const RStories = () => {
  const { data: headers } = useHeaders("stories");
  const { fetchStories } = useStories();
  const { data, isLoading, error } = fetchStories();

  const tableData: TableData<Story> = {
    title: "Wykaz historii",
    headers: headers,
    data: data,
    isLoading: isLoading,
    error: error,
    canCreate: true,
    canDelete: true,
    routeName: "/stories",
  };
  return <ReadTemplate {...tableData} />;
};

export default RStories;
