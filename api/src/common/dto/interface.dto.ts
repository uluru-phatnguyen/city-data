export interface ApiResponse<T> {
  error: boolean;
  message: string;
  errorCode: string | null;
  statusCode: number;
  data: T | null;
}

export function createResponse<T>(
  error: boolean,
  message: string,
  statusCode: number,
  data: T | null = null,
  errorCode: string | null = null,
): ApiResponse<T> {
  return {
    error,
    message,
    errorCode,
    statusCode,
    data,
  };
}
