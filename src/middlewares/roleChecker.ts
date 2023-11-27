import { RequestHandler } from 'express';
import { UserRepository } from '../repositories/user.repository';

export const roleChecker = (roles: string[]): RequestHandler => async (req, res, next) => {
    let token = req.headers['authorization']
    if (!token) {
        res.status(401).send({
            success: false,
            message: 'Unauthorized'
        })
    } else {
        if (token.startsWith('Bearer ')) token = token.slice(7);
        const userRepository = new UserRepository();
        const user = await userRepository.getUserByToken(token);
        if (user) {
            user.roles.forEach(role => {
                if (roles.includes(role)) {
                    req.app.locals = {
                        user: user
                    }
                    next()
                }
            });
        } else {
            res.status(403).send({
                success: false,
                message: "Access Denied"
            })
        }
    }
}