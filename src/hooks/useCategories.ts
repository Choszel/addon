import useData from "./useData";

export interface Category{
    id: number;
    name: string;
}

const useCategories = (id?: number) => {
    const config = id ? { params: { id: id } } : {};
  
    return useData<Category>("/englishWords", config);
  };
  

export default useCategories;