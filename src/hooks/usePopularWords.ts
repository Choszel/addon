import useData from "./useData";

export interface PopularWord{
    id: number | null;
    word: string | null;
    popularity: number | null; 
}

const usePopularWords = (language: string) => {
 
    return useData<PopularWord>("/words/limit", {
        params: { language: language, limit: 5 },
    }, [language] );
}

export default usePopularWords