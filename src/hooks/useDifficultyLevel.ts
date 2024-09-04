import useData from "./useData";

export interface DifficultyLevel{
    id: number;
    level: string
 }

 const useDifficultyLevels=()=>useData<DifficultyLevel>("/difficultyLevel")

 export default useDifficultyLevels;