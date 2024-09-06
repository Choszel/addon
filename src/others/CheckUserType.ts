import { jwtDecode } from 'jwt-decode'; 

interface DecodedToken {
  userId: string;
  userType: string;
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

export default CheckUserType;
