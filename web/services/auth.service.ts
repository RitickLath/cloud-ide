import axiosInstance from "@/config/api.config"

export interface RegisterDto {
  username: string
  email: string
  password: string
  role?: "STUDENT" | "TUTOR" | "ADMIN"
}

export interface LoginDto {
  username: string
  password: string
}

export const AuthService = {
  checkUsername: async (username: string) => {
    const res = await axiosInstance.get<{ isAvailable: boolean }>(
      "/auth/check-username",
      {
        params: { username },
      }
    )
    return res.data
  },

  register: async (data: RegisterDto) => {
    const res = await axiosInstance.post("/auth/register", data)
    return res.data
  },

  login: async (data: LoginDto) => {
    const res = await axiosInstance.post("/auth/login", data)
    return res.data
  },

  verifyEmail: async (token: string, email: string) => {
    const res = await axiosInstance.get("/auth/verify-email", {
      params: { token, email },
    })
    return res.data
  },
}
