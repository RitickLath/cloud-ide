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
    const res = await axiosInstance.get("/auth/check-username", {
      params: { username },
    })

    const payload: any = res.data
    return { isAvailable: Boolean(payload?.data?.isAvailable) }
  },

  getMe: async () => {
    const res = await axiosInstance.get("/auth/me")
    const payload: any = res.data
    return payload?.data || payload
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

  logout: async () => {
    const res = await axiosInstance.post("/auth/logout")
    return res.data
  },
}
