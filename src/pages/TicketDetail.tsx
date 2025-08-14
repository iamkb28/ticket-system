import { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTickets } from '@/contexts/TicketContext';
import { TicketStatus } from '@/contexts/TicketContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { StatusBadge, PriorityBadge } from '@/components/ui/badge-variants';
import { ArrowLeft, Send, Calendar, User, MessageSquare, Edit } from 'lucide-react';

export function TicketDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { tickets, updateTicket, addComment } = useTickets();
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const ticket = tickets.find(t => t.id === id);

  if (!ticket) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold mb-2">Ticket Not Found</h2>
        <p className="text-muted-foreground mb-4">The ticket you're looking for doesn't exist.</p>
        <Button asChild>
          <Link to="/dashboard">Back to Dashboard</Link>
        </Button>
      </div>
    );
  }

  // Check permissions
  const canEdit = user?.role === 'admin' || user?.role === 'support' || ticket.authorId === user?.id;
  const canChangeStatus = user?.role === 'admin' || user?.role === 'support';
  const canAssign = user?.role === 'admin';

  if (!canEdit) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmittingComment(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    addComment(ticket.id, newComment.trim(), user!.name, user!.role);
    setNewComment('');
    setIsSubmittingComment(false);
  };

  const handleStatusChange = async (newStatus: TicketStatus) => {
    setIsUpdating(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    updateTicket(ticket.id, { status: newStatus });
    setIsUpdating(false);
  };

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getAuthorInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'text-priority-urgent';
      case 'support':
        return 'text-status-progress';
      default:
        return 'text-status-open';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link to="/dashboard">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-3xl font-bold tracking-tight">{ticket.subject}</h1>
            <span className="text-lg text-muted-foreground">#{ticket.id}</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Created {formatDateTime(ticket.createdAt)}
            </span>
            <span className="flex items-center gap-1">
              <User className="h-4 w-4" />
              {ticket.authorName}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <PriorityBadge priority={ticket.priority} />
          <StatusBadge status={ticket.status} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Ticket Description */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Description
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{ticket.description}</p>
            </CardContent>
          </Card>

          {/* Comments */}
          <Card>
            <CardHeader>
              <CardTitle>Comments ({ticket.comments.length})</CardTitle>
              <CardDescription>
                Discussion and updates for this ticket
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {ticket.comments.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  No comments yet. Be the first to add one!
                </p>
              ) : (
                <div className="space-y-4">
                  {ticket.comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {getAuthorInitials(comment.author)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{comment.author}</span>
                          <span className={`text-xs capitalize ${getRoleColor(comment.authorRole)}`}>
                            {comment.authorRole}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatDateTime(comment.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm whitespace-pre-wrap">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <Separator />

              {/* Add Comment Form */}
              <form onSubmit={handleAddComment} className="space-y-3">
                <Label htmlFor="comment">Add a comment</Label>
                <Textarea
                  id="comment"
                  placeholder="Type your comment here..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="min-h-20"
                />
                <Button type="submit" disabled={isSubmittingComment || !newComment.trim()}>
                  {isSubmittingComment ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-foreground" />
                      Posting...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Post Comment
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Management */}
          {canChangeStatus && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Edit className="h-5 w-5" />
                  Manage Ticket
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select 
                    value={ticket.status} 
                    onValueChange={handleStatusChange}
                    disabled={isUpdating}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Ticket Information */}
          <Card>
            <CardHeader>
              <CardTitle>Ticket Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label className="text-xs text-muted-foreground">Priority</Label>
                <div className="mt-1">
                  <PriorityBadge priority={ticket.priority} />
                </div>
              </div>
              
              <div>
                <Label className="text-xs text-muted-foreground">Status</Label>
                <div className="mt-1">
                  <StatusBadge status={ticket.status} />
                </div>
              </div>

              <div>
                <Label className="text-xs text-muted-foreground">Created by</Label>
                <p className="text-sm font-medium">{ticket.authorName}</p>
              </div>

              {ticket.assignedToName && (
                <div>
                  <Label className="text-xs text-muted-foreground">Assigned to</Label>
                  <p className="text-sm font-medium">{ticket.assignedToName}</p>
                </div>
              )}

              <div>
                <Label className="text-xs text-muted-foreground">Created</Label>
                <p className="text-sm">{formatDateTime(ticket.createdAt)}</p>
              </div>

              <div>
                <Label className="text-xs text-muted-foreground">Last updated</Label>
                <p className="text-sm">{formatDateTime(ticket.updatedAt)}</p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {canChangeStatus && ticket.status !== 'resolved' && (
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => handleStatusChange('resolved')}
                  disabled={isUpdating}
                >
                  Mark as Resolved
                </Button>
              )}
              {canChangeStatus && ticket.status !== 'closed' && (
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => handleStatusChange('closed')}
                  disabled={isUpdating}
                >
                  Close Ticket
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}