import useData from "./useData";

const useHeaders = (tableName: string) => {
    const config = tableName ? { params: { tableName: tableName } } : {};
  
    return useData<string>("/headers", config);
  };
  

export default useHeaders;