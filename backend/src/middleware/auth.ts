import { FastifyRequest, FastifyReply } from 'fastify';
import jwt from 'jsonwebtoken';

export const authenticate = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
  try {
    const authHeader = request.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      reply.status(401).send({
        success: false,
        message: 'Access token required'
      });
      return;
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    const decoded = jwt.verify(token, process.env['JWT_SECRET'] || 'fallback-secret') as any;
    
    // Add user info to request
    (request as any).user = decoded;
    
  } catch (error) {
    reply.status(401).send({
      success: false,
      message: 'Invalid or expired token'
    });
  }
}; 