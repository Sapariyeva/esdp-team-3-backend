import { EOrderStatus } from '@/enum/EOrderStatus.enum';
import { ERole } from '@/enum/ERole.enum';
import { EUserStatus } from '@/enum/EUserStatus.enum';

interface IGetParams {
    offset: number;
    limit: number;
    sortBy?: string,
    sortOrder?: 'ASC' | 'DESC';
}

export interface IGetOrderParams extends IGetParams {
    service?: number | null;
    manager?: number | null;
    customer?: number | null;
    performer?: number | null;
    status?: EOrderStatus | null;
}

export interface IGetUserParams extends IGetParams {
    displayName?: string | null;
    phone?: string | null;
    email?: string | null;
    role?: ERole | null;
    identifyingNumber?: string | null;
    status?: EUserStatus | null;
}