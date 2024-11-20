import "../SearchResultList.css";

interface Props {
  results:
    | {
        id: number;
        word: string;
      }[]
    | null;
  listElementClicked: (id: number, searchText: string) => void;
}

const SearchResultList = ({ results, listElementClicked }: Props) => {
  return (
    <div className="results-list">
      {results?.map((result) => {
        return (
          <div
            className="search-result"
            key={result.id}
            onClick={() => listElementClicked(result.id, result.word)}
          >
            {result.word}
          </div>
        );
      })}
    </div>
  );
};

export default SearchResultList;
