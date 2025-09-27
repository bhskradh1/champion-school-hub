import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  Bell, 
  Image, 
  FileText, 
  Users, 
  Mail,
  LogOut,
  Menu,
  Lock
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const menuItems = [
  { title: 'Dashboard', url: '/admin', icon: LayoutDashboard },
  { title: 'Events', url: '/admin/events', icon: Calendar },
  { title: 'Notices', url: '/admin/notices', icon: Bell },
  { title: 'Gallery', url: '/admin/gallery', icon: Image },
  { title: 'Results', url: '/admin/results', icon: FileText },
  { title: 'Leadership', url: '/admin/leadership', icon: Users },
  { title: 'Messages', url: '/admin/messages', icon: Mail },
  { title: 'Change Password', url: '/admin/change-password', icon: Lock },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { signOut, user } = useAuth();
  
  const isActive = (path: string) => location.pathname === path;
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar className={isCollapsed ? "w-14" : "w-60"} collapsible="icon">
      <SidebarHeader className="border-sidebar-border border-b bg-sidebar-background hidden lg:flex">
        <div className="flex items-center justify-between p-4">
          {!isCollapsed && (
            <h2 className="text-lg font-semibold text-sidebar-primary">Admin Panel</h2>
          )}
          <SidebarTrigger className="text-sidebar-foreground hover:bg-sidebar-accent" />
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-sidebar-background">
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/70 font-medium px-3">
            Management
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end
                      className={({ isActive }) => 
                        isActive 
                          ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium flex items-center gap-3 px-3 py-2 rounded-md" 
                          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex items-center gap-3 px-3 py-2 rounded-md transition-colors"
                      }
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-sidebar-border border-t bg-sidebar-background">
        <div className="p-4">
          {!isCollapsed && user && (
            <p className="text-sm text-sidebar-foreground/70 mb-2 truncate">
              {user.email}
            </p>
          )}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={signOut}
            className={`${isCollapsed ? "w-8 h-8 p-0" : "w-full"} border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground`}
          >
            <LogOut className="h-4 w-4" />
            {!isCollapsed && <span className="ml-2">Sign Out</span>}
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}