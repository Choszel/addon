import useData from "./useData";

export interface PolishWord{
    id: number;
    translation_id?: number | null;
    word: string;
    definition: string;
    photo: string | null;
    category: string;
}

const useWordsPolish = () => {
  const fetchWords = (id?: number) =>{
    const config = id ? { params: { id: id } } : {};
  
    return useData<PolishWord>("/wordsPolishDetailed", config);
  }

  const fetchWordsByWord = (word?: string, category?: number) =>{
    const config = word ? category ? { params: { word: word, category: category } } : {} : {};
  
    return useData<PolishWord>("/wordsPolishByWord", config);
  }

  return {fetchWords, fetchWordsByWord};
};
  

export default useWordsPolish;