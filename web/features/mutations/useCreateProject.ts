import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
  ProjectService,
  CreateProjectTemplateDto,
  CreateProjectGitDto,
} from "@/services/project.service"

export const useCreateProject = () => {
  const queryClient = useQueryClient()

  const templateMutation = useMutation({
    mutationFn: (data: CreateProjectTemplateDto) =>
      ProjectService.createWithTemplate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] })
    },
  })

  const gitMutation = useMutation({
    mutationFn: (data: CreateProjectGitDto) =>
      ProjectService.createWithGit(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] })
    },
  })

  return {
    createWithTemplate: templateMutation,
    createWithGit: gitMutation,
  }
}
