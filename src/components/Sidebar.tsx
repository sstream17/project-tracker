
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, FolderCode, Cpu } from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();

  // Helper function to determine if a link is active
  const isActive = (path: string) => {
    // For the home page, match exactly
    if (path === '/') {
      return pathname === path;
    }
    // For other pages, check if the pathname starts with the link path
    return pathname.startsWith(path);
  };

  return (
      <nav className="flex flex-col h-full space-y-2 p-4">
        <Link 
          href="/" 
          className={`flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium hover:bg-accent ${isActive('/') ? 'text-accent-foreground' : ''}`}
        >
          <Home className="h-4 w-4" />
          Dashboard
        </Link>
        <Link 
          href="/projects" 
          className={`flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium hover:bg-accent ${isActive('/projects') ? 'text-accent-foreground' : ''}`}
        >
          <FolderCode className="h-4 w-4" />
          Projects
        </Link>
        <Link 
          href="/technologies" 
          className={`flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium hover:bg-accent ${isActive('/technologies') ? 'text-accent-foreground' : ''}`}
        >
          <Cpu className="h-4 w-4" />
          Technologies
        </Link>
      </nav>
  );
}
