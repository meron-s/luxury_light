import { z } from 'astro:content';

export const siteSchema = z.object({
  name: z.string(),
  brand: z.string(),
  tagline: z.string(),
  slogan: z.string(),
  slogan_am: z.string(),
  phones: z.array(
    z.object({
      number: z.string(),
      label: z.string()
    })
  ),
  telegram: z.object({
    channel: z.string().url(),
    inbox: z.string().url(),
    inboxHandle: z.string()
  }),
  tiktok: z.string().url(),
  address: z.object({
    line: z.string(),
    city: z.string(),
    country: z.string(),
    landmarks: z.string().optional()
  }),
  map: z.object({
    shareUrl: z.string(),
    embedUrl: z.string()
  }),
  hours: z.string()
});

export const categorySchema = z.object({
  slug: z.string(),
  name: z.string(),
  name_am: z.string(),
  tagline: z.string(),
  image: z.string(),
  description: z.string()
});

export const productSchema = z.object({
  id: z.string(),
  category: z.string(),
  name: z.string(),
  description: z.string(),
  image: z.string(),
  specs: z.object({
    watt: z.string(),
    ip: z.string(),
    color: z.string()
  }),
  badge: z.enum(['New', 'Popular']).nullable().optional()
});

export const galleryItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  category: z.string(),
  image: z.string(),
  alt: z.string(),
  description: z.string()
});

export const collections = {};
