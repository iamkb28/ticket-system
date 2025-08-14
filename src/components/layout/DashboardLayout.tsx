import { useState } from 'react';
import { Outlet, NavLink, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import {
  Ticket,
  Users,
  Settings,
  BarChart3,
  Plus,
  Menu,
  LogOut,
  User,
  Shield,
  Crown,
} from 'lucide-react';

interface NavigationItem {
  title: string;
  url: string;
  icon: React.ComponentType<any>;
  roles: string[];
}

const navigationItems: NavigationItem[] = [
  {
    title: 'My Tickets',
    url: '/dashboard',
    icon: Ticket,
    roles: ['user', 'support', 'admin'],
  },
  {
    title: 'Create Ticket',
    url: '/create-ticket',
    icon: Plus,
    roles: ['user', 'support', 'admin'],
  },
  {
    title: 'All Tickets',
    url: '/tickets',
    icon: BarChart3,
    roles: ['support', 'admin'],
  },
  {
    title: 'Users',
    url: '/users',
    icon: Users,
    roles: ['admin'],
  },
  {
    title: 'Settings',
    url: '/settings',
    icon: Settings,
    roles: ['user', 'support', 'admin'],
  },
];

export function DashboardLayout() {
  const { user, logout, switchRole } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const allowedItems = navigationItems.filter(item => 
    item.roles.includes(user.role)
  );

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Crown className="h-3 w-3" />;
      case 'support':
        return <Shield className="h-3 w-3" />;
      default:
        return <User className="h-3 w-3" />;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-priority-urgent text-priority-urgent-foreground';
      case 'support':
        return 'bg-status-progress text-status-progress-foreground';
      default:
        return 'bg-status-open text-status-open-foreground';
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <Sidebar className="w-64">
          <SidebarContent className="p-4">
            {/* Logo/Brand */}
            <div className="mb-6">
              <h1 className="text-xl font-bold text-primary">
                Ticket System
              </h1>
              <p className="text-sm text-muted-foreground">
                Support System
              </p>
            </div>

            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {allowedItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <NavLink 
                          to={item.url}
                          className={({ isActive }) => 
                            isActive 
                              ? "bg-primary text-primary-foreground font-medium" 
                              : "hover:bg-muted"
                          }
                        >
                          <item.icon className="mr-2 h-4 w-4" />
                          <span>{item.title}</span>
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* Demo Role Switcher */}
            <SidebarGroup className="mt-8">
              <SidebarGroupLabel>Demo Mode</SidebarGroupLabel>
              <SidebarGroupContent>
                <div className="space-y-2">
                  <Button
                    variant={user.role === 'user' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => switchRole('user')}
                    className="w-full justify-start"
                  >
                    <User className="mr-2 h-3 w-3" />
                    User View
                  </Button>
                  <Button
                    variant={user.role === 'support' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => switchRole('support')}
                    className="w-full justify-start"
                  >
                    <Shield className="mr-2 h-3 w-3" />
                    Support View
                  </Button>
                  <Button
                    variant={user.role === 'admin' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => switchRole('admin')}
                    className="w-full justify-start"
                  >
                    <Crown className="mr-2 h-3 w-3" />
                    Admin View
                  </Button>
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-16 border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50 flex items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <div>
                <h2 className="text-lg font-semibold">
                  Welcome back, {user.name}
                </h2>
                <p className="text-sm text-muted-foreground">
                  Manage your support tickets
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Badge className={getRoleBadgeColor(user.role)}>
                {getRoleIcon(user.role)}
                <span className="ml-1 capitalize">{user.role}</span>
              </Badge>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}