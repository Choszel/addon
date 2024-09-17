import { jwtDecode } from 'jwt-decode'; 

interface DecodedToken {
  userId: string;
  userType: string;
}

const useTokenData = () => {

  const GetUserId = () => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode<DecodedToken>(token);        
      return parseInt(decoded.userId);
    }
    return -1; 
  }

  const CheckUserType = () => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode<DecodedToken>(token);  
      switch (decoded.userType) {
        case "2":
          return "admin";
        case "1":
          return "warden";
        default:
          return "normal";
      }
    }
    return "none"; 
  };

  return { GetUserId, CheckUserType }
}

export default useTokenData;