import useData from "./useData";

export interface EnglishWord{
    id: number;
    word: string;
    definition: string;
    level: string;
    category: string;
    popularity: number | null;
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