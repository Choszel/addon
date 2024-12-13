import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FormTemplate, {
  FormData,
} from "../../components/crud_templates/CreateTemplate";
import useCategories from "../../hooks/useCategories";
import actionData from "../../hooks/actionData";
import { Spinner, Text } from "@chakra-ui/react";

const ECategory = () => {
  const { id } = useParams<{ id: string }>();
  const [refs, setRefs] = useState<
    (HTMLInputElement | HTMLSelectElement | null)[]
  >([]);
  const navigate = useNavigate();
  const routeName = "/category";
  const { putData } = actionData(routeName);

  const {
    data: categoryData,
    isLoading,
    error,
  } = useCategories(parseInt(id ?? "0"));

  const handleSave = async () => {
    const formData = new URLSearchParams();
    formData.append("id", id || "");
    formData.append("name", refs[0]?.value ?? "");
    const response = await putData(formData);
    if (response.id != -1) return navigate(routeName);
  };

  const handleCancel = () => {
    return navigate(routeName);
  };

  useEffect(() => {
    if (categoryData && refs[0]) {
      refs[0].value = categoryData[0].name;
    }
  }, [categoryData, refs]);

  if (isLoading) return <Spinner />;
  if (error) return <Text color="var(--error)">{error}</Text>;

  const formData: FormData = {
    title: "Edytowanie Kategorii",
    headers: [
      {
        inputName: "Nazwa",
        inputType: "text",
        isRequired: true,
        maxLength: 30,
      },
    ],
    setRefs: function (): void {},
    onSave: handleSave,
    onCancel: handleCancel,
  };

  return <FormTemplate {...formData} setRefs={setRefs} />;
};

export default ECategory;
