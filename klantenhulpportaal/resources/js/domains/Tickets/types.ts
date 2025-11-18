import type { User } from '../../types/auth';
import type { Category } from '../Categories/types';

export interface Ticket {
  id: number;
  title: string;
  content: string;
  status: string;
  user_id: number;
  assigned_to?: number;
  category_id: number;
  created_at: string;
  updated_at: string;
  creator?: User;
  assignedAdmin?: User;
  category?: Category;
  notes?: Note[];
  replies?: Reply[];
}

export interface Reply {
  id: number;
  ticket_id: number;
  user_id: number;
  content: string;
  created_at: string;
  updated_at: string;
  ticket?: Ticket;
  author?: User;
}

export interface Note {
  id: number;
  ticket_id: number;
  admin_id: number;
  content: string;
  created_at: string;
  updated_at: string;
  ticket?: Ticket;
  admin?: User;
}

export interface CreateTicketForm {
  title: string;
  content: string;
  category_id: number;
}

export interface UpdateTicketForm {
  title?: string;
  content?: string;
  status?: string;
  assigned_to?: number;
  category_id?: number;
}

export interface CreateReplyForm {
  content: string;
}

export interface CreateNoteForm {
  content: string;
}

// Status and UI related types
export type TicketStatus = '0' | '1' | '2';
export type StatusClassMap = Record<TicketStatus, string>;
export type StatusTextMap = Record<TicketStatus, string>;

export interface DateFormatOptions {
  year: 'numeric' | '2-digit';
  month: 'numeric' | '2-digit' | 'long' | 'short' | 'narrow';
  day: 'numeric' | '2-digit';
  hour: 'numeric' | '2-digit';
  minute: 'numeric' | '2-digit';
}

// Sorting related types
export type SortField = 'status' | 'category' | 'creator' | 'created_at';
export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  field: SortField | null;
  direction: SortDirection;
}

// Filtering related types
export interface FilterConfig {
  status: string;
  category: string;
  creator: string;
  title: string;
}

export interface StatusOption {
  value: string;
  label: string;
}