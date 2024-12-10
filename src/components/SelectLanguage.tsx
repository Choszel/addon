import useLanguages from "../hooks/useLanguages";

interface Props {
  selectedLanguage?: string;
  setSelectedLanguage: (code: string) => void;
}

const SelectLanguage = ({ selectedLanguage, setSelectedLanguage }: Props) => {
  const { data } = useLanguages();

  return (
    <select
      className="select-primary"
      style={{ padding: "0.5%" }}
      onChange={(event) => {
        setSelectedLanguage(event.target.value);
      }}
      value={selectedLanguage}
      name="select-language"
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
