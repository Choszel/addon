import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FormTemplate, {
  FormData,
} from "../../components/crud_templates/CreateTemplate";
import useCategories from "../../hooks/useCategories";
import actionData from "../../hooks/actionData";

const ECategory = () => {
  const { id } = useParams<{ id: string }>();
  const [refs, setRefs] = useState<
    (HTMLInputElement | HTMLSelectElement | null)[]
  >([]);
  const navigate = useNavigate();
  const routeName = "/category";
  const { putData } = actionData(routeName);

  const { data: categoryData, isLoading } = useCategories(parseInt(id ?? "0"));

  const handleSave = () => {
    console.log("Refs:", refs);
    const formData = new URLSearchParams();
    formData.append("id", id || "");
    formData.append("name", refs[0]?.value ?? "");
    putData(formData);
    return navigate(routeName);
  };

  const handleCancel = () => {
    return navigate(routeName);
  };

  useEffect(() => {
    if (categoryData && refs[0]) {
      refs[0].value = categoryData[0].name;
    }
  }, [categoryData, refs]);

  if (isLoading) return <div>Ładowanie danych...</div>;

  const formData: FormData = {
    title: "Edytowanie Kategorii",
    headers: [{ inputName: "Name", inputType: "text", isRequired: true }],
    setRefs: function (): void {},
    onSave: handleSave,
    onCancel: handleCancel,
  };

  return <FormTemplate {...formData} setRefs={setRefs} />;
};

export default ECategory;
