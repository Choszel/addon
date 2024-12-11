import { useState } from "react";
import FormTemplate, {
  FormData,
} from "../../components/crud_templates/CreateTemplate";
import { useNavigate } from "react-router-dom";
import actionData from "../../hooks/actionData";

const CCategory = () => {
  const [refs, setRefs] = useState<
    (HTMLInputElement | HTMLSelectElement | null)[]
  >([]);
  const navigate = useNavigate();
  const routeName = "/category";
  const { postData } = actionData(routeName);

  const handleSave = () => {
    const formData = new URLSearchParams();
    formData.append("name", refs[0]?.value ?? "");
    postData(formData);
    return navigate(routeName);
  };

  const handleCancel = () => {
    return navigate(routeName);
  };

  const formData: FormData = {
    title: "Dodawanie Kategorii",
    headers: [{ inputName: "Nazwa", inputType: "text", isRequired: true }],
    setRefs: function (): void {},
    onSave: handleSave,
    onCancel: handleCancel,
  };

  return <FormTemplate {...formData} setRefs={setRefs} />;
};

export default CCategory;
