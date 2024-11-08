import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import actionData from "../../hooks/actionData";
import useWordsPolish from "../../hooks/useWordsPolish";
import FormTemplate, {
  FormData,
} from "../../components/crud_templates/CreateTemplate";
import useCategories from "../../hooks/useCategories";
import { Spinner, Text } from "@chakra-ui/react";

const EWordsPolish = () => {
  const { id } = useParams<{ id: string }>();
  const [refs, setRefs] = useState<
    (HTMLInputElement | HTMLSelectElement | null)[]
  >([]);
  const navigate = useNavigate();
  const routeName = "/wordsPolish";
  const { putData } = actionData(routeName);
  const {
    data: categories,
    isLoading: catIsLoading,
    error: catError,
  } = useCategories();
  const { fetchWords } = useWordsPolish();
  const { data, isLoading, error } = fetchWords(parseInt(id ?? "0"));

  const handleSave = () => {
    console.log("Refs:", refs);
    const formData = new URLSearchParams();
    formData.append("id", id || "");
    formData.append("word", refs[0]?.value ?? "");
    formData.append("definition", refs[1]?.value ?? "");
    formData.append("categories_id", refs[2]?.value ?? "");
    formData.append("photo", refs[3]?.value ?? "");
    putData(formData);
    return navigate(routeName);
  };

  const handleCancel = () => {
    return navigate(routeName);
  };

  useEffect(() => {
    if (data && refs[0] && refs[1] && refs[3]) {
      refs[0].value = data[0].word;
      refs[1].value = data[0].definition;
      refs[3].value = data[0].photo ?? "";
    }
  }, [data, refs]);

  if (isLoading) return <Spinner size="xl" />;
  if (error) return <Text color="var(--error)">{error}</Text>;

  const formData: FormData = {
    title: "Edytowanie Polskiej Frazy",
    headers: [
      { inputName: "Word", inputType: "text", isRequired: true },
      { inputName: "Definition", inputType: "text", isRequired: true },
      {
        inputName: "Category",
        inputType: "select",
        isRequired: false,
        data: categories?.map((cat) => ({ id: cat.id, value: cat.name })),
        isLoading: catIsLoading,
        error: catError,
      },
      { inputName: "Photo", inputType: "text", isRequired: false },
    ],
    setRefs: function (): void {},
    onSave: handleSave,
    onCancel: handleCancel,
  };

  return <FormTemplate {...formData} setRefs={setRefs} />;
};

export default EWordsPolish;
