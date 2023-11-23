import { ERole } from "./ERole.enum";

export interface IUser {
    id: number;
    display_name: string;
    username: string;
    email: string;
    phone: string;
    password: string;
    avatar: string;
    token?: string | null;
    role: ERole;
    avg_rating: number;
    rating_count: number;
    last_postition: string;
}
