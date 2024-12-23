import { SetStateAction, useEffect, useState } from "react";
import apiClient from "../services/api-client";
import { AxiosRequestConfig, CanceledError } from "axios";

const useData = <T>(endpoint: string, requestConfig?: AxiosRequestConfig, deps?: any[]) => {
    const [data, setData] = useState<T[]>([]);
    const [error, setError] = useState("");
    const [isLoading, setLoading] = useState(false);
  
    useEffect(() => {
        const controller = new AbortController();

        setLoading(true);
        apiClient
            .get<SetStateAction<T[]>>(endpoint, {signal: controller.signal, ...requestConfig})
            .then((res) => {
              setData(res.data)
              setLoading(false);
              setError("");
            })
            .catch((err) => {
                if(err instanceof CanceledError) return;
                setError(err.message)
                setLoading(false);
              });

        return () => controller.abort();   
    }, deps ? [...deps] : []);

    return { data, isLoading, error};
}

export default useData;
