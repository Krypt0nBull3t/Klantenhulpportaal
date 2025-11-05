import { ref, computed } from 'vue';
import { getRequest, postRequest, putRequest, deleteRequest } from '../http';

export type New<T extends {id: number}> = Omit<T, 'id'>;

export const storeModuleFactory = <T extends { id: number }>(moduleName:string) => {
    const state = ref<Record<number, T>>({});

    const getters = {
        all: computed(() => state.value),
        getById: (id : number) => computed(() => state.value[id])
    };

    const setters = {
        setAll: (items: T[]) => {
            for (const item of items) state.value[item.id] = Object.freeze(item);
        },

        deleteByItem: (id: number) => {
            delete state.value[id];
        }
    };

    const actions = {
        getAll: async () => {
            const { data } = await getRequest(moduleName);
            if (!data) return;
            setters.setAll(data);
        },

        create: async (item: New<T>) => {
            const { data } = await postRequest(moduleName, item);
            if (!data) return;
            setters.setAll(data);
        },

        update: async (id: number, item: T) => {
            const { data } = await putRequest(`${moduleName}/${id}`, item);
            if (!data) return;
            setters.setAll(data);
        },

        delete: async (id: number) => {
            const response = await deleteRequest(`${moduleName}/${id}`);
            if (response && (!response.data || !response.data.message)) {
                setters.deleteByItem(id);
            }
            return response;
        }
        
    };

    return { getters, setters, actions };
};