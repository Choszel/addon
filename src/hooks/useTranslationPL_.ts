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
        return useData<TranslationPL_>("/translationPOL_Detailed", config);
    }

    const fetchForPOL = (language: string, id: number) =>{
        const config = { params: { language: language, id: id } };
    
        return useData<TranslationPL_>("/translationPOL_/pol", config);
    }

    const fetchForPOLDetailed = (language: string, id?: number) =>{ //fetchuje po polskim indeksie i zajduje słowa odpowiadające w angielskim zbiorze fraz
        const config = { params: { language: language, id: id } };
    
        return useData<Phrase>("/translationPOL_Detailed/pol", config);
    }

    const fetchFor_ = (language: string, id: number) =>{
        const config = { params: { language: language, id: id } };
    
        return useData<TranslationPL_>("/translationPOL_/_", config);
    }

    const fetchFor_Detailed = (language: string, id: number) =>{
        const config = { params: { language: language, id: id } };
    
        return useData<PolishWord>("/translationPOL_Detailed/_", config);
    }

    const fetchForPOLWord = (language: string, word: string) =>{
        const config = { params: { language: language, word: word } };
    
        return useData<Phrase>("/translationPOL_Detailed/pol/word", config);
    } 

    return {fetchAll, fetchForPOL, fetchForPOLDetailed, fetchFor_, fetchFor_Detailed, fetchForPOLWord}; 
}

export default useTranslationPL_;