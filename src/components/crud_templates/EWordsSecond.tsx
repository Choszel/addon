import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import actionData from "../../hooks/actionData";
import useCategories from "../../hooks/useCategories";
import useDifficultyLevels from "../../hooks/useDifficultyLevels";
import { Spinner, Text } from "@chakra-ui/react";
import usePartOfSpeech from "../../hooks/usePartOfSpeech";
import FormTemplate, { FormData } from "./CreateTemplate";
import useWordsSecond from "../../hooks/useWordsSecond";

interface Props {
  routeName: string;
  titlePart: string;
  code: string;
}

const EWordsSecond = ({ routeName, titlePart, code }: Props) => {
  const { id } = useParams<{ id: string }>();
  const [refs, setRefs] = useState<
    (HTMLInputElement | HTMLSelectElement | null)[]
  >([]);
  const navigate = useNavigate();
  const { putData } = actionData(routeName);

  const {
    data: categories,
    isLoading: catIsLoading,
    error: catError,
  } = useCategories();
  const {
    data: difficultyLevels,
    isLoading: diffIsLoading,
    error: diffError,
  } = useDifficultyLevels();
  const { fetchAllDetailed } = useWordsSecond(code, parseInt(id ?? "-1"));
  const { data, isLoading, error } = fetchAllDetailed();

  const handleSave = () => {
    const formData = new URLSearchParams();
    formData.append("id", id || "");
    formData.append("word", refs[0]?.value ?? "");
    formData.append("definition", refs[1]?.value ?? "");
    formData.append("difficulty_level_id", refs[2]?.value ?? "");
    formData.append("category_id", refs[3]?.value ?? "");
    formData.append("part_of_speech", refs[4]?.value ?? "");
    putData(formData);
    return navigate(routeName);
  };

  const handleCancel = () => {
    return navigate(routeName);
  };

  useEffect(() => {
    if (data && refs[0] && refs[1] && refs[2] && refs[3] && refs[4]) {
      refs[0].value = data[0].word;
      refs[1].value = data[0].definition;
      refs[2].value = (
        difficultyLevels.find((dl) => dl.level == data[0].level)?.id ?? 0
      ).toString();
      refs[3].value = (
        categories.find((cat) => cat.name == data[0].category)?.id ?? 0
      ).toString();
      refs[4].value = data[0].part_of_speech ?? "0";
    }
  }, [data, refs]);

  if (isLoading) return <Spinner size="xl" />;
  if (error) return <Text color="var(--error)">{error}</Text>;

  const formData: FormData = {
    title: "Edytowanie " + titlePart + " Frazy",
    headers: [
      {
        inputName: "Fraza",
        inputType: "text",
        isRequired: true,
        maxLength: 50,
      },
      {
        inputName: "Definicja",
        inputType: "text",
        isRequired: true,
        maxLength: 200,
      },
      {
        inputName: "Poziom trudności",
        inputType: "select",
        isRequired: false,
        data: difficultyLevels?.map((dl) => ({
          id: dl.id,
          value: dl.level,
        })),
        isLoading: diffIsLoading,
        error: diffError,
      },
      {
        inputName: "Kategoria",
        inputType: "select",
        isRequired: false,
        data: categories?.map((cat) => ({ id: cat.id, value: cat.name })),
        isLoading: catIsLoading,
        error: catError,
      },
      {
        inputName: "Część mowy",
        inputType: "select",
        isRequired: false,
        data: usePartOfSpeech(),
        maxLength: 15,
      },
    ],
    setRefs: function (): void {},
    onSave: handleSave,
    onCancel: handleCancel,
  };

  return <FormTemplate {...formData} setRefs={setRefs} />;
};

export default EWordsSecond;
