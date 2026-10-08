import axiosInstance from "@/config/api.config";

export interface CreateProjectTemplateDto {
    framework: string;
    name: string;
}

export interface CreateProjectGitDto {
    gitUrl: string;
    name: string;
}

export const ProjectService = {
    /**
     * Creates a new project from a predefined framework template.
     */
    createWithTemplate: async (data: CreateProjectTemplateDto) => {
        const response = await axiosInstance.post('/project', {
            framework: data.framework,
            name: data.name
        });
        return response.data;
    },

    /**
     * Creates a new project by cloning a remote Git repository.
     */
    createWithGit: async (data: CreateProjectGitDto) => {
        const response = await axiosInstance.post('/project/git', data);
        return response.data;
    },

    /**
     * Gets the file tree for a specific project.
     */
    getProjectTree: async (projectId: string) => {
        const response = await axiosInstance.get(`/project/${projectId}/tree`);
        return response.data;
    }
};