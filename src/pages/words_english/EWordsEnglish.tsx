import { useParams } from "react-router-dom";
import useWordsEnglish from "../../hooks/useWordsEnglish";
import EWordsSecond from "../../components/crud_templates/EWordsSecond";

const EWordsEnglish = () => {
  const { id } = useParams<{ id: string }>();
  const { fetchAllDetailed } = useWordsEnglish(parseInt(id ?? "-1"));

  return (
    <EWordsSecond
      routeName={"/wordsEnglish"}
      fetchAllDetailed={fetchAllDetailed}
    />
  );
};

export default EWordsEnglish;
