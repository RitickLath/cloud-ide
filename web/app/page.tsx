"use client"
import Sandbox from '@/components/molecule/Sandbox'
import { CreateWorkspaceModal } from '@/components/organism/CreateWorkspaceModal'

const Home = () => {
    return (
        <div className="flex h-screen w-screen">
            {/* <Sandbox /> */}
            <CreateWorkspaceModal open={true} onOpenChange={() => {}} onCreate={() => {}} />
        </div>
    )
}

export default Home