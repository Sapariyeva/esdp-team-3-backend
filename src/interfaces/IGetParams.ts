import { EOrderStatus } from "../enum/EOrderStatus.enum";
import { ERole } from "../enum/ERole.enum";
import { EUserStatus } from "../enum/EUserStatus.enum";

interface IGetParams {
    offset: number;
    limit: number;
}

export interface IGetOrderParams extends IGetParams {
    manager?: number | null;
    customer?: number | null;
    performer?: number | null;
    status?: EOrderStatus | null;
}

export interface IGetUserParams {
    offset: number;
    limit: number;
    phone?: string | null;
    email?: string | null;
    role?: ERole | null;
    status?: EUserStatus | null;
}