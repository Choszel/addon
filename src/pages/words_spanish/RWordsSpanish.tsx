import RWordsSecond from "../../components/crud_templates/RWordsSecond";
import useWordsSpanish from "../../hooks/useWordsSpanish";

const RWordsSpanish = () => {
  const { fetchAllDetailed } = useWordsSpanish();

  return (
    <RWordsSecond
      routeName={"/wordsSpanish"}
      titlePart={"Hiszpańskich"}
      fetchAllDetailed={fetchAllDetailed}
    />
  );
};

export default RWordsSpanish;
