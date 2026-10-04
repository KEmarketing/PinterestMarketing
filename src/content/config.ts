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
      /* an optional first line, set darker and on its own line */
      headingLead: z.string().optional(),
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
      sub: z.string().optional(),
      body: z.string(),
      bullets: z.array(z.string()).default([]),
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
      intro: z.string().optional(),
      items: z.array(z.string()).default([]),
      /* second column: what a business needs in place already */
      needsHeading: z.string().optional(),
      needs: z.array(z.string()).default([]),
      footnote: z.string().optional(),
      /* her mockup puts a mint "Book a discovery call." under the list */
      ctaLabel: z.string().optional(),
    }),

    /* --- packages --- */
    packages: z.object({
      heading: z.string(),
      ctaLabel: z.string().optional(),
      intro: z.string().optional(),
      note: z.string().optional(),
      items: z.array(z.object({
        name: z.string(),
        price: z.string(),
        cadence: z.string().optional(),
        summary: z.string().optional(),
        features: z.array(z.string()).default([]),
        featured: z.boolean().default(false),
        /* optional tab above the card, e.g. "New to Pinterest" */
        tab: z.string().optional(),
        /* navy by default; her mockup gives The Signature a coral one */
        tabTone: z.enum(['navy', 'coral']).optional(),
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
      kicker: z.string().optional(),
      heading: z.string(),
      body: z.string(),
      bullets: z.array(z.string()).default([]),
      image: z.string().optional(),
      imageAlt: z.string().optional(),
      /* her mockup puts a coral "Book a call with Kandace" under the photo */
      ctaLabel: z.string().optional(),
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
      ctaLabel: z.string().optional(),
      aside: z.string().optional(),
      steps: z.array(z.object({ heading: z.string(), body: z.string() })).default([]),
    }),

    /* --- pinterest stats --- */
    stats: z.object({
      heading: z.string(),
      items: z.array(z.object({
        value: z.string(),
        label: z.string(),
        note: z.string().optional(),
      })).default([]),
      body: z.string().optional(),
    }).optional(),

    /* --- faq --- */
    faq: z.object({
      heading: z.string(),
      items: z.array(z.object({
        question: z.string(),
        answer: z.string(),
        /* optional booking button under the answer */
        ctaLabel: z.string().optional(),
      })).default([]),
    }),

    /* --- chapter breaks between acts --- */
    chapters: z.array(z.object({
      line: z.string(),
      sub: z.string().optional(),
      /* pin designs shown either side of the line: two or four */
      pins: z.array(z.string()).default([]),
    })).default([]),

    /* --- email signup ---
       Her closing screen is the email list invitation. The words for it
       live in `closing`; this group holds the switch, the link and the
       button text. `show` turns both email list buttons on or off, so
       they can stay hidden until she has picked an email platform. It
       is a link out, not a wired integration, so any platform that
       gives her a hosted signup page works. */
    signup: z.object({
      /* one switch for both email list buttons (header and last screen) */
      show: z.boolean().default(true),
      url: z.string().optional(),
      headerLabel: z.string().optional(),
      buttonLabel: z.string().optional(),
    }).optional(),

    /* --- contact --- */
    contact: z.object({
      heading: z.string(),
      body: z.string(),
      cta: linkGroup,
      boxHeading: z.string().optional(),
      boxBody: z.string().optional(),
      email: z.string().optional(),
      facebook: z.string().optional(),
      responseNote: z.string().optional(),
    }),

    /* --- closing cta --- */
    closing: z.object({
      heading: z.string(),
      body: z.string(),
      /* the italic last line under the button */
      signoff: z.string().optional(),
    }),
  }),
});

export const collections = { pages };
