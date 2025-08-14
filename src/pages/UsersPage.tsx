import { useState } from 'react';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Users, UserPlus, Search, Edit, Trash2, Shield, Crown, User } from 'lucide-react';

interface MockUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'active' | 'inactive';
  createdAt: Date;
  lastLogin: Date;
  ticketCount: number;
}

// Mock users data
const mockUsers: MockUser[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'user',
    status: 'active',
    createdAt: new Date('2024-01-01'),
    lastLogin: new Date('2024-01-15'),
    ticketCount: 3,
  },
  {
    id: '2',
    name: 'Sarah Support',
    email: 'sarah@support.com',
    role: 'support',
    status: 'active',
    createdAt: new Date('2023-12-15'),
    lastLogin: new Date('2024-01-15'),
    ticketCount: 25,
  },
  {
    id: '3',
    name: 'Admin Wilson',
    email: 'admin@company.com',
    role: 'admin',
    status: 'active',
    createdAt: new Date('2023-11-01'),
    lastLogin: new Date('2024-01-15'),
    ticketCount: 8,
  },
  {
    id: '4',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'user',
    status: 'active',
    createdAt: new Date('2024-01-10'),
    lastLogin: new Date('2024-01-14'),
    ticketCount: 1,
  },
  {
    id: '5',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    role: 'user',
    status: 'inactive',
    createdAt: new Date('2023-12-01'),
    lastLogin: new Date('2023-12-20'),
    ticketCount: 0,
  },
];

export function UsersPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState<MockUser[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<'active' | 'inactive' | 'all'>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'user' as UserRole,
  });

  // Only admins can access this page
  if (user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  // Filter users
  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || u.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleAddUser = () => {
    if (!newUser.name.trim() || !newUser.email.trim()) return;

    const user: MockUser = {
      id: Date.now().toString(),
      name: newUser.name.trim(),
      email: newUser.email.trim(),
      role: newUser.role,
      status: 'active',
      createdAt: new Date(),
      lastLogin: new Date(),
      ticketCount: 0,
    };

    setUsers(prev => [user, ...prev]);
    setNewUser({ name: '', email: '', role: 'user' });
    setIsAddDialogOpen(false);
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
  };

  const handleToggleStatus = (userId: string) => {
    setUsers(prev => prev.map(u => 
      u.id === userId 
        ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' }
        : u
    ));
  };

  const handleRoleChange = (userId: string, newRole: UserRole) => {
    setUsers(prev => prev.map(u => 
      u.id === userId 
        ? { ...u, role: newRole }
        : u
    ));
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return <Crown className="h-3 w-3" />;
      case 'support':
        return <Shield className="h-3 w-3" />;
      default:
        return <User className="h-3 w-3" />;
    }
  };

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return 'bg-priority-urgent text-priority-urgent-foreground';
      case 'support':
        return 'bg-status-progress text-status-progress-foreground';
      default:
        return 'bg-status-open text-status-open-foreground';
    }
  };

  const getStatusBadgeColor = (status: 'active' | 'inactive') => {
    return status === 'active' 
      ? 'bg-status-resolved text-status-resolved-foreground'
      : 'bg-status-closed text-status-closed-foreground';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">
            Manage user accounts, roles, and permissions
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>
                Create a new user account with the specified role and permissions.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={newUser.name}
                  onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter email address"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={newUser.role} onValueChange={(value) => setNewUser(prev => ({ ...prev, role: value as UserRole }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="support">Support Agent</SelectItem>
                    <SelectItem value="admin">Administrator</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddUser}>
                Add User
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-status-resolved">
              {users.filter(u => u.status === 'active').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Support Agents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-status-progress">
              {users.filter(u => u.role === 'support').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Administrators</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-priority-urgent">
              {users.filter(u => u.role === 'admin').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <Select value={roleFilter} onValueChange={(value) => setRoleFilter(value as UserRole | 'all')}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="support">Support</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as 'active' | 'inactive' | 'all')}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users ({filteredUsers.length})</CardTitle>
          <CardDescription>
            Manage user accounts and their permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tickets</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getRoleBadgeColor(user.role)}>
                      {getRoleIcon(user.role)}
                      <span className="ml-1 capitalize">{user.role}</span>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusBadgeColor(user.status)}>
                      {user.status === 'active' ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.ticketCount}</TableCell>
                  <TableCell>{formatDate(user.lastLogin)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Select 
                        value={user.role} 
                        onValueChange={(value) => handleRoleChange(user.id, value as UserRole)}
                      >
                        <SelectTrigger className="w-24 h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">User</SelectItem>
                          <SelectItem value="support">Support</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleToggleStatus(user.id)}
                      >
                        {user.status === 'active' ? 'Deactivate' : 'Activate'}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}