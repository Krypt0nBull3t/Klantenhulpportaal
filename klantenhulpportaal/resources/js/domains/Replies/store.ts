import {storeModuleFactory} from '../../services/store';
import {Reply} from './types';

export const replyStore = storeModuleFactory<Reply>('replies');
