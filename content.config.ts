import { defineContentConfig, defineCollection, z } from "@nuxt/content";

export default defineContentConfig({
  highlight: {
    theme: "github-light",
  },
  i18n: {
    locales: ["en", "es"],
    defaultLocale: "es",
  },
  collections: {
    blog: defineCollection({
      type: "page",
      source: "posts/**/*.md",
      schema: z.object({
        slug: z.string().min(1),
        title: z.string().min(3),
        description: z.string().min(10),
        date: z.string().refine((value) => !Number.isNaN(Date.parse(value)), {
          message: "Invalid date format",
        }),
        _locale: z.enum(["en", "es"]),
      }),
    }),
  },
});
