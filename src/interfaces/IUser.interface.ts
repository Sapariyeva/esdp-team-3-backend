import { ERole } from "./ERole.enum";
import { EUserStatus } from "./EUserStatus.enum";

export interface IUser {
    id: number;
    phone: string;
    display_name: string;
    username: string;
    email: string;
    password: string;
    birthday: string;
    avatar: string;
    token?: string | null;
    role: ERole;
    avg_rating: number;
    rating_count: number;
    last_postition: string;
    identifying_number: number;
    status: EUserStatus;
}
