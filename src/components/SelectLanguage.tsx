import { Select } from "@chakra-ui/react";

const SelectLanguage = () => {
  const availableLanguages = ["PLN", "ENG", "GER", "RUS"];

  return (
    <Select width="8%" margin="0%">
      {availableLanguages.map((language) => (
        <option key={language}>{language}</option>
      ))}
    </Select>
  );
};

export default SelectLanguage;
