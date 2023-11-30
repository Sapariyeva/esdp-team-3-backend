import { RequestHandler } from 'express';
import { UserRepository } from '../repositories/user.repository';
import { redisClient } from '../services/redis.service';

export const roleChecker: (roles: string[]) => RequestHandler = (roles) => async (req, res, next) => {
    const token = req.headers['authorization']?.replace('Bearer ', '');
    const user_id = token ? await redisClient.get(token) : null;

    if (!token || !user_id) {
        res.status(401).send({ success: false, message: 'Unauthorized' });
    } else {
        const userRepository = new UserRepository();
        const user = await userRepository.getUserById(parseInt(user_id));
        if (user && roles.includes(user.role)) {
            req.app.locals.user = user;
            next();
        } else {
            res.status(403).send({ success: false, message: 'Access Denied' });
        }
    }
};
