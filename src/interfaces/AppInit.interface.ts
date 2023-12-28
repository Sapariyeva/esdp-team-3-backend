import { RequestHandler } from 'express';
import { IRoute } from '@/interfaces/IRoute.interface';

export interface AppInit {
	port: number;
	middlewares: RequestHandler[];
	routes: IRoute[];
}
