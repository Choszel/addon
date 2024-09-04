import useData from "./useData";

export interface EnglishWord{

}

const useEnglishWords=()=>useData<EnglishWord>("/englishWords")

export default useEnglishWords;