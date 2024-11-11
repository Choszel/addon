import useLanguages from "../hooks/useLanguages";

interface Props {
  setSelectedLanguage: (code: string) => void;
}

const SelectLanguage = ({ setSelectedLanguage }: Props) => {
  const { data } = useLanguages();

  return (
    <select
      className="select-primary"
      style={{ padding: "0.5%" }}
      onChange={(event) => {
        setSelectedLanguage(event.target.value + "_PLN");
        console.log(event.target.value);
      }}
    >
      {data.map((language) => (
        <option key={language.id} className="select-primary-option">
          {language.code}
        </option>
      ))}
    </select>
  );
};

export default SelectLanguage;
