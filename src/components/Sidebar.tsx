import Link from 'next/link';
import { Home, FolderCode, Cpu } from 'lucide-react';

export function Sidebar() {
  return (
      <nav className="flex flex-col h-full space-y-2 p-4">
        <Link 
          href="/" 
          className="flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
        >
          <Home className="h-4 w-4" />
          Dashboard
        </Link>
        <Link 
          href="/projects" 
          className="flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
        >
          <FolderCode className="h-4 w-4" />
          Projects
        </Link>
        <Link 
          href="/technologies" 
          className="flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
        >
          <Cpu className="h-4 w-4" />
          Technologies
        </Link>
      </nav>
  );
}
