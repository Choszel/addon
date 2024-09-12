import useData from "./useData";

export interface TranslationPL_ENG{
    id: number;
    word_polish: string;
    word_english: string;
}

const useTranslationPL_ENG = () =>{
    const fetchAll = (id?: number) =>{
        const config = id ? { params: { id: id } } : {};
    
        return useData<TranslationPL_ENG>("/translationPLNENGDetailed", config);
    }

    const fetchForPLN = (id: number) =>{
        const config = { params: { id: id } };
    
        return useData<TranslationPL_ENG>("/translationPLNENG/pln", config);
    }

    const fetchForENG = (id: number) =>{
        const config = { params: { id: id } };
    
        return useData<TranslationPL_ENG>("/translationPLNENG/eng", config);
    }

    return {fetchAll, fetchForPLN, fetchForENG}; 
}

export default useTranslationPL_ENG;