import useData from "./useData";

export interface PopularWord{
    id: number | null;
    word: string | null;
    popularity: number | null; 
}

const usePopularWords = (language: string) => {
    let table = "words_polish"
    switch(language){
        case "ENG":
            table = "words_english";
            break;
        default: 
        break;
    }
 
    return useData<PopularWord>("/words/limit", {
        params: { table: table, limit: 5 },
    }, [table] );
}

export default usePopularWords