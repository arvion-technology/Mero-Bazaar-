export type RegisterPayload = {
  email: string;
  password: string;
  name: string;
  phone: string;
  role: "USER" | "VENDOR";
  address: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type AuthResponse = {
  access_token: string;
  user: {
    id: string;
    email: string;
    role: string;
  };
};