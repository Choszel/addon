import useData from "./useData";
import { EnglishWord } from "./useWordsEnglish";
import { PolishWord } from "./useWordsPolish";

export interface TranslationPL_ENG{
    id: number;
    word_polish: string;
    word_english: string;
    category_id?: number | null;
    difficulty_level_id?: number | null; 
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

    const fetchForPLNDetailed = (id?: number) =>{ //fetchuje po polskim indeksie i zajduje słowa odpowiadające w angielskim zbiorze fraz
        const config = { params: { id: id } };
    
        return useData<EnglishWord>("/translationPLNENGDetailed/pln", config);
    }

    const fetchForENG = (id: number) =>{
        const config = { params: { id: id } };
    
        return useData<TranslationPL_ENG>("/translationPLNENG/eng", config);
    }

    const fetchForENGDetailed = (id: number) =>{
        const config = { params: { id: id } };
    
        return useData<PolishWord>("/translationPLNENGDetailed/eng", config);
    }

    const fetchForPLNWord = (word: string) =>{
        const config = { params: { word: word } };
    
        return useData<EnglishWord>("/translationPLNENGDetailed/pln/word", config);
    } 

    return {fetchAll, fetchForPLN, fetchForPLNDetailed, fetchForENG, fetchForENGDetailed, fetchForPLNWord}; 
}

export default useTranslationPL_ENG;