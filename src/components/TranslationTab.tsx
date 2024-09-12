import usePolishWords from "../hooks/useWordsPolish";

interface Props {
  id: number;
}

const TranslationTab = ({ id }: Props) => {
  const { data, error, isLoading, isFetching } = usePolishWords(id);
  if (error) return <p>Error</p>;
  return (
    <div>
      <p>{data[0]?.word}</p>
    </div>
  );
};

export default TranslationTab;
