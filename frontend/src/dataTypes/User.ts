export interface User {
    id: string;
    name: string;
    email: string;
    password?: string;
    stripeCustomerId?: string;
}

export interface PaymentMethod {
    id: string;
    card: any;
}