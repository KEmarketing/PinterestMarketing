import { defineCollection, z } from 'astro:content';

/* Every field here becomes an editable field in the CMS.
   Adding a page = adding one file in src/content/pages/. */

const linkGroup = z.object({
  label: z.string(),
  url: z.string(),
});

const pages = defineCollection({
  type: 'content',
  schema: z.object({
    /* --- page level --- */
    title: z.string(),
    metaDescription: z.string(),
    urlPath: z.string().optional(),
    draft: z.boolean().default(false),

    /* --- hero --- */
    hero: z.object({
      heading: z.string(),
      subheading: z.string(),
      cta: linkGroup,
      secondaryCta: linkGroup.optional(),
      image: z.string().optional(),
      imageAlt: z.string().optional(),
    }),

    /* --- the hook --- */
    hook: z.object({
      heading: z.string(),
      body: z.string(),
    }),

    /* --- what Pinterest actually is --- */
    explainer: z.object({
      heading: z.string(),
      body: z.string(),
      points: z.array(z.object({ heading: z.string(), body: z.string() })).default([]),
    }),

    /* --- who this is for (the qualification gate) --- */
    whoFor: z.object({
      heading: z.string(),
      intro: z.string(),
      items: z.array(z.string()).default([]),
      footnote: z.string().optional(),
    }),

    /* --- packages --- */
    packages: z.object({
      heading: z.string(),
      intro: z.string().optional(),
      note: z.string().optional(),
      items: z.array(z.object({
        name: z.string(),
        price: z.string(),
        cadence: z.string().optional(),
        summary: z.string().optional(),
        features: z.array(z.string()).default([]),
        featured: z.boolean().default(false),
        cta: linkGroup.optional(),
      })).default([]),
    }),

    /* --- pin examples --- */
    work: z.object({
      heading: z.string(),
      intro: z.string().optional(),
      images: z.array(z.object({ src: z.string(), alt: z.string() })).default([]),
    }),

    /* --- about --- */
    about: z.object({
      heading: z.string(),
      body: z.string(),
      bullets: z.array(z.string()).default([]),
      image: z.string().optional(),
      imageAlt: z.string().optional(),
    }),

    /* --- testimonials --- */
    testimonials: z.object({
      heading: z.string(),
      items: z.array(z.object({
        quote: z.string(),
        name: z.string(),
        role: z.string().optional(),
        image: z.string().optional(),
        imageAlt: z.string().optional(),
      })).default([]),
    }),

    /* --- process --- */
    process: z.object({
      heading: z.string(),
      steps: z.array(z.object({ heading: z.string(), body: z.string() })).default([]),
    }),

    /* --- faq --- */
    faq: z.object({
      heading: z.string(),
      items: z.array(z.object({ question: z.string(), answer: z.string() })).default([]),
    }),

    /* --- chapter breaks between acts --- */
    chapters: z.array(z.object({
      line: z.string(),
      sub: z.string().optional(),
    })).default([]),

    /* --- contact --- */
    contact: z.object({
      heading: z.string(),
      body: z.string(),
      cta: linkGroup,
      email: z.string().optional(),
      facebook: z.string().optional(),
      responseNote: z.string().optional(),
    }),

    /* --- closing cta --- */
    closing: z.object({
      heading: z.string(),
      body: z.string(),
      cta: linkGroup,
    }),
  }),
});

export const collections = { pages };
