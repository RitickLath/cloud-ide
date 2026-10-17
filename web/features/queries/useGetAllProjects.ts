import { ProjectService } from "@/services/project.service"
import { useQuery } from "@tanstack/react-query"

export interface WorkspaceItem {
  id: string
  ownerId: string
  name: string
  slug: string
  description?: string | null
  framework: string
  gitUrl?: string | null
  visibility: "PRIVATE" | "PUBLIC" | "UNLISTED"
  status: "CREATING" | "READY" | "ARCHIVED" | "ERROR"
  createdAt: string
  updatedAt: string
  lastAccessedAt?: string
  owner?: {
    id: string
    username: string
    email: string
  }
  members?: Array<{
    user: {
      id: string
      username: string
      email: string
    }
  }>
}

export const useGetAllProjects = () => {
  return useQuery<WorkspaceItem[]>({
    queryKey: ["projects"],
    queryFn: async () => {
      const res = await ProjectService.getAllProjects()
      return Array.isArray(res) ? res : []
    },
  })
}
