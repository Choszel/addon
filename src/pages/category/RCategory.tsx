import { useNavigate } from "react-router-dom";
import ReadTemplate, {
  TableData,
} from "../../components/crud_templates/ReadTemplate";
import useCategories, { Category } from "../../hooks/useCategories";
import useHeaders from "../../hooks/useHeaders";
import deleteData from "../../hooks/deleteData";

const RCategory = () => {
  const { data: headers } = useHeaders("categories");
  const { data: categoriesData } = useCategories();
  const { sendData } = deleteData("/category");
  const navigate = useNavigate();

  const handleAdd = () => {
    return navigate("/category/create");
  };

  const handleDelete = (id: number) => {
    const formData = new URLSearchParams();
    formData.append("id", id.toString());
    sendData(formData);
  };
  const handleEdit = (id: number) => {
    return navigate("/category/edit/" + id);
  };

  const tableData: TableData<Category> = {
    title: "Wykaz kategorii",
    headers: headers,
    data: categoriesData,
    onAdd: handleAdd,
    onDelete: handleDelete,
    onEdit: handleEdit,
  };

  return (
    <>
      <ReadTemplate {...tableData}></ReadTemplate>
    </>
  );
};

export default RCategory;
