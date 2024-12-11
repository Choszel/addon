import useWordsEnglish from "../../hooks/useWordsEnglish";
import RWordsSecond from "../../components/crud_templates/RWordsSecond";

const RWordsEnglish = () => {
  const { fetchAllDetailed } = useWordsEnglish();

  return (
    <RWordsSecond
      routeName={"/wordsEnglish"}
      titlePart={"Angielskich"}
      fetchAllDetailed={fetchAllDetailed}
    />
  );
};

export default RWordsEnglish;
