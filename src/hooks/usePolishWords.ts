import { Category } from "./useCategories";
import useData from "./useData";

export interface PolishWord{
    id: number;
    word: string;
    categories_id: Category;
}

const usePolishWords = (id?: number) => {
    const config = id ? { params: { id: id } } : {};
  
    return useData<PolishWord>("/wordsPolish", config);
  };
  

export default usePolishWords;