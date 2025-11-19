import {storeModuleFactory} from '../../services/store';
import {Note} from './types';

export const noteStore = storeModuleFactory<Note>('notes');
