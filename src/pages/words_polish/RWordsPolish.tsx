import { useEffect, useState } from "react";
import ReadTemplate, {
  TableData,
} from "../../components/crud_templates/ReadTemplate";
import useHeaders from "../../hooks/useHeaders";
import useWordsPolish, { PolishWord } from "../../hooks/useWordsPolish";

const RWordsPolish = () => {
  const { data: headers } = useHeaders("words_polish");
  const { data } = useWordsPolish();
  const [updatedHeaders, setUpdatedHeaders] = useState<string[]>([]);

  useEffect(() => {
    if (headers) {
      const newHeaders = headers.map((e) =>
        e === "categories_id" ? "category" : e
      );
      setUpdatedHeaders(newHeaders);
    }
  }, [headers]);

  const tableData: TableData<PolishWord> = {
    title: "Wykaz Polskich słów",
    headers: updatedHeaders,
    data: data,
    canCreate: true,
    canDelete: true,
    canEdit: true,
    routeName: "/wordsPolish",
  };

  return <ReadTemplate {...tableData}></ReadTemplate>;
};

export default RWordsPolish;
