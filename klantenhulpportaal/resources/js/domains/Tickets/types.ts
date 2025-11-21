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
}

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

export type SortField = 'id' | 'status' | 'category' | 'creator' | 'assigned_to' | 'created_at' | 'updated_at';
export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
    field: SortField | null;
    direction: SortDirection;
}

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
