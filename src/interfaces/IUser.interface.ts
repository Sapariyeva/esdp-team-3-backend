import { ERole } from "../enum/ERole.enum";
import { EUserStatus } from "../enum/EUserStatus.enum";

export interface IUserWithoutPass {
    id: number;
    phone: string;
    displayName: string;
    email: string;
    birthday: string;
    avatar: string;
    role: ERole;
    avgRating: number;
    ratingCount: number;
    lastPostition: string;
    identifyingNumber: string;
    status: EUserStatus;
}

export interface IUser extends Required<IUserWithoutPass> {
    password: string;
}