import { useCallback, useState } from "react";

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
}

interface UseApiReturn<T> {
  loading: boolean;
  isError: boolean;
  errMessage: string;
  data: T | null;
  isSuccess: boolean;
  successMessage: string;
  request: (
    apiFunction: () => Promise<ApiResponse<T>>
  ) => Promise<ApiResponse<T> | null>;
  reset: () => void;
}

function useApi<T>(): UseApiReturn<T> {
  const [loading, setLoading] = useState(false);

  const [isError, setIsError] = useState(false);

  const [errMessage, setErrMessage] = useState("");

  const [data, setData] = useState<T | null>(null);

  const [isSuccess, setIsSuccess] = useState(false);

  const [successMessage, setSuccessMessage] = useState("");

  const request = useCallback(
    async (
      apiFunction: () => Promise<ApiResponse<T>>
    ): Promise<ApiResponse<T> | null> => {
      setLoading(true);

      setIsError(false);
      setErrMessage("");

      setIsSuccess(false);
      setSuccessMessage("");

      setData(null);

      try {
        const response = await apiFunction();

        if (!response.success) {
          setIsError(true);
          setErrMessage(response.message);

          return response;
        }

        setData(response.data);

        setIsSuccess(true);
        setSuccessMessage(response.message);

        return response;
      } catch (error) {
        setIsError(true);

        setErrMessage(
          error instanceof Error
            ? error.message
            : "Something went wrong."
        );

        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const reset = useCallback(() => {
    setLoading(false);
    setIsError(false);
    setErrMessage("");
    setData(null);
    setIsSuccess(false);
    setSuccessMessage("");
  }, []);

  return {
    loading,
    isError,
    errMessage,
    data,
    isSuccess,
    successMessage,
    request,
    reset,
  };
}

export default useApi;