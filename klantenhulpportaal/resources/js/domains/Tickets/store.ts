import {storeModuleFactory} from '../../services/store';
import {Ticket} from './types';

export const ticketStore = storeModuleFactory<Ticket>('tickets');
