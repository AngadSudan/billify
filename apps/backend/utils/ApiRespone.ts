class ApiResponse {
  statusCode: number;
  message: string;
  success: boolean;
  data?: string | object | any[] | null;
  error?: string | object | any[] | null;
  constructor(
    statusCode: number,
    message: string,
    payload: string | object | any[] | null
  ) {
    this.statusCode = statusCode;
    this.message = message;
    this.success = statusCode < 400;
    if (this.success) {
      this.data = payload;
    } else {
      this.error = payload;
    }
  }
}

export default ApiResponse;
