import { useMutation } from "@tanstack/react-query";
import { ProjectService, CreateProjectTemplateDto, CreateProjectGitDto } from "@/services/project.service";

export const useCreateProject = () => {
    const templateMutation = useMutation({
        mutationFn: (data: CreateProjectTemplateDto) => ProjectService.createWithTemplate(data),
    });

    const gitMutation = useMutation({
        mutationFn: (data: CreateProjectGitDto) => ProjectService.createWithGit(data),
    });

    return {
        createWithTemplate: templateMutation,
        createWithGit: gitMutation
    };
};