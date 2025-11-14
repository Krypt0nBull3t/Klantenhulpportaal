import { storeModuleFactory } from '../../services/store';
import { Category } from './types';


/**
 * @module categoryStore
 * @description Store module for managing categories.
 */
export const categoryStore = storeModuleFactory<Category>('categories');