import { useNavigate } from "react-router-dom";
import ReadTemplate, {
  TableData,
} from "../../components/crud_templates/ReadTemplate";
import useCategories, { Category } from "../../hooks/useCategories";
import useHeaders from "../../hooks/useHeaders";

const RCategory = () => {
  const { data: headers } = useHeaders("categories");
  const { data: categoriesData } = useCategories();
  const navigate = useNavigate();

  const handleAdd = () => {
    return navigate("/category/create");
  };

  const tableData: TableData<Category> = {
    title: "Wykaz kategorii",
    headers: headers,
    data: categoriesData,
    onAdd: handleAdd,
  };

  return (
    <>
      <ReadTemplate {...tableData}></ReadTemplate>
    </>
  );
};

export default RCategory;
