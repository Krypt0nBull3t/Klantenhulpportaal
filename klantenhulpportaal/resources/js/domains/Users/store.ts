/**
 * @file store.ts
 * @description Store module for managing users using the factory pattern
 * @module userStore
 */

import { storeModuleFactory } from '../../services/store';
import { User } from '../../types/auth';

/**
 * @module userStore
 * @description Store module for managing users with CRUD operations.
 * Provides actions for fetching, creating, updating, and deleting users.
 * Includes getters for accessing all users and individual users by ID.
 */
export const userStore = storeModuleFactory<User>('users');