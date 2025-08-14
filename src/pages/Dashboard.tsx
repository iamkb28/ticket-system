import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTickets } from '@/contexts/TicketContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StatusBadge, PriorityBadge } from '@/components/ui/badge-variants';
import { TicketStatus, TicketPriority } from '@/contexts/TicketContext';
import { Plus, Search, Filter, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Dashboard() {
  const { user } = useAuth();
  const { getTicketsByUser, getAllTickets } = useTickets();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<TicketStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<TicketPriority | 'all'>('all');

  // Get tickets based on user role
  const allTickets = user?.role === 'user' 
    ? getTicketsByUser(user.id) 
    : getAllTickets();

  // Apply filters
  const filteredTickets = allTickets.filter(ticket => {
    const matchesSearch = ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Get ticket statistics
  const stats = {
    total: allTickets.length,
    open: allTickets.filter(t => t.status === 'open').length,
    inProgress: allTickets.filter(t => t.status === 'in-progress').length,
    resolved: allTickets.filter(t => t.status === 'resolved').length,
    closed: allTickets.filter(t => t.status === 'closed').length,
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {user?.role === 'user' ? 'My Tickets' : 'All Tickets'}
          </h1>
          <p className="text-muted-foreground">
            {user?.role === 'user' 
              ? 'Manage and track your support requests' 
              : 'Monitor and manage all support tickets'}
          </p>
        </div>
        <Button asChild>
          <Link to="/create-ticket">
            <Plus className="mr-2 h-4 w-4" />
            New Ticket
          </Link>
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-status-open">{stats.open}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-status-progress">{stats.inProgress}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-status-resolved">{stats.resolved}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Closed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-status-closed">{stats.closed}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filter Tickets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tickets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as TicketStatus | 'all')}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={(value) => setPriorityFilter(value as TicketPriority | 'all')}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tickets List */}
      <div className="space-y-4">
        {filteredTickets.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No tickets found</p>
                <Button asChild>
                  <Link to="/create-ticket">
                    <Plus className="mr-2 h-4 w-4" />
                    Create your first ticket
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredTickets.map((ticket) => (
            <Card key={ticket.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold">{ticket.subject}</h3>
                      <span className="text-sm text-muted-foreground">#{ticket.id}</span>
                    </div>
                    <p className="text-muted-foreground line-clamp-2">
                      {ticket.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Created {formatDate(ticket.createdAt)}</span>
                      <span>Updated {formatDate(ticket.updatedAt)}</span>
                      {user?.role !== 'user' && (
                        <span>by {ticket.authorName}</span>
                      )}
                      {ticket.assignedToName && (
                        <span>Assigned to {ticket.assignedToName}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <PriorityBadge priority={ticket.priority} />
                    <StatusBadge status={ticket.status} />
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/ticket/${ticket.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}