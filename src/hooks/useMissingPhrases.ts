import useData from "./useData";

export interface MissingPhrase{
    id: number;
    phrase: string;
    definition: string;
}

const useMissingPhrases = (id?: number) => {
    const config = id ? { params: { id: id } } : {};
    
    return useData<MissingPhrase>("/missingPhrases", config);
};
  

export default useMissingPhrases;