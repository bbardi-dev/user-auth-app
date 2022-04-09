export interface UserResponse {
  data: Data;
  isValidating: boolean;
}

export interface Data {
  _id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  iat: number;
  exp: number;
}
