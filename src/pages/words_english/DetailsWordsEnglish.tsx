import { useParams } from "react-router-dom";
import useWordsEnglish from "../../hooks/useWordsEnglish";
import DetailsWordsSecond from "../../components/crud_templates/DetailsWordsSecond";

const DetailsWordsEnglish = () => {
  const { id } = useParams<{ id: string }>();
  const { fetchAllDetailed } = useWordsEnglish(parseInt(id ?? "-1"));

  return (
    <DetailsWordsSecond
      id={id ?? "-1"}
      routeName={"/wordsEnglish"}
      code={"ENG"}
      fetchAllDetailed={fetchAllDetailed}
    />
  );
};

export default DetailsWordsEnglish;
