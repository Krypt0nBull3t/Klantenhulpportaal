import {storeModuleFactory} from '../../services/store';
import {Category} from './types';

export const categoryStore = storeModuleFactory<Category>('categories');
