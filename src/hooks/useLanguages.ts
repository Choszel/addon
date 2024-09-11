import useData from "./useData";

export interface Language{
    id: number;
    code: string
}

const useLanguages = (id?: number)=>{
    const config = id ? { params: { id: id } } : {};

    return useData<Language>("/languages", config)
};

 export default useLanguages;