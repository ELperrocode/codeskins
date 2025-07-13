import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { IUser } from '../models/User';

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
  interface FastifyRequest {
    user?: IUser;
    login: (user: IUser, callback: (err?: Error) => void) => void;
    logout: () => void;
    isAuthenticated: () => boolean;
  }
} 