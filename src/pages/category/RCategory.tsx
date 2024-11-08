import ReadTemplate, {
  TableData,
} from "../../components/crud_templates/ReadTemplate";
import useCategories, { Category } from "../../hooks/useCategories";
import useHeaders from "../../hooks/useHeaders";

const RCategory = () => {
  const { data: headers } = useHeaders("categories");
  const { data, isLoading, error } = useCategories();

  const tableData: TableData<Category> = {
    title: "Wykaz kategorii",
    headers: headers,
    data: data,
    isLoading: isLoading,
    error: error,
    canCreate: true,
    canDelete: true,
    canEdit: true,
    routeName: "/category",
  };

  return <ReadTemplate {...tableData}></ReadTemplate>;
};

export default RCategory;
