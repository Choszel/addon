import { useParams } from "react-router-dom";
import useWordsSpanish from "../../hooks/useWordsSpanish";
import EWordsSecond from "../../components/crud_templates/EWordsSecond";

const EWordsSpanish = () => {
  const { id } = useParams<{ id: string }>();
  const { fetchAllDetailed } = useWordsSpanish(parseInt(id ?? "-1"));

  return (
    <EWordsSecond
      routeName={"/wordsSpanish"}
      fetchAllDetailed={fetchAllDetailed}
      titlePart={"Hiszpańskiej"}
    />
  );
};

export default EWordsSpanish;
