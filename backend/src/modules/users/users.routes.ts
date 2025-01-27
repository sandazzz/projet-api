import { FastifyInstance } from 'fastify';
import { registerUsersHandler } from './users.controllers';

export default async function userRoutes(fastify: FastifyInstance) {
  fastify.post('/register', registerUsersHandler)
}
