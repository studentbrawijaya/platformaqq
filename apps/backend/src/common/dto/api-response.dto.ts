export class ApiResponseDto<TData> {
  success: boolean;
  data?: TData;
  meta?: { page: number; limit: number; total: number };
}
