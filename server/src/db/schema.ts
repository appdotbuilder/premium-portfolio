import { serial, text, pgTable, timestamp, boolean, integer, json } from 'drizzle-orm/pg-core';

// Projects table
export const projectsTable = pgTable('projects', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description').notNull(),
  long_description: text('long_description'), // Nullable by default
  featured_image_url: text('featured_image_url').notNull(),
  gallery_images: json('gallery_images').$type<string[]>().notNull().default([]), // Array of image URLs
  technologies: json('technologies').$type<string[]>().notNull().default([]), // Array of technology names
  project_url: text('project_url'), // Nullable by default
  github_url: text('github_url'), // Nullable by default
  category: text('category').notNull(),
  is_featured: boolean('is_featured').notNull().default(false),
  sort_order: integer('sort_order').notNull().default(0),
  status: text('status', { enum: ['draft', 'published', 'archived'] }).notNull().default('draft'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// About content table for flexible content management
export const aboutContentTable = pgTable('about_content', {
  id: serial('id').primaryKey(),
  content_key: text('content_key').notNull().unique(), // e.g., 'hero_title', 'bio_text', 'skills'
  content_value: text('content_value').notNull(),
  content_type: text('content_type', { enum: ['text', 'html', 'json', 'image_url'] }).notNull(),
  is_active: boolean('is_active').notNull().default(true),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Contact submissions table
export const contactSubmissionsTable = pgTable('contact_submissions', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  subject: text('subject'), // Nullable by default
  message: text('message').notNull(),
  status: text('status', { enum: ['unread', 'read', 'replied', 'archived'] }).notNull().default('unread'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Site configuration table for global settings
export const siteConfigTable = pgTable('site_config', {
  id: serial('id').primaryKey(),
  config_key: text('config_key').notNull().unique(),
  config_value: text('config_value').notNull(),
  config_type: text('config_type', { enum: ['text', 'json', 'boolean', 'number', 'url'] }).notNull(),
  is_public: boolean('is_public').notNull().default(true), // Whether this config can be accessed by frontend
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// TypeScript types for the table schemas
export type Project = typeof projectsTable.$inferSelect;
export type NewProject = typeof projectsTable.$inferInsert;

export type AboutContent = typeof aboutContentTable.$inferSelect;
export type NewAboutContent = typeof aboutContentTable.$inferInsert;

export type ContactSubmission = typeof contactSubmissionsTable.$inferSelect;
export type NewContactSubmission = typeof contactSubmissionsTable.$inferInsert;

export type SiteConfig = typeof siteConfigTable.$inferSelect;
export type NewSiteConfig = typeof siteConfigTable.$inferInsert;

// Export all tables and relations for proper query building
export const tables = {
  projects: projectsTable,
  aboutContent: aboutContentTable,
  contactSubmissions: contactSubmissionsTable,
  siteConfig: siteConfigTable,
};

