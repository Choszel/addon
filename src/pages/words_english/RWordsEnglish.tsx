import { useEffect, useState } from "react";
import useHeaders from "../../hooks/useHeaders";
import useWordsEngllish, { EnglishWord } from "../../hooks/useWordsEnglish";
import ReadTemplate, {
  TableData,
} from "../../components/crud_templates/ReadTemplate";

const RWordsEnglish = () => {
  const { data: headers } = useHeaders("words_english");
  const { data } = useWordsEngllish();
  const [updatedHeaders, setUpdatedHeaders] = useState<string[]>([]);

  useEffect(() => {
    if (headers) {
      const newHeaders = headers.map((e) =>
        e === "categories_id"
          ? "category"
          : e === "difficultylevel_id"
          ? "level"
          : e
      );
      setUpdatedHeaders(newHeaders);
    }
  }, [headers]);

  const tableData: TableData<EnglishWord> = {
    title: "Wykaz Angielskich słów",
    headers: updatedHeaders,
    data: data,
    canCreate: true,
    canDelete: true,
    canEdit: true,
    routeName: "/wordsPolish",
  };

  return <ReadTemplate {...tableData}></ReadTemplate>;
};

export default RWordsEnglish;
