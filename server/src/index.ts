import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import 'dotenv/config';
import cors from 'cors';
import superjson from 'superjson';
import { z } from 'zod';

// Import schema types
import {
  createProjectInputSchema,
  updateProjectInputSchema,
  projectsQuerySchema,
  createAboutContentInputSchema,
  updateAboutContentInputSchema,
  createContactSubmissionInputSchema,
  updateContactSubmissionInputSchema,
  createSiteConfigInputSchema,
  updateSiteConfigInputSchema
} from './schema';

// Import handlers
import { createProject } from './handlers/create_project';
import { getProjects } from './handlers/get_projects';
import { getProjectBySlug } from './handlers/get_project_by_slug';
import { updateProject } from './handlers/update_project';
import { deleteProject } from './handlers/delete_project';
import { getFeaturedProjects } from './handlers/get_featured_projects';
import { createAboutContent } from './handlers/create_about_content';
import { getAboutContent, getAboutContentByKey } from './handlers/get_about_content';
import { updateAboutContent } from './handlers/update_about_content';
import { createContactSubmission } from './handlers/create_contact_submission';
import { getContactSubmissions } from './handlers/get_contact_submissions';
import { updateContactSubmission } from './handlers/update_contact_submission';
import { createSiteConfig } from './handlers/create_site_config';
import { getSiteConfig, getSiteConfigByKey } from './handlers/get_site_config';
import { updateSiteConfig } from './handlers/update_site_config';
import { getProjectCategories } from './handlers/get_project_categories';

const t = initTRPC.create({
  transformer: superjson,
});

const publicProcedure = t.procedure;
const router = t.router;

const appRouter = router({
  // Health check endpoint
  healthcheck: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),

  // Project management routes
  projects: router({
    // Create a new project
    create: publicProcedure
      .input(createProjectInputSchema)
      .mutation(({ input }) => createProject(input)),

    // Get paginated projects with filtering
    list: publicProcedure
      .input(projectsQuerySchema)
      .query(({ input }) => getProjects(input)),

    // Get project by slug for detail page
    bySlug: publicProcedure
      .input(z.string().min(1))
      .query(({ input }) => getProjectBySlug(input)),

    // Update existing project
    update: publicProcedure
      .input(updateProjectInputSchema)
      .mutation(({ input }) => updateProject(input)),

    // Delete project
    delete: publicProcedure
      .input(z.number().int().positive())
      .mutation(({ input }) => deleteProject(input)),

    // Get featured projects for homepage
    featured: publicProcedure
      .input(z.number().int().positive().max(10).default(3))
      .query(({ input }) => getFeaturedProjects(input)),

    // Get unique project categories
    categories: publicProcedure
      .query(() => getProjectCategories()),
  }),

  // About page content management
  about: router({
    // Create about content block
    create: publicProcedure
      .input(createAboutContentInputSchema)
      .mutation(({ input }) => createAboutContent(input)),

    // Get all about content blocks
    list: publicProcedure
      .query(() => getAboutContent()),

    // Get specific about content by key
    byKey: publicProcedure
      .input(z.string().min(1))
      .query(({ input }) => getAboutContentByKey(input)),

    // Update about content block
    update: publicProcedure
      .input(updateAboutContentInputSchema)
      .mutation(({ input }) => updateAboutContent(input)),
  }),

  // Contact form and submissions
  contact: router({
    // Submit contact form
    submit: publicProcedure
      .input(createContactSubmissionInputSchema)
      .mutation(({ input }) => createContactSubmission(input)),

    // Get paginated contact submissions (admin)
    list: publicProcedure
      .input(z.object({
        status: z.enum(['unread', 'read', 'replied', 'archived']).optional(),
        limit: z.number().int().positive().max(100).default(20),
        offset: z.number().int().nonnegative().default(0),
        orderBy: z.enum(['created_at', 'updated_at', 'name']).default('created_at'),
        orderDirection: z.enum(['asc', 'desc']).default('desc')
      }))
      .query(({ input }) => getContactSubmissions(input)),

    // Update contact submission status
    updateStatus: publicProcedure
      .input(updateContactSubmissionInputSchema)
      .mutation(({ input }) => updateContactSubmission(input)),
  }),

  // Site configuration management
  config: router({
    // Create site config entry
    create: publicProcedure
      .input(createSiteConfigInputSchema)
      .mutation(({ input }) => createSiteConfig(input)),

    // Get site configuration (public only by default)
    list: publicProcedure
      .input(z.boolean().default(true))
      .query(({ input }) => getSiteConfig(input)),

    // Get specific config by key
    byKey: publicProcedure
      .input(z.object({
        key: z.string().min(1),
        publicOnly: z.boolean().default(true)
      }))
      .query(({ input }) => getSiteConfigByKey(input.key, input.publicOnly)),

    // Update site config entry
    update: publicProcedure
      .input(updateSiteConfigInputSchema)
      .mutation(({ input }) => updateSiteConfig(input)),
  }),
});

export type AppRouter = typeof appRouter;

async function start() {
  const port = process.env['SERVER_PORT'] || 2022;
  const server = createHTTPServer({
    middleware: (req, res, next) => {
      cors()(req, res, next);
    },
    router: appRouter,
    createContext() {
      return {};
    },
  });
  server.listen(port);
  console.log(`TRPC server listening at port: ${port}`);
}

start();