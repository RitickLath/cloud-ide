import { useQuery } from "@tanstack/react-query"
import { AuthService } from "@/services/auth.service"

export interface CurrentUser {
  id: string
  email: string
  username: string
  name?: string
  role?: string
}

export const useGetMe = () => {
  return useQuery<CurrentUser | null>({
    queryKey: ["auth-me"],
    queryFn: async () => {
      try {
        const data = await AuthService.getMe()
        return data || null
      } catch {
        return null
      }
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
  })
}
