import { RequestHandler } from 'express';
import { UserRepository } from '../repositories/user.repository';
import { redisClient } from '../services/redis.service';

export const roleChecker: (roles: string[]) => RequestHandler = (roles) => async (req, res, next) => {
    const token = req.headers['authorization']?.replace('Bearer ', '');
    const userId = token ? await redisClient.get(token) : null;

    if (!token || !userId) {
        res.status(401).send({ success: false, message: 'Unauthorized' });
    } else {
        const userRepository = new UserRepository();
        const user = await userRepository.getUserById(parseInt(userId));
        if (user && roles.includes(user.role)) {
            req.app.locals.user = user;
            next();
        } else {
            res.status(403).send({ success: false, message: 'Access Denied' });
        }
    }
};
