import { ProjectService } from "@/services/project.service";
import { useQuery } from "@tanstack/react-query";

export const useGetProjectTree = (projectId: string) => {
    return useQuery({
        queryKey: ["project-tree", projectId],
        queryFn: () => ProjectService.getProjectTree(projectId),
    });
};