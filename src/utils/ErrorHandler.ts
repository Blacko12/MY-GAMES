import axios, { AxiosError } from 'axios';

interface ApiError {
  message: string;
  status: number;
  code?: string;
}

class ErrorHandler {
  static handle(error: any): ApiError {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<any>;
      return {
        message:
          axiosError.response?.data?.message || axiosError.message || 'An error occurred',
        status: axiosError.response?.status || 0,
        code: axiosError.code,
      };
    }

    return {
      message: 'An unexpected error occurred',
      status: 0,
    };
  }

  static getErrorMessage(error: ApiError): string {
    switch (error.status) {
      case 400:
        return 'Bad request. Please check your input.';
      case 401:
        return 'Unauthorized. Please login again.';
      case 403:
        return 'Forbidden. You do not have access to this resource.';
      case 404:
        return 'Resource not found.';
      case 500:
        return 'Server error. Please try again later.';
      default:
        return error.message;
    }
  }
}

export default ErrorHandler;