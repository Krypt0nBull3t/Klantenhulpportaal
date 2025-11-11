import { postRequest, getRequest } from '../http';
import { ref, readonly } from 'vue';
import type { User } from '../../types/auth';

const user = ref<User | null>(null);

interface LoginCredentials {
    email: string;
    password: string;
}

interface RegistrationData {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
}

export const login = async (credentials: LoginCredentials) => {
    const { data } = await postRequest('/login', credentials);
    if (!data) return;
    user.value = data.user;
};

export async function logout() {
    const response = await postRequest('/logout', {});
    user.value = null;
    return response;
}

export async function fetchUser() {
    const { data } = await getRequest('/user');
    if (!data) return;
    user.value = data as User;
    return { data };
}

export async function register(data: RegistrationData) {
    const response = await postRequest('/register', data);
    return response;
}

export async function checkAuth(): Promise<boolean> {
    const response = await fetchUser();
    if (response?.data && response.data.email) {
        user.value = response.data as User;
        return true;
    } else {
        user.value = null;
        return false;
    }
}

export function useAuth() {
    return {
        user: readonly(user),
    };
}

export type { LoginCredentials, User };