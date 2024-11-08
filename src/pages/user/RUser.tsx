import ReadTemplate, {
  TableData,
} from "../../components/crud_templates/ReadTemplate";
import useHeaders from "../../hooks/useHeaders";
import useUsers, { User } from "../../hooks/useUsers";

const RUser = () => {
  const { data: headers } = useHeaders("users");
  const { data, isLoading, error } = useUsers();

  const tableData: TableData<User> = {
    title: "Wykaz użytkowników",
    headers: headers,
    data: data,
    isLoading: isLoading,
    error: error,
    details: true,
    routeName: "/user",
  };
  return <ReadTemplate {...tableData}></ReadTemplate>;
};

export default RUser;
