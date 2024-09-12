import useData from "./useData";

export interface PolishWord{
    id: number;
    word: string;
    definition: string;
    photo: string | null;
    category: string;
}

const useWordsPolish = (id?: number) => {
    const config = id ? { params: { id: id } } : {};
  
    return useData<PolishWord>("/wordsPolishDetailed", config);
  };
  

export default useWordsPolish;