import useData from "./useData";

export interface TranslationPL_ENG{
    id: number;
    words_polish_id: number;
    english_words_id: number;
}

const useTranslationPL_ENG = (id?: number) =>{
    const config = id ? { params: { id: id } } : {};

    return useData<TranslationPL_ENG>("/translationPLNENG", config);
}

export default useTranslationPL_ENG;