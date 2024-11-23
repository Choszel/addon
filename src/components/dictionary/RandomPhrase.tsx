interface Props {
  onSearch: (id: number, searchText: string) => void;
  language: string;
}

const RandomPhrase = ({ onSearch, language }: Props) => {
  const findRandomPhrase = async () => {
    let endpoint = "";
    switch (language) {
      case "ENG":
        endpoint = "wordsEnglish";
        break;
      default:
        endpoint = "wordsPolish";
        break;
    }

    try {
      const response = await fetch("http://localhost:3001/api/" + endpoint);
      const data = await response.json();

      const randomIndex = Math.floor(Math.random() * data.length);
      if (data.length > 0) {
        onSearch(data[randomIndex].id, data[randomIndex].word);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <button className="button_secondary" onClick={findRandomPhrase}>
      Losuj frazę
    </button>
  );
};

export default RandomPhrase;
