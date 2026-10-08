"use client"

import { useParams } from 'next/navigation'
import { useGetProjectTree } from '@/features/queries/useGetProjectTree';

const ProjectPage = () => {
    const params = useParams();
    const projectId = params?.projectId as string;

    const { data, isLoading } = useGetProjectTree(projectId);

    if (!projectId) return null;

  return (
    <div>
        {isLoading ? <div>Loading...</div> : <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  )
}

export default ProjectPage