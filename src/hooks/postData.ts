import { useState } from "react";
import {  CanceledError } from "axios";
import { useToast } from "@chakra-ui/react";

const postData = (endpoint: string) => {
  const [isSending, setSending] = useState(false); 
  const toast = useToast();
    
  const sendData = async (formData: URLSearchParams) => {
    try {
        console.log(formData);
        console.log(formData.toString());
        const response = await fetch("http://localhost:3001/api" + endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
        redirect: "manual",
      });

      const responseData = await response.json(); 
      if (response.status === 201) {
        toast({
          title: response.statusText,
          status: "success",
          position: "bottom-right",
          duration: 5000,
          isClosable: true,
        });
        setSending(false);
      } else {
            toast({
                title: "Błąd " + responseData.error || response.statusText,
                status: "error",
                position: "bottom-right",
                duration: 5000,
                isClosable: true,
            });
            setSending(false);
        }
    } catch (err) {
      if (err instanceof CanceledError) return;
      toast({
        title: "Błąd: " + err,
        status: "error",
        position: "bottom-right",
        duration: 5000,
        isClosable: true,
      });
      setSending(false);
    }
  }; 

  return { isSending, sendData };
};

export default postData;
