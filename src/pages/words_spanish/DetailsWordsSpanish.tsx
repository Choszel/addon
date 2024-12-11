import { useParams } from "react-router-dom";
import useWordsSpanish from "../../hooks/useWordsSpanish";
import DetailsWordsSecond from "../../components/crud_templates/DetailsWordsSecond";

const DetailsWordsSpanish = () => {
  const { id } = useParams<{ id: string }>();
  const { fetchAllDetailed } = useWordsSpanish(parseInt(id ?? "-1"));

  return (
    <DetailsWordsSecond
      id={id ?? "-1"}
      routeName={"/wordsSpanish"}
      code={"SPA"}
      fetchAllDetailed={fetchAllDetailed}
    />
  );
};

export default DetailsWordsSpanish;
