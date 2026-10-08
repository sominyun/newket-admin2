import { ApiError, apiPost } from "./client";

export interface LoginRequest {
  username: string;
  password: string;
}

function parseAdminName(data: unknown): string {
  if (typeof data === "string" && data.trim()) {
    return data;
  }

  if (data && typeof data === "object" && "name" in data) {
    const name = (data as { name: unknown }).name;
    if (typeof name === "string" && name.trim()) {
      return name;
    }
  }

  throw new Error("로그인 응답에서 이름을 찾을 수 없습니다.");
}

export async function loginAdmin(request: LoginRequest): Promise<string> {
  try {
    const response = await apiPost<unknown>("/login", request);
    return parseAdminName(response);
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      throw new Error("아이디 또는 비밀번호가 올바르지 않습니다.");
    }
    throw error;
  }
}

export function logoutAdmin() {
  return apiPost<void>("/logout");
}
