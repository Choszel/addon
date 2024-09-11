import useData from "./useData";
import { DifficultyLevel } from "./useDifficultyLevels";

export interface EnglishWord{
    id: number;
    word: string;
    definition: string;
    difficultylevel_id: DifficultyLevel;
}

const useEnglishWords = (id?: number) => {
    const config = id ? { params: { id: id } } : {};
  
    return useData<EnglishWord>("/englishWords", config);
  };
  

export default useEnglishWords;