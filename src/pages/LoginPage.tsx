import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Loader2, Ticket } from 'lucide-react';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login, isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const success = await login(email, password);
    
    if (!success) {
      setError('Invalid credentials. Please try again.');
    }
    
    setIsLoading(false);
  };

  const quickLogin = (role: 'user' | 'support' | 'admin') => {
    const emails = {
      user: 'user@example.com',
      support: 'support@example.com',
      admin: 'admin@example.com',
    };
    
    setEmail(emails[role]);
    setPassword('password');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20 p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo/Brand */}
        <div className="text-center">
          <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-primary rounded-full">
            <Ticket className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Ticket System</h1>
          <p className="text-muted-foreground">Sign in to your support portal</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Welcome back</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign in
              </Button>
            </form>

            {/* Demo credentials */}
            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground mb-3">
                Demo credentials (password: "password"):
              </p>
              <div className="grid gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => quickLogin('user')}
                  className="justify-start"
                >
                  <Badge className="mr-2 bg-status-open text-status-open-foreground">
                    User
                  </Badge>
                  user@example.com
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => quickLogin('support')}
                  className="justify-start"
                >
                  <Badge className="mr-2 bg-status-progress text-status-progress-foreground">
                    Support
                  </Badge>
                  support@example.com
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => quickLogin('admin')}
                  className="justify-start"
                >
                  <Badge className="mr-2 bg-priority-urgent text-priority-urgent-foreground">
                    Admin
                  </Badge>
                  admin@example.com
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-muted-foreground">
          <p>Need help? Contact support at help@ticketsystem.com</p>
        </div>
      </div>
    </div>
  );
}