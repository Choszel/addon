import { Select } from "@chakra-ui/react";
import useLanguages from "../hooks/useLanguages";

interface Props {
  setSelectedLanguage: (code: string) => void;
}

const SelectLanguage = ({ setSelectedLanguage }: Props) => {
  const { data } = useLanguages();

  return (
    <Select
      width="10%"
      margin="0%"
      onChange={(event) => {
        setSelectedLanguage(event.target.value + "_PLN");
        console.log(event.target.value);
      }}
    >
      {data.map((language) => (
        <option key={language.id}>{language.code}</option>
      ))}
    </Select>
  );
};

export default SelectLanguage;
