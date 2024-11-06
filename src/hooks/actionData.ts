import { useState } from "react";
import { CanceledError } from "axios";
import { useToast } from "@chakra-ui/react";

const actionData = (endpoint: string) => {
  const [isSending, setSending] = useState(false);
  const toast = useToast();

  const deleteData = (formData: URLSearchParams) => {
    const method = "DELETE";
    return sendData(formData, method);
  };

  const postData = async (formData: URLSearchParams): Promise<{ id?: number, message?: string | undefined  }> => {
    const method = "POST";
    return await sendData(formData, method);
  };

  const putData = (formData: URLSearchParams) => {
    const method = "PUT";
    return sendData(formData, method);
  };

  const sendData = async (formData: URLSearchParams, method: string): Promise<{ id?: number | undefined}> => {
    try {
      console.log(formData);
      console.log(formData.toString());
      const response = await fetch("http://localhost:3001/api" + endpoint, {
        method: method,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
        redirect: "manual",
      });

      const responseData = await response.json();      
      if (response.status === 200) {
        toast({
          title: responseData.message || "Success",
          status: "success",
          position: "bottom-right",
          duration: 5000,
          isClosable: true,
        });
        setSending(false);
        return responseData;
      } else {
        toast({
          title: "Błąd " + (responseData.error || response.statusText),
          status: "error",
          position: "bottom-right",
          duration: 5000,
          isClosable: true,
        });
        setSending(false);
        return {id: -1}; 
      }
    } catch (err) {
      if (err instanceof CanceledError) return {id: -1};
      toast({
        title: "Błąd: " + err,
        status: "error",
        position: "bottom-right",
        duration: 5000,
        isClosable: true,
      });
      setSending(false);
      return {id: -1}; 
    }
  };

  return { isSending, deleteData, postData, putData };
};

export default actionData;
