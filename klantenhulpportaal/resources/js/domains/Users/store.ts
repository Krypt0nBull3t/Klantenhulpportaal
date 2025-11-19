import {storeModuleFactory} from '../../services/store';
import {User} from '../../types/auth';

export const userStore = storeModuleFactory<User>('users');
