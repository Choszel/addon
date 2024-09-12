import useData from "./useData";

export interface MissingPhrase{
    id: number;
    phrase: string;
    definition: string;
    languages_id: number | string;
    users_id: number | string;
}

const useMissingPhrases = (id?: number) => {
    const config = id ? { params: { id: id } } : {};
    
    return useData<MissingPhrase>("/missingPhrasesDetailed", config);
};
  

export default useMissingPhrases;