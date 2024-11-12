import ReadTemplate, {
  TableData,
} from "../../components/crud_templates/ReadTemplate";
import useUsers, { User } from "../../hooks/useUsers";

const RUser = () => {
  const { data, isLoading, error } = useUsers();

  const tableData: TableData<User> = {
    title: "Wykaz użytkowników",
    headers: ["id", "login", "user_type"],
    data: data,
    isLoading: isLoading,
    error: error,
    details: true,
    routeName: "/user",
  };
  return <ReadTemplate {...tableData}></ReadTemplate>;
};

export default RUser;
