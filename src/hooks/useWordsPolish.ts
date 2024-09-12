import useData from "./useData";

export interface PolishWord{
    id: number;
    word: string;
    categories_id: number;
}

const useWordsPolish = (id?: number) => {
    const config = id ? { params: { id: id } } : {};
  
    return useData<PolishWord>("/wordsPolishDetailed", config);
  };
  

export default useWordsPolish;