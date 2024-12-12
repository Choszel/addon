import useData from "./useData";

export interface SecondWord{
    id: number;
    translation_id?: number | null;
    word: string;
    definition: string;
    level: string;
    category: string;
    popularity: number | null;
    part_of_speech: string | null;
}

const useWordsSecond = (language: string, id?: number) => {

  const fetchAll = () =>{
    const config = { params: { language: language, id: id } };

    return useData<SecondWord>("/wordsSecond", config);
  }

    const fetchAllDetailed = () =>{
      const config = { params: { language: language, id: id } };
      return useData<SecondWord>("/wordsSecondDetailed", config);
    }
    return {fetchAll, fetchAllDetailed}
  };
  

export default useWordsSecond;