import { jwtDecode } from 'jwt-decode'; 

interface DecodedToken {
  userId: string;
  userLogin: string;
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

  const GetUserLogin = () => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode<DecodedToken>(token);        
      return decoded.userLogin;
    }
    return ""; 
  }

  const CheckUserType = (type?: number) => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode<DecodedToken>(token);  
      switch (type ? type : decoded.userType) {
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

  return { GetUserId, GetUserLogin, CheckUserType }
}

export default useTokenData;
