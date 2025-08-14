import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTickets } from '@/contexts/TicketContext';
import { TicketPriority } from '@/contexts/TicketContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { PriorityBadge } from '@/components/ui/badge-variants';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export function CreateTicket() {
  const { user } = useAuth();
  const { createTicket } = useTickets();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    priority: 'medium' as TicketPriority,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.subject.trim() || !formData.description.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      createTicket({
        subject: formData.subject.trim(),
        description: formData.description.trim(),
        priority: formData.priority,
        status: 'open',
        authorId: user!.id,
        authorName: user!.name,
      });

      // Navigate back to dashboard
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to create ticket. Please try again.');
      setIsSubmitting(false);
    }
  };

  const getPriorityDescription = (priority: TicketPriority) => {
    switch (priority) {
      case 'low':
        return 'General questions or minor issues that are not time-sensitive';
      case 'medium':
        return 'Standard issues that need attention but are not urgent';
      case 'high':
        return 'Important issues that significantly impact your work';
      case 'urgent':
        return 'Critical issues that block your ability to work or affect many users';
      default:
        return '';
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link to="/dashboard">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create New Ticket</h1>
          <p className="text-muted-foreground">
            Describe your issue and we'll help you resolve it
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ticket Information</CardTitle>
          <CardDescription>
            Please provide detailed information about your issue to help us assist you better.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="subject">
                Subject <span className="text-destructive">*</span>
              </Label>
              <Input
                id="subject"
                placeholder="Brief description of your issue"
                value={formData.subject}
                onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                required
              />
              <p className="text-sm text-muted-foreground">
                Be specific and concise. This helps us categorize and prioritize your request.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">
                Description <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="description"
                placeholder="Provide detailed information about your issue, including steps to reproduce, error messages, and any relevant context..."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="min-h-32"
                required
              />
              <p className="text-sm text-muted-foreground">
                Include as much detail as possible: what you were trying to do, what happened, 
                what you expected to happen, and any error messages you received.
              </p>
            </div>

            <div className="space-y-3">
              <Label htmlFor="priority">Priority</Label>
              <Select 
                value={formData.priority} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value as TicketPriority }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">
                    <div className="flex items-center gap-2">
                      <PriorityBadge priority="low" />
                      <span>Low Priority</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="medium">
                    <div className="flex items-center gap-2">
                      <PriorityBadge priority="medium" />
                      <span>Medium Priority</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="high">
                    <div className="flex items-center gap-2">
                      <PriorityBadge priority="high" />
                      <span>High Priority</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="urgent">
                    <div className="flex items-center gap-2">
                      <PriorityBadge priority="urgent" />
                      <span>Urgent</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <div className="p-3 bg-muted rounded-md">
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground capitalize">{formData.priority} Priority:</strong>{' '}
                  {getPriorityDescription(formData.priority)}
                </p>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-foreground" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Create Ticket
                  </>
                )}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link to="/dashboard">Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Help section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Need Help?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div>
              <h4 className="font-medium">Response Times</h4>
              <ul className="mt-1 space-y-1 text-muted-foreground">
                <li>• <strong>Urgent:</strong> 1-2 hours</li>
                <li>• <strong>High:</strong> 4-6 hours</li>
                <li>• <strong>Medium:</strong> 1-2 business days</li>
                <li>• <strong>Low:</strong> 3-5 business days</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium">Before Creating a Ticket</h4>
              <ul className="mt-1 space-y-1 text-muted-foreground">
                <li>• Check our knowledge base for common solutions</li>
                <li>• Search existing tickets to avoid duplicates</li>
                <li>• Gather relevant screenshots or error logs</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}