import { ProjectService } from "@/services/project.service"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

export interface WorkspaceInviteItem {
  id: string
  workspaceId: string
  email: string
  role: "OWNER" | "EDITOR" | "VIEWER"
  status: "PENDING" | "ACCEPTED" | "DECLINED" | "EXPIRED"
  token: string
  expiresAt: string
  createdAt: string
  workspace?: {
    id: string
    name: string
    slug: string
    framework: string
    description?: string | null
    owner?: {
      username: string
      email: string
    }
  }
}

export const useGetMyInvites = () => {
  return useQuery<WorkspaceInviteItem[]>({
    queryKey: ["workspace-invites"],
    queryFn: async () => {
      try {
        const res = await ProjectService.getMyInvites()
        return Array.isArray(res) ? res : []
      } catch {
        return []
      }
    },
  })
}

export const useRespondToInvite = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      inviteId,
      action,
    }: {
      inviteId: string
      action: "ACCEPT" | "DECLINE"
    }) => ProjectService.respondToInvite(inviteId, action),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["workspace-invites"] })
      if (variables.action === "ACCEPT") {
        queryClient.invalidateQueries({ queryKey: ["projects"] })
      }
    },
  })
}
