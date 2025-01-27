import ReadTemplate, {
  TableData,
} from "../../components/crud_templates/ReadTemplate";
import useHeaders from "../../hooks/useHeaders";
import useLanguages, { Language } from "../../hooks/useLanguages";

const RLanguage = () => {
  const { data: headers } = useHeaders("languages");
  const { data, isLoading, error } = useLanguages();

  const tableData: TableData<Language> = {
    title: "Wykaz języków",
    headers: headers,
    data: data,
    canCreate: true,
    canDelete: true,
    canEdit: true,
    routeName: "/language",
    isLoading: isLoading,
    error: error,
  };
  return <ReadTemplate {...tableData}></ReadTemplate>;
};

export default RLanguage;
