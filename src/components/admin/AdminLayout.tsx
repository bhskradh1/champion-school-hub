import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { AdminSidebar } from './AdminSidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Loader2 } from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col w-full">
        {/* Mobile header with sidebar trigger */}
        <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:hidden">
          <SidebarTrigger className="text-foreground" />
          <h1 className="text-lg font-semibold text-foreground">Admin Panel</h1>
        </header>
        
        <div className="flex flex-1 w-full">
          <AdminSidebar />
          <main className="flex-1 overflow-hidden">
            <div className="h-full p-6 overflow-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}