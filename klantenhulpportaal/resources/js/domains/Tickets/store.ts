/**
 * @file store.ts
 * @description Store module for managing tickets using the factory pattern
 * @module ticketStore
 */

import { storeModuleFactory } from '../../services/store';
import { Ticket } from './types';

/**
 * @module ticketStore
 * @description Store module for managing tickets with CRUD operations.
 * Provides actions for fetching, creating, updating, and deleting tickets.
 * Includes getters for accessing all tickets and individual tickets by ID.
 */
export const ticketStore = storeModuleFactory<Ticket>('tickets');