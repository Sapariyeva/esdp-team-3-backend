import { ERole } from "./ERole.enum";

export interface IUser {
    id: number;
    displayName: string;
    username: string;
    password: string;
    token?: string | null;
    role: ERole
}
