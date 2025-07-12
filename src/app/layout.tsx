import type { Metadata } from 'next';
import { Sidebar } from '@/components/Sidebar';
import './globals.css';


export const metadata: Metadata = {
  title: 'Project Tracker',
  description: 'Track your learning progress through projects',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
