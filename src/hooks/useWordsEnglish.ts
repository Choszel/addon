import useData from "./useData";

export interface EnglishWord{
    id: number;
    word: string;
    definition: string;
    difficultylevel_id: number;
    categories_id: number;
}

const useWordsEnglish = (id?: number) => {
    const config = id ? { params: { id: id } } : {};
  
    return useData<EnglishWord>("/wordsEnglishDetailed", config);
  };
  

export default useWordsEnglish;