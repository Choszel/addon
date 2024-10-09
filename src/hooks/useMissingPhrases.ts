import useData from "./useData";

export interface MissingPhrase{
    id: number;
    phrase: string;
    definition: string;
    user: number | string;
    code: number | string;
    level: number | string;
    category: number | string;
    part_of_speech: number | string;
}

const useMissingPhrases = (id?: number) => {
    const config = id ? { params: { id: id } } : {};
    
    return useData<MissingPhrase>("/missingPhrasesDetailed", config);
};
  

export default useMissingPhrases;