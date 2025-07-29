import { FastifyInstance } from 'fastify';
import { Favorite } from '../models/Favorite';
import { Template } from '../models/Template';

interface AddFavoriteBody {
  templateId: string;
}

export const registerFavoriteRoutes = (fastify: FastifyInstance): void => {
  // Get user's favorites
  fastify.get(
    '/',
    {
      preHandler: [fastify.authenticate],
    },
    async (request, reply) => {
      try {
        const sessionUser = request.session.user;
        if (!sessionUser) {
          return reply.status(401).send({ success: false, message: 'Unauthorized' });
        }

        const favorites = await Favorite.find({ userId: sessionUser.id })
          .populate({
            path: 'templateId',
            select: 'title description price category tags previewImages downloads sales rating reviewCount isActive',
            match: { isActive: true }
          })
          .sort({ createdAt: -1 });

        // Filter out templates that are no longer active
        const activeFavorites = favorites.filter(fav => fav.templateId);

        reply.send({
          success: true,
          data: { favorites: activeFavorites },
        });
      } catch (error) {
        fastify.log.error(error);
        reply.status(500).send({ success: false, message: 'Internal Server Error' });
      }
    }
  );

  // Add template to favorites
  fastify.post<{ Body: AddFavoriteBody }>(
    '/',
    {
      preHandler: [fastify.authenticate],
      schema: {
        body: {
          type: 'object',
          required: ['templateId'],
          properties: {
            templateId: { type: 'string' },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        const sessionUser = request.session.user;
        if (!sessionUser) {
          return reply.status(401).send({ success: false, message: 'Unauthorized' });
        }

        const { templateId } = request.body;

        // Verify template exists and is active
        const template = await Template.findById(templateId);
        if (!template || !template.isActive) {
          return reply.status(404).send({ success: false, message: 'Template not found or inactive' });
        }

        // Check if already favorited
        const existingFavorite = await Favorite.findOne({
          userId: sessionUser.id,
          templateId,
        });

        if (existingFavorite) {
          return reply.status(409).send({ success: false, message: 'Template already in favorites' });
        }

        const favorite = new Favorite({
          userId: sessionUser.id,
          templateId,
        });

        await favorite.save();

        reply.status(201).send({
          success: true,
          message: 'Template added to favorites',
          data: { favorite },
        });
      } catch (error) {
        fastify.log.error(error);
        reply.status(500).send({ success: false, message: 'Internal Server Error' });
      }
    }
  );

  // Remove template from favorites
  fastify.delete<{ Params: { templateId: string } }>(
    '/:templateId',
    {
      preHandler: [fastify.authenticate],
      schema: {
        params: {
          type: 'object',
          required: ['templateId'],
          properties: {
            templateId: { type: 'string' },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        const sessionUser = request.session.user;
        if (!sessionUser) {
          return reply.status(401).send({ success: false, message: 'Unauthorized' });
        }

        const { templateId } = request.params as { templateId: string };

        const favorite = await Favorite.findOneAndDelete({
          userId: sessionUser.id,
          templateId,
        });

        if (!favorite) {
          return reply.status(404).send({ success: false, message: 'Favorite not found' });
        }

        reply.send({
          success: true,
          message: 'Template removed from favorites',
        });
      } catch (error) {
        fastify.log.error(error);
        reply.status(500).send({ success: false, message: 'Internal Server Error' });
      }
    }
  );

  // Check if template is favorited
  fastify.get<{ Querystring: { templateId: string } }>(
    '/check',
    {
      preHandler: [fastify.authenticate],
      schema: {
        querystring: {
          type: 'object',
          required: ['templateId'],
          properties: {
            templateId: { type: 'string' },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        const sessionUser = request.session.user;
        if (!sessionUser) {
          return reply.status(401).send({ success: false, message: 'Unauthorized' });
        }

        const { templateId } = request.query;

        const favorite = await Favorite.findOne({
          userId: sessionUser.id,
          templateId,
        });

        reply.send({
          success: true,
          data: { isFavorited: !!favorite },
        });
      } catch (error) {
        fastify.log.error(error);
        reply.status(500).send({ success: false, message: 'Internal Server Error' });
      }
    }
  );
}; 