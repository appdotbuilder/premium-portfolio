import { z } from 'zod';

// Project schema
export const projectSchema = z.object({
  id: z.number(),
  title: z.string(),
  slug: z.string(),
  description: z.string(),
  long_description: z.string().nullable(),
  featured_image_url: z.string(),
  gallery_images: z.array(z.string()), // JSON array of image URLs
  technologies: z.array(z.string()), // JSON array of technology names
  project_url: z.string().nullable(),
  github_url: z.string().nullable(),
  category: z.string(),
  is_featured: z.boolean(),
  sort_order: z.number().int(),
  status: z.enum(['draft', 'published', 'archived']),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Project = z.infer<typeof projectSchema>;

// Input schema for creating projects
export const createProjectInputSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().min(1, "Description is required"),
  long_description: z.string().nullable(),
  featured_image_url: z.string().url("Must be a valid URL"),
  gallery_images: z.array(z.string().url()).default([]),
  technologies: z.array(z.string()).default([]),
  project_url: z.string().url().nullable(),
  github_url: z.string().url().nullable(),
  category: z.string().min(1, "Category is required"),
  is_featured: z.boolean().default(false),
  sort_order: z.number().int().default(0),
  status: z.enum(['draft', 'published', 'archived']).default('draft')
});

export type CreateProjectInput = z.infer<typeof createProjectInputSchema>;

// Input schema for updating projects
export const updateProjectInputSchema = z.object({
  id: z.number(),
  title: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  long_description: z.string().nullable().optional(),
  featured_image_url: z.string().url().optional(),
  gallery_images: z.array(z.string().url()).optional(),
  technologies: z.array(z.string()).optional(),
  project_url: z.string().url().nullable().optional(),
  github_url: z.string().url().nullable().optional(),
  category: z.string().min(1).optional(),
  is_featured: z.boolean().optional(),
  sort_order: z.number().int().optional(),
  status: z.enum(['draft', 'published', 'archived']).optional()
});

export type UpdateProjectInput = z.infer<typeof updateProjectInputSchema>;

// About content schema
export const aboutContentSchema = z.object({
  id: z.number(),
  content_key: z.string(), // e.g., 'hero_title', 'bio_text', 'skills'
  content_value: z.string(),
  content_type: z.enum(['text', 'html', 'json', 'image_url']),
  is_active: z.boolean(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type AboutContent = z.infer<typeof aboutContentSchema>;

// Input schema for creating about content
export const createAboutContentInputSchema = z.object({
  content_key: z.string().min(1, "Content key is required"),
  content_value: z.string().min(1, "Content value is required"),
  content_type: z.enum(['text', 'html', 'json', 'image_url']),
  is_active: z.boolean().default(true)
});

export type CreateAboutContentInput = z.infer<typeof createAboutContentInputSchema>;

// Input schema for updating about content
export const updateAboutContentInputSchema = z.object({
  id: z.number(),
  content_key: z.string().min(1).optional(),
  content_value: z.string().min(1).optional(),
  content_type: z.enum(['text', 'html', 'json', 'image_url']).optional(),
  is_active: z.boolean().optional()
});

export type UpdateAboutContentInput = z.infer<typeof updateAboutContentInputSchema>;

// Contact submission schema
export const contactSubmissionSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  subject: z.string().nullable(),
  message: z.string(),
  status: z.enum(['unread', 'read', 'replied', 'archived']),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type ContactSubmission = z.infer<typeof contactSubmissionSchema>;

// Input schema for creating contact submissions
export const createContactSubmissionInputSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Must be a valid email"),
  subject: z.string().nullable(),
  message: z.string().min(1, "Message is required")
});

export type CreateContactSubmissionInput = z.infer<typeof createContactSubmissionInputSchema>;

// Input schema for updating contact submissions
export const updateContactSubmissionInputSchema = z.object({
  id: z.number(),
  status: z.enum(['unread', 'read', 'replied', 'archived'])
});

export type UpdateContactSubmissionInput = z.infer<typeof updateContactSubmissionInputSchema>;

// Site configuration schema
export const siteConfigSchema = z.object({
  id: z.number(),
  config_key: z.string(),
  config_value: z.string(),
  config_type: z.enum(['text', 'json', 'boolean', 'number', 'url']),
  is_public: z.boolean(), // Whether this config can be accessed by frontend
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type SiteConfig = z.infer<typeof siteConfigSchema>;

// Input schema for creating site config
export const createSiteConfigInputSchema = z.object({
  config_key: z.string().min(1, "Config key is required"),
  config_value: z.string().min(1, "Config value is required"),
  config_type: z.enum(['text', 'json', 'boolean', 'number', 'url']),
  is_public: z.boolean().default(true)
});

export type CreateSiteConfigInput = z.infer<typeof createSiteConfigInputSchema>;

// Input schema for updating site config
export const updateSiteConfigInputSchema = z.object({
  id: z.number(),
  config_key: z.string().min(1).optional(),
  config_value: z.string().min(1).optional(),
  config_type: z.enum(['text', 'json', 'boolean', 'number', 'url']).optional(),
  is_public: z.boolean().optional()
});

export type UpdateSiteConfigInput = z.infer<typeof updateSiteConfigInputSchema>;

// Query schemas for filtering and pagination
export const projectsQuerySchema = z.object({
  category: z.string().optional(),
  featured: z.boolean().optional(),
  status: z.enum(['draft', 'published', 'archived']).optional(),
  limit: z.number().int().positive().max(100).default(20),
  offset: z.number().int().nonnegative().default(0),
  orderBy: z.enum(['created_at', 'updated_at', 'title', 'sort_order']).default('sort_order'),
  orderDirection: z.enum(['asc', 'desc']).default('asc')
});

export type ProjectsQuery = z.infer<typeof projectsQuerySchema>;

export const contactSubmissionsQuerySchema = z.object({
  status: z.enum(['unread', 'read', 'replied', 'archived']).optional(),
  limit: z.number().int().positive().max(100).default(20),
  offset: z.number().int().nonnegative().default(0),
  orderBy: z.enum(['created_at', 'updated_at', 'name']).default('created_at'),
  orderDirection: z.enum(['asc', 'desc']).default('desc')
});

export type ContactSubmissionsQuery = z.infer<typeof contactSubmissionsQuerySchema>;

// Response schemas for API endpoints
export const paginatedProjectsSchema = z.object({
  data: z.array(projectSchema),
  meta: z.object({
    total: z.number(),
    limit: z.number(),
    offset: z.number(),
    hasMore: z.boolean()
  })
});

export type PaginatedProjects = z.infer<typeof paginatedProjectsSchema>;

export const paginatedContactSubmissionsSchema = z.object({
  data: z.array(contactSubmissionSchema),
  meta: z.object({
    total: z.number(),
    limit: z.number(),
    offset: z.number(),
    hasMore: z.boolean()
  })
});

export type PaginatedContactSubmissions = z.infer<typeof paginatedContactSubmissionsSchema>;