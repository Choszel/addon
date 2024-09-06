import { useState } from "react";
import FormTemplate, {
  FormData,
} from "../../components/crud_templates/CreateTemplate";
import { Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const [refs, setRefs] = useState<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();

  const handleSave = () => {
    console.log("Refs:", refs);
  };

  const handleCancel = () => {
    return navigate("/category");
  };

  const formData: FormData = {
    header: "Tworzenie Kategorii",
    data: [
      { inputName: "Age", inputType: "number", isRequired: true },
      { inputName: "Name", inputType: "text", isRequired: true },
    ],
    setRefs: function (): void {},
    onSave: handleSave,
    onCancel: handleCancel,
  };

  return (
    <>
      <FormTemplate {...formData} setRefs={setRefs} />
      <Button onClick={handleSave}>Pokaż</Button>
    </>
  );
};

export default Index;
