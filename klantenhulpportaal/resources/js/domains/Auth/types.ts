export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegistrationForm {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
}

export interface PasswordResetForm {
    email: string;
}
