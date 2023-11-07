import { ErrorRequestHandler } from "express";

export const errorHandler = (): ErrorRequestHandler => (err, req, res, next) => {
    console.log(err);
    console.log('ERROR HANDLER');
    res.status(500).send({
        success: false,
        message: 'Internal server error'
    });
}