import { useParams } from "react-router-dom";
import useMissingPhrases from "../../hooks/useMissingPhrases";

const DetailsMissingPhrases = () => {
  const { id } = useParams<{ id: string }>();
  const { data } = useMissingPhrases(parseInt(id ?? "0"));
  console.log(data);
  return (
    <>
      {data.map((e) => (
        <div>
          <p>{e.id}</p>
          <p>{e.phrase}</p>
          <p>{e.definition}</p>
          <p>{e.languages_id}</p>
          <p>{e.users_id}</p>
        </div>
      ))}
    </>
  );
};

export default DetailsMissingPhrases;
