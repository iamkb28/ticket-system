import React, { createContext, useContext, useState } from 'react';

export type TicketStatus = 'open' | 'in-progress' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Comment {
  id: string;
  content: string;
  author: string;
  authorRole: string;
  timestamp: Date;
}

export interface Ticket {
  id: string;
  subject: string;
  description: string;
  priority: TicketPriority;
  status: TicketStatus;
  authorId: string;
  authorName: string;
  assignedTo?: string;
  assignedToName?: string;
  createdAt: Date;
  updatedAt: Date;
  comments: Comment[];
  attachments?: string[];
}

interface TicketContextType {
  tickets: Ticket[];
  createTicket: (ticket: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt' | 'comments'>) => void;
  updateTicket: (id: string, updates: Partial<Ticket>) => void;
  addComment: (ticketId: string, content: string, author: string, authorRole: string) => void;
  getTicketsByUser: (userId: string) => Ticket[];
  getAllTickets: () => Ticket[];
}

const TicketContext = createContext<TicketContextType | undefined>(undefined);

// Mock ticket data
const mockTickets: Ticket[] = [
  {
    id: '1',
    subject: 'Login Issue with Mobile App',
    description: 'I cannot login to the mobile app. It shows an error message every time I try to authenticate.',
    priority: 'high',
    status: 'open',
    authorId: '1',
    authorName: 'John Doe',
    assignedTo: '2',
    assignedToName: 'Sarah Support',
    createdAt: new Date('2024-01-15T10:30:00'),
    updatedAt: new Date('2024-01-15T14:20:00'),
    comments: [
      {
        id: '1',
        content: 'Thank you for reporting this issue. I\'m looking into it now.',
        author: 'Sarah Support',
        authorRole: 'support',
        timestamp: new Date('2024-01-15T14:20:00'),
      },
    ],
  },
  {
    id: '2',
    subject: 'Feature Request: Dark Mode',
    description: 'Could you please add a dark mode option to the application? It would be great for users who work in low-light environments.',
    priority: 'medium',
    status: 'in-progress',
    authorId: '1',
    authorName: 'John Doe',
    assignedTo: '2',
    assignedToName: 'Sarah Support',
    createdAt: new Date('2024-01-14T09:15:00'),
    updatedAt: new Date('2024-01-15T11:30:00'),
    comments: [
      {
        id: '2',
        content: 'This is a great suggestion! I\'ve forwarded it to our development team.',
        author: 'Sarah Support',
        authorRole: 'support',
        timestamp: new Date('2024-01-15T11:30:00'),
      },
    ],
  },
  {
    id: '3',
    subject: 'Payment Processing Error',
    description: 'Getting error code 500 when trying to process payments through the checkout.',
    priority: 'urgent',
    status: 'resolved',
    authorId: '1',
    authorName: 'John Doe',
    assignedTo: '3',
    assignedToName: 'Admin Wilson',
    createdAt: new Date('2024-01-13T16:45:00'),
    updatedAt: new Date('2024-01-14T08:00:00'),
    comments: [
      {
        id: '3',
        content: 'We\'ve identified the issue and deployed a fix. Please try again.',
        author: 'Admin Wilson',
        authorRole: 'admin',
        timestamp: new Date('2024-01-14T08:00:00'),
      },
    ],
  },
];

export function TicketProvider({ children }: { children: React.ReactNode }) {
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets);

  const createTicket = (ticketData: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt' | 'comments'>) => {
    const newTicket: Ticket = {
      ...ticketData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
      comments: [],
    };
    setTickets(prev => [newTicket, ...prev]);
  };

  const updateTicket = (id: string, updates: Partial<Ticket>) => {
    setTickets(prev => prev.map(ticket => 
      ticket.id === id 
        ? { ...ticket, ...updates, updatedAt: new Date() }
        : ticket
    ));
  };

  const addComment = (ticketId: string, content: string, author: string, authorRole: string) => {
    const newComment: Comment = {
      id: Date.now().toString(),
      content,
      author,
      authorRole,
      timestamp: new Date(),
    };
    
    setTickets(prev => prev.map(ticket => 
      ticket.id === ticketId 
        ? { 
            ...ticket, 
            comments: [...ticket.comments, newComment],
            updatedAt: new Date() 
          }
        : ticket
    ));
  };

  const getTicketsByUser = (userId: string) => {
    return tickets.filter(ticket => ticket.authorId === userId);
  };

  const getAllTickets = () => {
    return tickets;
  };

  const value = {
    tickets,
    createTicket,
    updateTicket,
    addComment,
    getTicketsByUser,
    getAllTickets,
  };

  return (
    <TicketContext.Provider value={value}>
      {children}
    </TicketContext.Provider>
  );
}

export function useTickets() {
  const context = useContext(TicketContext);
  if (context === undefined) {
    throw new Error('useTickets must be used within a TicketProvider');
  }
  return context;
}