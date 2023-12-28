import { IUserWithoutPass } from '@/interfaces/IUser.interface';
import { redisClient } from '@/services/redis.service';
import { sign, verify } from 'jsonwebtoken';
import dotenv from "dotenv";
import * as process from "process";

dotenv.config();

export class TokenService {
    generateTokens(payload: IUserWithoutPass) {
        const accessToken = sign(payload, process.env.JWT_ACCESS_SECRET!, { expiresIn: `${process.env.JWT_ACCESS_TIME}s` });
        const refreshToken = sign(payload, process.env.JWT_REFRESH_SECRET!, { expiresIn: `${process.env.JWT_REFRESH_TIME}s` });
        return { accessToken, refreshToken }
    }

    validateAccessToken(token: string) {
        try {
            const userData = verify(token, process.env.JWT_ACCESS_SECRET!);
            return userData;
        } catch (e: any) {
            return null;
        }
    }

    validateRefreshToken(token: string) {
        try {
            const userData = verify(token, process.env.JWT_REFRESH_SECRET!);
            return userData;
        } catch (e: any) {
            return null;
        }
    }

    async saveTokens(userId: number, { refreshToken, accessToken }: { refreshToken: string, accessToken: string }) {
        await redisClient.set(accessToken, userId, { EX: parseInt(process.env.JWT_ACCESS_TIME!) });
        await redisClient.set(refreshToken, userId, { EX: parseInt(process.env.JWT_REFRESH_TIME!) });
    }

    async removeToken(token: string): Promise<number> {
        return redisClient.del(token);
    }

    async findToken(token: string): Promise<string | null> {
        return await redisClient.get(token);
    }
}
