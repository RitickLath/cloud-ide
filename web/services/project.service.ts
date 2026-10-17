import axiosInstance from "@/config/api.config"

export interface CreateProjectTemplateDto {
  framework: string
  name: string
}

export interface CreateProjectGitDto {
  gitUrl: string
  name: string
}

export const ProjectService = {
  /**
   * Creates a new project from a predefined framework template.
   */
  createWithTemplate: async (data: CreateProjectTemplateDto) => {
    const response = await axiosInstance.post("/project", {
      framework: data.framework,
      name: data.name,
    })
    return response.data
  },

  /**
   * Creates a new project by cloning a remote Git repository.
   */
  createWithGit: async (data: CreateProjectGitDto) => {
    const response = await axiosInstance.post("/project/git", data)
    return response.data
  },

  /**
   * Gets the file tree for a specific project.
   */
  getProjectTree: async (projectId: string) => {
    const response = await axiosInstance.get(`/project/${projectId}/tree`)
    return response.data
  },

  /**
   * Gets all projects/workspaces for the authenticated user.
   */
  getAllProjects: async () => {
    const response = await axiosInstance.get("/project")
    const payload: any = response.data
    return payload?.data || payload
  },

  /**
   * Invites a user/collaborator to the project.
   */
  inviteMember: async (
    projectId: string,
    data: { email: string; role?: "EDITOR" | "VIEWER" }
  ) => {
    const response = await axiosInstance.post(
      `/project/${projectId}/invite`,
      data
    )
    return response.data
  },

  /**
   * Gets all workspace invitations for current logged in user.
   */
  getMyInvites: async () => {
    const response = await axiosInstance.get("/project/invites")
    const payload: any = response.data
    return payload?.data || payload
  },

  /**
   * Responds to a workspace invitation (ACCEPT or DECLINE).
   */
  respondToInvite: async (inviteId: string, action: "ACCEPT" | "DECLINE") => {
    const response = await axiosInstance.post(
      `/project/invites/${inviteId}/respond`,
      { action }
    )
    const payload: any = response.data
    return payload?.data || payload
  },
}
