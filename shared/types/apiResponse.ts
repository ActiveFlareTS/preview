import type { User } from "./models";


// Generic type that requires at least the base properties, but allows additional ones
export type ApiResponseBase = {
  success: boolean;
  statusText?: string
  message?: string;
  token?: string;
  user?: User;
};

export type ApiResponse<T = object> = ApiResponseBase & T & { success: boolean };
