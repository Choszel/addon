import { Phrase } from "../pages/dictionary/DictionarySearchResult";
import useData from "./useData";
import { PolishWord } from "./useWordsPolish";

export interface TranslationPL_{
    id: number;
    word_polish: string;
    word_second: string;
    category_id?: number | null;
    difficulty_level_id?: number | null; 
}

const useTranslationPL_ = () =>{
    const fetchAll = (language: string, id?: number) =>{
        const config = { params: { language: language, id: id } } ;    
        return useData<TranslationPL_>("/translationPLN_Detailed", config);
    }

    const fetchForPLN = (language: string, id: number) =>{
        const config = { params: { language: language, id: id } };
    
        return useData<TranslationPL_>("/translationPLN_/pln", config);
    }

    const fetchForPLNDetailed = (language: string, id?: number) =>{ //fetchuje po polskim indeksie i zajduje słowa odpowiadające w angielskim zbiorze fraz
        const config = { params: { language: language, id: id } };
    
        return useData<Phrase>("/translationPLN_Detailed/pln", config);
    }

    const fetchFor_ = (language: string, id: number) =>{
        const config = { params: { language: language, id: id } };
    
        return useData<TranslationPL_>("/translationPLN_/_", config);
    }

    const fetchFor_Detailed = (language: string, id: number) =>{
        const config = { params: { language: language, id: id } };
    
        return useData<PolishWord>("/translationPLN_Detailed/_", config);
    }

    const fetchForPLNWord = (language: string, word: string) =>{
        const config = { params: { language: language, word: word } };
    
        return useData<Phrase>("/translationPLN_Detailed/pln/word", config);
    } 

    return {fetchAll, fetchForPLN, fetchForPLNDetailed, fetchFor_, fetchFor_Detailed, fetchForPLNWord}; 
}

export default useTranslationPL_;