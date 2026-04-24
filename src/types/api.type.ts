export interface ApiSuccess<T = any> {
  success: true
  data: T
}

export interface ApiError {
  success: false
  message: string
}

export type ApiResponse<T = any> = ApiSuccess<T> | ApiError