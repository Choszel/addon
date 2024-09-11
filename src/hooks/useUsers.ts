import useData from "./useData";

export interface User{
    id: number;
    name: string;
    login: string;
    user_type: number;
}

const useUsers = (id?: number) => {
    const config = id ? { params: { id: id } } : {};
    
    return useData<User>("/users", config);
};
  
export default useUsers;