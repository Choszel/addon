import useData from "./useData";

export interface User{
    id: number;
    name: string;
    login: string;
    user_type: number;
}

const useUsers = (login?: string) => useData<User>("/users", 
    {params: {
        login: login ?? "" }},
    [login ?? ""]);

  
export default useUsers;