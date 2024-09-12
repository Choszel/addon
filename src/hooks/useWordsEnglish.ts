import useData from "./useData";

export interface EnglishWord{
    id: number;
    word: string;
    definition: string;
    level: string;
    category: string;
}

const useWordsEnglish = (id?: number) => {
    const config = id ? { params: { id: id } } : {};
  
    return useData<EnglishWord>("/wordsEnglishDetailed", config);
  };
  

export default useWordsEnglish;