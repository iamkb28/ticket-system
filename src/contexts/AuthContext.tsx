import React, { createContext, useContext, useState } from 'react';

export type UserRole = 'user' | 'support' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demonstration
const mockUsers: Record<UserRole, User> = {
  user: {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'user',
  },
  support: {
    id: '2',
    name: 'Sarah Support',
    email: 'sarah@support.com',
    role: 'support',
  },
  admin: {
    id: '3',
    name: 'Admin Wilson',
    email: 'admin@company.com',
    role: 'admin',
  },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock authentication - in real app, this would call an API
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
    
    // Simple mock logic - you can login as any role using these credentials:
    // user@example.com / password -> user role
    // support@example.com / password -> support role  
    // admin@example.com / password -> admin role
    
    let loginRole: UserRole = 'user';
    if (email.includes('support')) loginRole = 'support';
    if (email.includes('admin')) loginRole = 'admin';
    
    if (password === 'password') {
      setUser(mockUsers[loginRole]);
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  const switchRole = (role: UserRole) => {
    // For demo purposes - allows switching between roles
    setUser(mockUsers[role]);
  };

  const value = {
    user,
    login,
    logout,
    switchRole,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}