// Import the framework and instantiate it
import Fastify from "fastify";
import userRoutes from "./modules/users/users.routes";
import authRoutes from "./modules/auth/auth.routes";
import adsRoutes from "./modules/ads/ads.routes";

const fastify = Fastify({
  logger: true,
});

fastify.register(userRoutes, { prefix: "/api" });
fastify.register(authRoutes, { prefix: "/api" });
fastify.register(adsRoutes, { prefix: "/api" });

// Run the server!
try {
  await fastify.listen({ port: 3000 });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}

/*{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "securepassword123"
}*/
