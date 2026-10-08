import { Bot, Component, TerminalSquare, Box, Code2 } from 'lucide-react'

export const TEMPLATES = [
  {
    id: 'NEXTJS',
    title: 'Next.js 14',
    description: 'App Router, Tailwind CSS, TypeScript, fast compilation.',
    tags: ['v14.2', 'Node 20'],
    icon: <Box className="size-4 text-white" />,
    category: 'Fullstack'
  },
  {
    id: 'REACT',
    title: 'React + Vite',
    description: 'Fast HMR, Tailwind, SWC compiler & Vitest',
    tags: ['Vite 5', 'React 18'],
    icon: <Component className="size-4 text-blue-400" />,
    category: 'Frontend'
  },
  {
    id: 'NODEJS',
    title: 'Node.js + Express',
    description: 'REST API boilerplate, TypeScript 5, Prisma ORM',
    tags: ['Express 4.x', 'Prisma'],
    icon: <TerminalSquare className="size-4 text-green-500" />,
    category: 'Backend & AI'
  },
  {
    id: 'PYTHON',
    title: 'Python Data Science',
    description: 'Jupyter Notebooks, Pandas, NumPy, Scikit-learn',
    tags: ['JupyterLab', 'ML Base'],
    icon: <Bot className="size-4 text-yellow-500" />,
    category: 'Backend & AI'
  },
  {
    id: 'FASTAPI',
    title: 'FastAPI + Python 3.11',
    description: 'Uvicorn, Pydantic v2, Async SQLAlchemy & Alembic',
    tags: ['Python 3.11', 'REST'],
    icon: <Code2 className="size-4 text-emerald-400" />,
    category: 'Backend & AI'
  },
  {
    id: 'NESTJS',
    title: 'NestJS Framework',
    description: 'A progressive Node.js framework for building efficient backend applications.',
    tags: ['Node 20', 'TypeScript'],
    icon: <Box className="size-4 text-red-500" />,
    category: 'Backend & AI'
  }
]