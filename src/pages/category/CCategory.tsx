import { useState } from "react";
import FormTemplate, {
  FormData,
} from "../../components/crud_templates/CreateTemplate";
import { useNavigate } from "react-router-dom";
import postData from "../../hooks/postData";

const Index = () => {
  const [refs, setRefs] = useState<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();
  const { sendData } = postData("/category");

  const handleSave = () => {
    console.log("Refs:", refs);
    console.log(refs[0]?.value);
    const formData = new URLSearchParams();
    formData.append("name", refs[0]?.value ?? "");
    sendData(formData);
    return navigate("/category");
  };

  const handleCancel = () => {
    return navigate("/category");
  };

  const formData: FormData = {
    header: "Tworzenie Kategorii",
    data: [{ inputName: "Name", inputType: "text", isRequired: true }],
    setRefs: function (): void {},
    onSave: handleSave,
    onCancel: handleCancel,
  };

  return (
    <>
      <FormTemplate {...formData} setRefs={setRefs} />
    </>
  );
};

export default Index;
