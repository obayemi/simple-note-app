import { Credentials, TokenPair } from "../models/auth";
import axios from "axios";

export async function loginRequest(
  credentials: Credentials
): Promise<TokenPair> {
  const response = await axios.post<TokenPair>("/jwt/create", credentials);
  if (response.status !== 200) {
    throw new Error("invalid login");
  }
  return response.data;
}

export async function verifyToken(token: string) {
  const response = await axios.post("/jwt/verify", { token });
  if (response.status !== 200) {
    throw new Error("invalid login");
  }
  return response.status === 200;
}

export async function refreshTokenRequest(refreshToken: string) {
  const response = await axios.post<{ access: string }>("/jwt/refresh", {
    refresh: refreshToken,
  });
  if (response.status !== 200) {
    throw Error("invalid refresh token");
  }
  return response.data.access;
}
