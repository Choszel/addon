import { useState } from "react";
import {  CanceledError } from "axios";
import { useToast } from "@chakra-ui/react";

const updateData = (endpoint: string) => {
  const [isSending, setSending] = useState(false); 
  const toast = useToast();
    
  const putData = async (formData: URLSearchParams) => {
    try {
        console.log(formData);
        console.log(formData.toString());
        const response = await fetch("http://localhost:3001/api" + endpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
        redirect: "manual",
      });

      const responseData = await response.json(); 
      if (response.status === 201) {
        toast({
          title: responseData.message,
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

  return { isSending, putData };
};

export default updateData;
