import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FormTemplate, {
  FormData,
} from "../../components/crud_templates/CreateTemplate";
import actionData from "../../hooks/actionData";
import useLanguages from "../../hooks/useLanguages";
import { Spinner, Text } from "@chakra-ui/react";

const Elanguage = () => {
  const { id } = useParams<{ id: string }>();
  const [refs, setRefs] = useState<
    (HTMLInputElement | HTMLSelectElement | null)[]
  >([]);
  const navigate = useNavigate();
  const routeName = "/language";
  const { putData } = actionData(routeName);

  const { data, isLoading, error } = useLanguages(parseInt(id ?? "0"));

  const handleSave = () => {
    console.log("Refs:", refs);
    const formData = new URLSearchParams();
    formData.append("id", id || "");
    formData.append("code", refs[0]?.value ?? "");
    putData(formData);
    return navigate(routeName);
  };

  const handleCancel = () => {
    return navigate(routeName);
  };

  useEffect(() => {
    if (data && refs[0]) {
      refs[0].value = data[0].code;
    }
  }, [data, refs]);

  if (isLoading) return <Spinner />;
  if (error) return <Text color="var(--error)">{error}</Text>;

  const formData: FormData = {
    title: "Edytowanie Języka",
    headers: [{ inputName: "Code", inputType: "text", isRequired: true }],
    setRefs: function (): void {},
    onSave: handleSave,
    onCancel: handleCancel,
  };

  return <FormTemplate {...formData} setRefs={setRefs} />;
};

export default Elanguage;
