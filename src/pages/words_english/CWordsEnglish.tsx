import CWordsSecond from "../../components/crud_templates/CWordsSecond";

const CWordsEnglish = () => {
  return (
    <div>
      <CWordsSecond
        routeName={"/wordsEnglish"}
        code={"ENG"}
        titlePart={"Angielskiej"}
      />
    </div>
  );
};

export default CWordsEnglish;
