export interface ProjectCollaborator {
  id: string
  name: string
  email: string
  role: "Owner" | "Maintainer" | "Editor" | "Viewer"
  avatar: string
  status: "active" | "invited"
}

export interface WorkspaceProject {
  id: string
  name: string
  framework: string
  description: string
  status: "Running" | "Stopped" | "Idle"
  port?: number
  vCpu: string
  ram: string
  branch: string
  lastActive: string
  category: "Next.js" | "React" | "Node" | "Python" | "Go"
  iconBg: string
  collaborators: ProjectCollaborator[]
}

export const MOCK_PROJECTS: WorkspaceProject[] = [
  {
    id: "proj-1",
    name: "acme-commerce-storefront",
    framework: "Next.js 14 · App Router",
    description:
      "Production e-commerce storefront with server components and edge caching.",
    status: "Running",
    port: 3000,
    vCpu: "2 vCPU",
    ram: "4GB RAM",
    branch: "main",
    lastActive: "2 mins ago",
    category: "Next.js",
    iconBg: "bg-black/60 border-white/20 text-white",
    collaborators: [
      {
        id: "c-1",
        name: "Ritick Lath",
        email: "ritick@cloudide.io",
        role: "Owner",
        avatar:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop&crop=faces",
        status: "active",
      },
      {
        id: "c-2",
        name: "Alex Dev",
        email: "alex@cloudide.io",
        role: "Maintainer",
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=faces",
        status: "active",
      },
      {
        id: "c-3",
        name: "Sarah Chen",
        email: "sarah@cloudide.io",
        role: "Editor",
        avatar:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop&crop=faces",
        status: "active",
      },
    ],
  },
  {
    id: "proj-2",
    name: "ai-agent-orchestrator",
    framework: "FastAPI + Python 3.11",
    description:
      "Autonomous task execution runtime with vector store embeddings.",
    status: "Stopped",
    vCpu: "4 vCPU",
    ram: "8GB RAM",
    branch: "feature/rag",
    lastActive: "1 hr ago",
    category: "Python",
    iconBg: "bg-amber-500/10 border-amber-500/20 text-amber-400",
    collaborators: [
      {
        id: "c-1",
        name: "Ritick Lath",
        email: "ritick@cloudide.io",
        role: "Owner",
        avatar:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop&crop=faces",
        status: "active",
      },
      {
        id: "c-4",
        name: "Michael Torres",
        email: "michael@cloudide.io",
        role: "Maintainer",
        avatar:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop&crop=faces",
        status: "active",
      },
    ],
  },
  {
    id: "proj-3",
    name: "crypto-portfolio-dashboard",
    framework: "React 18 + Vite + Tailwind",
    description:
      "Realtime WebSocket ticker and responsive candlestick chart visualization.",
    status: "Running",
    port: 5173,
    vCpu: "2 vCPU",
    ram: "4GB RAM",
    branch: "main",
    lastActive: "4 hrs ago",
    category: "React",
    iconBg: "bg-cyan-500/10 border-cyan-500/20 text-cyan-400",
    collaborators: [
      {
        id: "c-1",
        name: "Ritick Lath",
        email: "ritick@cloudide.io",
        role: "Owner",
        avatar:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop&crop=faces",
        status: "active",
      },
      {
        id: "c-5",
        name: "Elena Rostova",
        email: "elena@cloudide.io",
        role: "Editor",
        avatar:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=faces",
        status: "invited",
      },
    ],
  },
  {
    id: "proj-4",
    name: "realtime-chat-server",
    framework: "Node.js + WebSockets + Redis",
    description: "Distributed pub/sub messaging engine with presence tracking.",
    status: "Idle",
    vCpu: "2 vCPU",
    ram: "4GB RAM",
    branch: "dev",
    lastActive: "Yesterday",
    category: "Node",
    iconBg: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
    collaborators: [
      {
        id: "c-1",
        name: "Ritick Lath",
        email: "ritick@cloudide.io",
        role: "Owner",
        avatar:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop&crop=faces",
        status: "active",
      },
      {
        id: "c-2",
        name: "Alex Dev",
        email: "alex@cloudide.io",
        role: "Editor",
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=faces",
        status: "active",
      },
    ],
  },
  {
    id: "proj-5",
    name: "docs-site-astro",
    framework: "Astro 4.0 · Content Collections",
    description: "Static technical documentation with full-text search index.",
    status: "Stopped",
    vCpu: "1 vCPU",
    ram: "2GB RAM",
    branch: "main",
    lastActive: "3 days ago",
    category: "React",
    iconBg: "bg-purple-500/10 border-purple-500/20 text-purple-400",
    collaborators: [
      {
        id: "c-1",
        name: "Ritick Lath",
        email: "ritick@cloudide.io",
        role: "Owner",
        avatar:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop&crop=faces",
        status: "active",
      },
    ],
  },
  {
    id: "proj-6",
    name: "internal-auth-service",
    framework: "Go 1.22 · gRPC microservice",
    description:
      "JWT token validation, OAuth2 providers, and user permission engine.",
    status: "Running",
    port: 8080,
    vCpu: "2 vCPU",
    ram: "4GB RAM",
    branch: "main",
    lastActive: "5 days ago",
    category: "Node",
    iconBg: "bg-blue-500/10 border-blue-500/20 text-blue-400",
    collaborators: [
      {
        id: "c-1",
        name: "Ritick Lath",
        email: "ritick@cloudide.io",
        role: "Owner",
        avatar:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop&crop=faces",
        status: "active",
      },
      {
        id: "c-3",
        name: "Sarah Chen",
        email: "sarah@cloudide.io",
        role: "Maintainer",
        avatar:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop&crop=faces",
        status: "active",
      },
    ],
  },
]
