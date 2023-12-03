import { ERole } from "./ERole.enum";
import { EUserStatus } from "./EUserStatus.enum";

export interface IUserWithoutPass {
    id: number;
    phone: string;
    display_name: string;
    email: string;
    birthday: string;
    avatar: string;
    role: ERole;
    avg_rating: number;
    rating_count: number;
    last_postition: string;
    identifying_number: number;
    status: EUserStatus;
}

export interface IUser extends Required<IUserWithoutPass> {
    password: string;
}