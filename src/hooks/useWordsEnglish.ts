import useData from "./useData";

export interface EnglishWord{
    id: number;
    translation_id?: number | null;
    word: string;
    definition: string;
    level: string;
    category: string;
    popularity: number | null;
    part_of_speech: string | null;
}

const useWordsEnglish = (id?: number) => {

  const fetchAll = () =>{
    const config = id ? { params: { id: id } } : {};

    return useData<EnglishWord>("/wordsEnglish", config);
  }

    const fetchAllDetailed = () =>{
      const config = id ? { params: { id: id } } : {};
  
      return useData<EnglishWord>("/wordsEnglishDetailed", config);
    }
    return {fetchAll, fetchAllDetailed}
  };
  

export default useWordsEnglish;