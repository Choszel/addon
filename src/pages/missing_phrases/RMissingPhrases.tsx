import useHeaders from "../../hooks/useHeaders";
import ReadTemplate, {
  TableData,
} from "../../components/crud_templates/ReadTemplate";
import useMissingPhrases, {
  MissingPhrase,
} from "../../hooks/useMissingPhrases";
import { useEffect, useState } from "react";

const RMissingPhrases = () => {
  const { data: headers } = useHeaders("missing_phrases");
  const { data } = useMissingPhrases();
  const [updatedHeaders, setUpdatedHeaders] = useState<string[]>([]);

  useEffect(() => {
    if (headers) {
      const newHeaders = headers.map((e) =>
        e === "languages_id"
          ? "code"
          : e === "users_id"
          ? "login"
          : e === "difficulty_level"
          ? "level"
          : e === "definition"
          ? ""
          : e
      );
      setUpdatedHeaders(newHeaders);
    }
  }, [headers]);

  const tableData: TableData<MissingPhrase> = {
    title: "Wykaz brakujących fraz",
    headers: updatedHeaders,
    data: data,
    canDelete: true,
    details: true,
    routeName: "/missingPhrases",
  };

  return <ReadTemplate {...tableData}></ReadTemplate>;
};

export default RMissingPhrases;
