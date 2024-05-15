export interface User {
  id: string;
  email: string;
  password: string;
}

export interface UserPayload {
  email: string;
  password: string;
}
