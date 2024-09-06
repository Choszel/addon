import { useState } from "react";
import { useToast } from "@chakra-ui/react";

const postRegister = () => {
  const [isSending, setSending] = useState(false);
  const toast = useToast();

  const sendRegisterForm = async (name: string, login: string, password: string) => {
    setSending(true);
    try {
      const formData = new URLSearchParams();
      formData.append('name', name);
      formData.append('login', login);
      formData.append('password', password);

      const response = await fetch("http://localhost:3001/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
        redirect: "manual",
      });

      if (response.status === 201) {
        toast({
          title: "Zarejestrowano pomyślnie",
          status: "success",
          position: "bottom-right",
          duration: 5000,
          isClosable: true,
        });
      } else if (response.status === 500 || response.status === 400) {
        toast({
          title: "Błąd rejestracji",
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

  return { isSending, sendRegisterForm };
};

export default postRegister;
