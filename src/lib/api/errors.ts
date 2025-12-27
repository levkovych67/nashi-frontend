export class ApiError extends Error {
  status: number;
  statusText: string;
  data?: unknown;

  constructor(
    status: number,
    statusText: string,
    data?: unknown
  ) {
    super(`API Error ${status}: ${statusText}`);
    this.name = 'ApiError';
    this.status = status;
    this.statusText = statusText;
    this.data = data;
  }
}
