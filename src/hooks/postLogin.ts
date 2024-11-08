import { useContext, useState } from "react";
import { useToast } from "@chakra-ui/react";
import { AuthContext } from "../others/AuthContext";

const postLogin = () => {
  const [isSending, setSending] = useState(false);
  const authContext = useContext(AuthContext);  
  const toast = useToast();

  const sendLoginForm = async (login: string, password: string) => {
    setSending(true);
    try {
      const formData = new URLSearchParams();
      formData.append('login', login);
      formData.append('password', password);

      const response = await fetch("http://localhost:3001/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
        redirect: "manual",
      });

      if (response.status === 201) {
        const data = await response.json(); 
        localStorage.setItem('token', data.token);
        if(authContext)authContext.login();

        toast({
          title: "Pomyślnie zalogowano",
          status: "success",
          position: "bottom-right",
          duration: 5000,
          isClosable: true,
        });
      } else if (response.status === 500 || response.status === 400) {
        toast({
          title: "Niepoprawne dane logowania.",
          status: "error",
          position: "bottom-right",
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Nieoczekiwany błąd.",
          status: "error",
          position: "bottom-right",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Nieoczekiwany błąd. 2",
        status: "error",
        position: "bottom-right",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setSending(false);
    }
  };

  return { isSending, sendLoginForm };
};

export default postLogin;
